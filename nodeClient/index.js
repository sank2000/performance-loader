const os = require('os');
const io = require('socket.io-client');
let socket = io('http://127.0.0.1:8181');

socket.on('connect', () => {
  // console.log('I connected to the socket server... hooray!')

  const nI = os.networkInterfaces();
  let macA;
  // loop through all the nI for this machine and find a non-internal one
  for (let key in nI) {
    if (!nI[key][0].internal) {
      if (nI[key][0].mac === '00:00:00:00:00:00') {
        macA = Math.random().toString(36).substr(2, 15);
      } else {
        macA = nI[key][0].mac;
      }
      break;
    }
  }

  // client auth with single key value
  socket.emit('clientAuth', '5t78yuhgirekjaht32i3');

  performanceData().then((allPerformanceData) => {
    allPerformanceData.macA = macA;
    socket.emit('initPerfData', allPerformanceData);
  });

  // start sending over data on interval
  let perfDataInterval = setInterval(() => {
    performanceData().then((allPerformanceData) => {
      // console.log(allPerformanceData)
      allPerformanceData.macA = macA;
      socket.emit('perfData', allPerformanceData);
    });
  }, 1000);

  socket.on('disconnect', () => {
    clearInterval(perfDataInterval);
  });
});

function performanceData() {
  return new Promise(async (resolve, reject) => {
    const cpus = os.cpus();
    const freeMem = os.freemem();
    const totalMem = os.totalmem();
    const usedMem = totalMem - freeMem;
    const memUsage = Math.floor((usedMem / totalMem) * 100) / 100;
    const osType = os.type() == 'Darwin' ? 'Mac' : os.type();
    const upTime = os.uptime();
    const cpuModel = cpus[0].model;
    const numCores = cpus.length;
    const cpuSpeed = cpus[0].speed;
    const cpuLoad = await getCpuLoad();
    resolve({
      freeMem,
      totalMem,
      usedMem,
      memUsage,
      osType,
      upTime,
      cpuModel,
      numCores,
      cpuSpeed,
      cpuLoad,
    });
  });
}

function cpuAverage() {
  const cpus = os.cpus();
  let idleMs = 0;
  let totalMs = 0;
  cpus.forEach((aCore) => {
    for (type in aCore.times) {
      totalMs += aCore.times[type];
    }
    idleMs += aCore.times.idle;
  });
  return {
    idle: idleMs / cpus.length,
    total: totalMs / cpus.length,
  };
}

function getCpuLoad() {
  return new Promise((resolve, reject) => {
    const start = cpuAverage();
    setTimeout(() => {
      const end = cpuAverage();
      const idleDifference = end.idle - start.idle;
      const totalDifference = end.total - start.total;
      // calc the % of used cpu
      const percentageCpu =
        100 - Math.floor((100 * idleDifference) / totalDifference);
      resolve(percentageCpu);
    }, 100);
  });
}

performanceData().then((allPerformanceData) => {
  console.log(allPerformanceData);
});

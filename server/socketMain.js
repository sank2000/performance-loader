const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/perfData', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const Machine = require('./models/Machine');

function socketMain(io, socket) {
  let macA;

  socket.on('clientAuth', (key) => {
    if (key === '5t78yuhgirekjaht32i3') {
      // valid nodeClient
      socket.join('clients');
    } else if (key === 'uihjt3refvdsadf') {
      // valid ui client has joined
      socket.join('ui');
      Machine.find({}, (err, docs) => {
        docs.forEach((aMachine) => {
          // on load, assume that all machines are offline
          aMachine.isActive = false;
          io.to('ui').emit('data', aMachine);
        });
      });
    } else {
      // an invalid client has joined. Goodbye
      socket.disconnect(true);
    }
  });

  socket.on('disconnect', () => {
    Machine.find({ macA: macA }, (err, docs) => {
      if (docs.length > 0) {
        // send one last emit to React
        docs[0].isActive = false;
        io.to('ui').emit('data', docs[0]);
      }
    });
  });

  socket.on('initPerfData', async (data) => {
    // update our socket connect function scoped variable
    macA = data.macA;

    const mongooseResponse = await checkAndAdd(data);
    console.log(mongooseResponse);
  });

  socket.on('perfData', (data) => {
    io.to('ui').emit('data', data);
  });
}

function checkAndAdd(data) {
  return new Promise(async (resolve, reject) => {
    const doc = await Machine.findOne({ macA: data.macA });
    if (doc === null) {
      let newMachine = new Machine(data);
      await newMachine.save();
      resolve('added');
    } else {
      resolve('found');
    }
  });
}

module.exports = socketMain;

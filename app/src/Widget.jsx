import React from 'react';
import Cpu from './Cpu';
import Mem from './Mem';
import Info from './Info';
import './widget.css';

function Widget(props) {
  const {
    cpuModel,
    cpuLoad,
    cpuSpeed,
    freeMem,
    macA,
    memUsage,
    numCores,
    isActive,
    osType,
    totalMem,
    upTime,
    usedMem,
  } = props.data;

  // console.log(props);

  const cpuWidgetId = `cpu-widget-${macA}`;
  const memWidgetId = `mem-widget-${macA}`;

  const cpu = { cpuLoad, cpuWidgetId };
  const mem = { totalMem, usedMem, memUsage, freeMem, memWidgetId };
  const info = { macA, osType, upTime, cpuModel, numCores, cpuSpeed };

  return (
    <div className="widget col-sm-12">
      {!isActive && <div className="not-active">Offline</div>}
      <Cpu cpuData={cpu} />
      <Mem memData={mem} />
      <Info infoData={info} />
    </div>
  );
}
export default Widget;

import React, { useEffect, useRef } from 'react';
import drawCircle from './utilities/canvasLoadAnimation';

function Cpu(props) {
  const canvasRef = useRef();

  useEffect(() => {
    if (canvasRef.current) {
      drawCircle(canvasRef.current, props.cpuData.cpuLoad);
    }
  }, [props]);

  return (
    <div className="col-sm-3 cpu">
      <h3>CPU load</h3>
      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          className={props.cpuData?.cpuWidgetId}
          width="200"
          height="200"
        ></canvas>
        <div className="cpu-text">{props.cpuData?.cpuLoad}%</div>
      </div>
    </div>
  );
}

export default Cpu;

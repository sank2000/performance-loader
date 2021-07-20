import React, { useRef, useEffect } from 'react';
import drawCircle from './utilities/canvasLoadAnimation';

function Mem(props) {
  const canvasRef = useRef();

  useEffect(() => {
    if (canvasRef.current) {
      drawCircle(canvasRef.current, props.memData.memUsage * 100);
    }
  }, [props]);

  const { totalMem, memUsage, freeMem } = props.memData;
  const totalMemInGB = Math.floor((totalMem / 1073741824) * 100) / 100;
  const freeMemInGB = Math.floor((freeMem / 1073741824) * 100) / 100;
  return (
    <div className="col-sm-3 mem">
      <h3>Memory Usage</h3>
      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          className={props.memData.memWidgetId}
          width="200"
          height="200"
        ></canvas>
        <div className="mem-text">{memUsage * 100}%</div>
      </div>
      <div>Total Memory: {totalMemInGB}gb</div>
      <div>Free Memory: {freeMemInGB}gb</div>
    </div>
  );
}

export default Mem;

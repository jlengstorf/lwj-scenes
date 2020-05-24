import React from 'react';
import { useBoop } from '../hooks/use-boop';

const BoopDrop = () => {
  const boopBox = useBoop();

  return (
    <canvas
      ref={boopBox}
      style={{
        height: '100%',
        left: 0,
        position: 'absolute',
        top: 0,
        width: '100%',
      }}
    />
  );
};

export default BoopDrop;

import React, { useEffect } from 'react';
import splitting from 'splitting';

export function Stampede() {
  useEffect(() => {
    splitting({ by: 'chars' });
  }, []);

  return (
    <div className="stampede">
      <p data-splitting>STAMPEDE!</p>
    </div>
  );
}

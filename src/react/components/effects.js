import React, { forwardRef, useRef, useCallback } from 'react';
import { useSoundEffect } from '../hooks/use-sound-effect';

const Effect = forwardRef(({ command, state }, ref) => {
  return (
    <div ref={ref} className={`command-display`}>
      {state !== 'idle' && (
        <>
          {command.handler?.image && (
            <img
              className="command-image"
              src={command.handler?.image}
              alt=""
            />
          )}
          <svg viewBox="0 0 450 45" className="command-text">
            <text y="30" x="225">
              {command.author?.username} redeemed {command.command}
            </text>
          </svg>
        </>
      )}
    </div>
  );
});

const Effects = () => {
  const ref = useRef();

  const startEffectAnimation = useCallback(
    () =>
      new Promise((resolve, reject) => {
        try {
          ref.current.classList.add('visible');
          setTimeout(() => resolve(true), 600);
        } catch (err) {
          reject(err);
        }
      }),
    [ref],
  );

  const endEffectAnimation = useCallback(
    () =>
      new Promise((resolve, reject) => {
        try {
          ref.current.classList.remove('visible');
          setTimeout(() => resolve(true), 600);
        } catch (err) {
          reject(err);
        }
      }),
    [ref],
  );

  const [command, state] = useSoundEffect({
    services: {
      startEffectAnimation,
      endEffectAnimation,
    },
  });

  console.log({ command, state });

  return <Effect ref={ref} command={command} state={state} />;
};

export default Effects;

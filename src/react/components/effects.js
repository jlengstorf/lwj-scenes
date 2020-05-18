import React, { forwardRef, useRef, useCallback } from 'react';
import { useSoundEffect } from '../hooks/use-sound-effect';

const Effect = forwardRef(({ state }, ref) => {
  const { image, username, command } = state.context;

  return (
    <div ref={ref} className={`command-display`}>
      {state.value !== 'idle' && (
        <>
          {image && <img className="command-image" src={image} alt="" />}
          <svg viewBox="0 0 450 45" className="command-text">
            <text y="30" x="225">
              {username} redeemed {command}
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

  const state = useSoundEffect({
    services: {
      startEffectAnimation,
      endEffectAnimation,
    },
  });

  return <Effect ref={ref} state={state} />;
};

export default Effects;

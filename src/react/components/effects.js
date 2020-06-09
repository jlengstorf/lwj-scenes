import React, { forwardRef, useRef, useCallback, useEffect } from 'react';
import splitting from 'splitting';
import { useSoundEffect } from '../hooks/use-sound-effect';

import '../styles/effects.css';

const Effect = forwardRef(({ state }, ref) => {
  const { image, username, command } = state.context;

  useEffect(() => {
    splitting({ by: 'chars' });
  }, [username, command, state]);

  return (
    <div ref={ref} className={`command-display`}>
      {state.value !== 'idle' && (
        <>
          {image && <img className="command-image" src={image} alt="" />}
          <div className="command-text" data-splitting>
            <span className="username">{username}</span>
            redeemed
            <span className="effect">{command}</span>
          </div>
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

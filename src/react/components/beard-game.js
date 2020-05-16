import React, { useEffect, useRef } from 'react';
import { useCommand } from '../hooks/use-command';

const INCREMENT = 10;
const BEARD_LENGTH_DEFAULT = 100;
let timeout;

const BeardGame = () => {
  const ref = useRef();

  const { command } = useCommand();

  useEffect(() => {
    const beard = ref.current.querySelector('.beard');
    beard.style.height = `${BEARD_LENGTH_DEFAULT}px`;
  }, []);

  useEffect(() => {
    if (!['beard', 'shave', 'flap'].includes(command)) {
      return;
    }

    const jason = ref.current;
    jason.classList.add('visible');

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      jason.classList.remove('visible');
    }, 5000);

    if (command === 'flap') {
      jason.classList.add('flap');
      setTimeout(() => jason.classList.remove('flap'), 2000);
      return;
    }

    const beard = jason.querySelector('.beard');
    const current = parseInt(beard.style.height);

    if (command === 'beard') {
      beard.classList.remove('none');

      if (current >= BEARD_LENGTH_DEFAULT * 2) {
        beard.classList.add('rainbow');
      }

      beard.style.height = `${current + INCREMENT}px`;
    }

    if (command === 'shave') {
      if (current < BEARD_LENGTH_DEFAULT * 2) {
        beard.classList.remove('rainbow');
      }

      if (current < BEARD_LENGTH_DEFAULT) {
        beard.classList.add('none');
        return;
      }

      beard.style.height = `${current - INCREMENT}px`;
    }
  });

  return (
    <div className="foreground">
      <div className="jason" ref={ref}>
        <div className="head">
          <div className="hair none"></div>
          <div className="neck"></div>
          <div className="eye left"></div>
          <div className="eye right"></div>
          <div className="ear"></div>
          <div className="beard"></div>
          <div className="mouth"></div>
        </div>
        <div className="body"></div>
      </div>
    </div>
  );
};

export default BeardGame;

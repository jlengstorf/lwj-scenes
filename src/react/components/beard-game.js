import 'splitting/dist/splitting.css';
import React, { useEffect, useRef } from 'react';
import splitting from 'splitting';
import { useCommand } from '../hooks/use-command';

const INCREMENT = 10;
const BEARD_LENGTH_DEFAULT = 110;
let timeout;
let flapTimeout;

const Notifications = ({ command, time }) => {
  const ref = useRef();

  useEffect(() => {
    if (!command || !['beard', 'shave', 'flap'].includes(command)) return;

    const rotation = Math.random() * 0.2 - 0.1;
    const drift = rotation > 0 ? rotation + 0.05 : rotation - 0.05;

    console.log({ rotation, drift });

    const word = document.createElement('div');
    word.classList.add('notification');
    word.style.setProperty('--angle-start', `${rotation}turn`);
    word.style.setProperty('--angle-end', `${drift}turn`);
    word.style.setProperty('--scale', `${drift}turn`);
    word.setAttribute('data-splitting', true);
    word.innerText = `${command}!`;

    ref.current.appendChild(word);

    splitting({ by: 'chars' });

    setTimeout(() => {
      if (ref.current) {
        ref.current.removeChild(word);
      }
    }, 2000);
  }, [command, time]);

  return <div ref={ref} />;
};

const BeardGame = () => {
  const ref = useRef();
  const { command, time } = useCommand();

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

    const beard = jason.querySelector('.beard');
    const current = parseInt(beard.style.height);

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      jason.classList.remove('visible');
      beard.style.height = `${BEARD_LENGTH_DEFAULT}px`;
      beard.classList.remove('rainbow');
    }, 5000);

    if (command === 'flap') {
      jason.classList.add('flap');
      clearTimeout(flapTimeout);
      flapTimeout = setTimeout(() => {
        jason.classList.remove('flap');
      }, 2000);
      return;
    }

    if (command === 'beard') {
      beard.classList.remove('none');

      if (current + INCREMENT >= BEARD_LENGTH_DEFAULT * 2) {
        beard.classList.add('rainbow');
      }

      beard.style.height = `${current + INCREMENT}px`;
    }

    if (command === 'shave') {
      if (current - INCREMENT <= BEARD_LENGTH_DEFAULT * 2) {
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
      <Notifications command={command} time={time} />
      <div className="jason" ref={ref}>
        <div className="head">
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

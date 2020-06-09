import { useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { Machine, assign } from 'xstate';
import { useCommand } from './use-command';

const effectsMachine = Machine({
  id: 'effects',
  initial: 'idle',
  context: {
    transitionSpeed: 600,
    duration: 4000,
  },
  states: {
    idle: {
      on: {
        COMMAND_RECEIVED: {
          actions: assign((context, { command }) => ({
            command: command.command,
            username: command.author?.username,
            image: command.handler?.image,
            audio: command.handler?.audio,
            duration: command.handler?.duration * 1000 || context.duration,
          })),
          target: 'loading',
        },
      },
    },
    loading: {
      invoke: {
        src: (_, event) =>
          Promise.all([
            new Promise((resolve, reject) => {
              const { image } = event.command?.handler;

              if (!image) resolve(true);

              const img = new Image();
              img.onload = () => resolve(img);
              img.onerror = (err) => {
                console.error(err);
                reject(err);
              };
              img.src = image;
            }),
            new Promise((resolve, reject) => {
              const { audio } = event.command?.handler;

              if (!audio) resolve(true);

              const sfx = new Audio();
              sfx.addEventListener('canplaythrough', () => {
                resolve(sfx);
              });
              sfx.onerror = (err) => {
                console.error(err);
                reject(err);
              };
              sfx.src = audio;
            }),
          ]),
        onDone: 'activating',
        onError: 'error',
      },
    },
    activating: {
      invoke: {
        src: 'startEffectAnimation',
        onDone: 'visible',
        onError: 'error',
      },
    },
    visible: {
      entry: (context) => {
        if (!context.audio) return;

        const sfx = new Audio(context.audio);
        sfx.play();
      },
      invoke: {
        src: (context) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, context.duration);
          }),
        onDone: 'deactivating',
      },
    },
    deactivating: {
      invoke: {
        src: 'endEffectAnimation',
        onDone: 'idle',
        onError: 'error',
      },
    },
    error: {
      on: {
        '': 'idle',
      },
    },
  },
});

export function useSoundEffect(config) {
  const command = useCommand();
  const [state, send] = useMachine(effectsMachine, config);

  useEffect(() => {
    if (
      state.value !== 'idle' ||
      (!command.handler?.audio && !command.handler?.image)
    )
      return;

    send({ type: 'COMMAND_RECEIVED', command });
  }, [command]);

  return state;
}

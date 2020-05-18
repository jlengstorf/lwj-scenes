import React, { useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { Machine, assign } from 'xstate';
import { useChat } from '../hooks/use-chat';

const MESSAGES = new Map();

MESSAGES.set('0', {
  author: {
    username: 'jlengstorf',
    roles: ['BROADCASTER'],
  },
  html: 'this is a broadcaster message',
  time: 1233,
});

MESSAGES.set('1', {
  author: {
    username: 'someonecool',
    roles: ['MODERATOR'],
  },
  html: 'this is a moderator message',
  time: 1234,
});

MESSAGES.set('2', {
  author: {
    username: 'subfriend',
    roles: ['SUBSCRIBER'],
  },
  html: 'this is a subscriber message',
  time: 1235,
});

MESSAGES.set('3', {
  author: {
    username: 'newfriend',
    roles: [],
  },
  html: 'this is a general message',
  time: 1236,
});

const chatMachine = Machine({
  id: 'chat',
  initial: 'idle',
  context: {
    messages: MESSAGES, //new Map(),
  },
  states: {
    idle: {
      on: {
        CHAT_RECEIVED: {
          actions: assign((context, { message }) => {
            if (!message?.time) return;

            return {
              messages: context.messages.set(
                `${message.author.username}:${message.time}`,
                message,
              ),
            };
          }),
          target: 'adding',
        },
      },
    },
    adding: {
      on: {
        '': 'added',
      },
    },
    added: {
      on: {
        '': 'idle',
      },
    },
  },
});

const Chat = () => {
  const [state, send] = useMachine(chatMachine);
  const message = useChat();

  console.log({ message });

  useEffect(() => {
    send('CHAT_RECEIVED', { message });
  }, [message, send]);

  console.log({ context: state.context });

  return (
    <ul style={{ color: 'var(--text-muted)' }}>
      {Array.from(state.context.messages.values()).map((msg) => {
        let color = 'var(--text-muted)';
        if (msg.author.roles.includes('BROADCASTER')) {
          color = 'var(--yellow)';
        } else if (msg.author.roles.includes('MODERATOR')) {
          color = 'var(--pink-text)';
        } else if (msg.author.roles.includes('SUBSCRIBER')) {
          color = 'var(--blue)';
        }

        return (
          <li key={`${msg.author.username}:${msg.time}`}>
            <strong
              style={{
                color,
                marginRight: '0.25rem',
                img: {
                  width: 24,
                },
              }}
            >
              {msg.author.username}:
            </strong>
            <span dangerouslySetInnerHTML={{ __html: msg.html }} />
          </li>
        );
      })}
    </ul>
  );
};

export default Chat;

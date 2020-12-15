import React, { useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { Machine, assign } from 'xstate';
import striptags from 'striptags';
import { useChat } from '../hooks/use-chat';

const chatMachine = Machine({
  id: 'chat',
  initial: 'idle',
  context: {
    messages: new Map(),
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

  useEffect(() => {
    send('CHAT_RECEIVED', { message });
  }, [message, send]);

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

        const text = striptags(msg.html, '<img>');
        const matches = Array.from(text.matchAll(/<.+?>/g));
        const chatNode = document.createElement('div');
        const start = document.createTextNode(
          matches.length ? text.slice(0, matches[0].index) : '',
        );
        const lastIndex = 0;

        chatNode.appendChild(start);

        matches.forEach((match, matchIndex) => {
          lastIndex = match.index + match[0].length;

          const img = text.slice(match.index, lastIndex);
          const src = img.match(/src="(.+?)"/)[1];

          console.log(src);

          if (src.startsWith('https://static-cdn.jtvnw.net/')) {
            const cleanImg = document.createElement('img');
            cleanImg.src = src;
            cleanImg.alt = '';

            chatNode.appendChild(cleanImg);
          }

          if (matches[matchIndex + 1]) {
            const middle = document.createTextNode(
              text.slice(lastIndex, matches[matchIndex + 1].index),
            );
            chatNode.appendChild(middle);
          }
        });

        const last = document.createTextNode(text.slice(lastIndex));
        chatNode.appendChild(last);

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
            <span dangerouslySetInnerHTML={{ __html: chatNode.innerHTML }} />
          </li>
        );
      })}
    </ul>
  );
};

export default Chat;

import { useState, useEffect } from 'react';
import { gql, useApolloClient } from '@apollo/client';

export function useChat() {
  const [chat, setChat] = useState(false);
  const client = useApolloClient();

  useEffect(() => {
    const observer = client
      .subscribe({
        query: gql`
          subscription TwitchMessage {
            message {
              __typename
              message
              author {
                username
                roles
              }
              emotes {
                id
                name
                locations
                images {
                  small
                  medium
                  large
                }
              }
              time

              ... on TwitchChatMessage {
                html
              }
            }
          }
        `,
      })
      .subscribe({
        next: ({ data }) => {
          if (data.message.__typename !== 'TwitchChatMessage') return;

          setChat(data.message);
        },
      });

    return () => observer.unsubscribe();
  }, [chat, client]);

  return chat;
}

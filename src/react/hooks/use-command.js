import { useState, useEffect } from 'react';
import { gql, useApolloClient } from '@apollo/client';

export function useCommand() {
  const [command, setCommand] = useState(false);
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

              ... on TwitchChatCommand {
                command
                arguments
                handler {
                  name
                  message
                  description
                  audio
                  image
                  duration
                }
              }
            }
          }
        `,
      })
      .subscribe({
        next: ({ data }) => {
          if (data.message.__typename !== 'TwitchChatCommand') return;

          setCommand(data.message);
        },
      });

    return () => observer.unsubscribe();
  }, [command, client]);

  return command;
}
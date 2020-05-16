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

              ... on TwitchChatMessage {
                html
              }

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
          setCommand(data.message);
        },
      });

    return () => observer.unsubscribe();
  }, [command, client]);

  return command;
}

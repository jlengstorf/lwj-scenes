export async function loadNextEpisode() {
  // if an episode is in progress, we still want to show it.
  const nowMinus3Hours = new Date().getTime() - 180 * 60 * 1000;
  const date = new Date(nowMinus3Hours).toISOString();
  const episode = await fetch(
    'https://vnkupgyb.apicdn.sanity.io/v1/graphql/production/default',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
                query ($date: DateTime!) {
                  allEpisodes(where: { date_gte: $date }) {
                    title
                    date
                    guest {
                      name
                    }
                  }
                }
              `,
        variables: {
          date,
        },
      }),
    },
  )
    .then((res) => res.json())
    .then((res) =>
      res.data.allEpisodes
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .find(Boolean),
    )
    .catch((err) => console.error(err));

  document.querySelector('#episode-title').innerText = episode.title;
  document.querySelector('#episode-guest').innerText = episode.guest[0].name;
}

export function connect(channel) {
  // WebSocket experiments
  const ws = new WebSocket(`wss://api.streamblitz.com/`);

  ws.onerror = () => {
    console.error('WebSocket error!');
  };

  ws.onopen = () => {
    console.log('WebSocket connection established');
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed');
  };

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);

    if (msg === 'heartbeat') {
      ws.send('I ATEN’T DEAD');
    }

    // only fire commands intended for this channel
    if (msg.channel !== channel) {
      return;
    }

    console.log(msg);
  };
}

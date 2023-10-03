const net = require('net');

const server = net.createServer((socket) => {
  console.log('Client connected.');

  socket.on('data', (data) => {
    const message = data.toString().trim();
    console.log(`Received from client: ${message}`);

    const msg = message.split(':')[0];
    if (msg === 'pong') {
      const [pingMsg, clientTimestamp] = message.split(':');
      const serverTimestamp = Date.now();
      console.log(`Round-trip time: ${serverTimestamp - parseInt(clientTimestamp)} ms`);
      socket.write(`pong:${clientTimestamp}`);
    }
  });

  socket.on('end', () => {
    console.log('Client disconnected.');
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error('Error:', error);
  });
});

const serverPort = 8080;

server.listen(serverPort, () => {
  console.log(`Server is listening on port ${serverPort}`);
});
const net = require('net');

const servers = [
  { title: 'London', host: '161.35.41.62', port: 8080 },
  { title: 'San Francisco', host: '64.227.111.29', port: 8080 },
  { title: 'Sydney', host: '170.64.178.159', port: 8080 },
];

const clients = [];

function createClient(server) {
  const client = net.createConnection(server, () => {
    console.log(`Connected to ${server.host}:${server.port} in ${server.title}`);
    clients.push(client);
  });

  client.on('data', (data) => {
    const message = data.toString().trim();
    console.log(`Received from ${server.host}:${server.port}: ${message}`);

    const msg = message.split(':')[0];
    if (msg === 'pong') {
      const serverTimestamp = message.split(':')[1];
      const clientTimestamp = Date.now();
      const rtt = clientTimestamp - parseInt(serverTimestamp);
      console.log(`Round-trip time to ${server.title} at ${server.host}:${server.port} and back: ${rtt} ms`);
    }
  });

  client.on('end', () => {
    console.log(`Disconnected from ${server.host}:${server.port}`);
  });

  // Handle errors
  client.on('error', (error) => {
    console.error(`Error with ${server.host}:${server.port}:`, error);
  });

  // Function to send ping messages to the server
  function sendPing() {
    const timestamp = Date.now();
    client.write(`ping:${timestamp}`);
  }

  // Send a ping message every second
  setInterval(sendPing, 1000);
}

// Create clients for each server
servers.forEach((server) => {
  createClient(server);
});

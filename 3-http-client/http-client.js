const http = require('http');

// Define an array of target hosts
// ['London', 'San Francisco', 'Sydney']
const targetHosts = [
  'http://161.35.41.62:8000/ping',
  'http://64.227.111.29:8000/ping',
  'http://170.64.178.159:8000/ping'
];

function pingAllServers() {
  targetHosts.forEach((targetHost) => {
    pingServer(targetHost);
  });
}

function pingServer(targetHost) {
  const startTime = Date.now();

  const req = http.get(targetHost, (res) => {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    console.log(`Ping to ${targetHost} took ${responseTime}ms`);
  });

  req.on('error', (error) => {
    console.error(`Error: ${error.message}`);
  });
}

// Start pinging all target hosts without delay
pingAllServers();

const http = require('http');

// Specify the port we want the server to listen on
const port = 8000; 

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/ping') {
    const startTime = Date.now();

    // Simulate some work (you can replace this with your actual server logic)
    setTimeout(() => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`Ping response time: ${responseTime}ms`);
    }, 100); // Simulated work takes 100 milliseconds
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const express = require('express')
const path = require("path");
const responseTime = require('response-time')
 
const app = express()
 
app.use(responseTime())
 
// Serve index.html
app.get('/', (req, res) => {
    // Set Cache-Control header to prevent caching
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.sendFile(path.join(__dirname, "/index.html"));
})

// Define a route to serve the image file
app.get('/image', (req, res) => {
    // Set cache-control and pragma headers to prevent caching
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.sendFile(path.join(__dirname, 'image.jpeg'));
  });

// listen on port
const server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port)
})
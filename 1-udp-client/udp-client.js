const dgram = require('dgram');
const client = dgram.createSocket('udp4');


// Date.now() returner et UNIX timestamp (antal millisekunder siden 1. Januar 1970)
var timestamp = 0


// HOSTS sat op på 3 forskellige Droplets på DigitalOcean 
// ['London', 'New York', 'Singapore']
const HOSTS = ['161.35.41.62', '170.64.178.159', '64.227.111.29'];
const PORT = 6790;


// Async timeout function til at vente med at sende beskeder
const asyncTimeout = async (time) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time)
    })
}


// client.send bruger callback (kedeligt), så vi konvertere den til promise for at kunne bruge async / await 
function sendMessage(message, port, host) {
    return new Promise((resolve, reject) => {
        client.send(message, 0, message.length, port, host, (error, bytes) => {
            if (error) {
                return reject(error);
            } 
            return resolve(bytes);
        })
    })
}


// Send en request og udregn svartiden
function pingForRTT (serverAdress) {
    // Sender en besked til serveren
    const message = 'ping'
    sendMessage(message, PORT, serverAdress).then(() => { 
        timestamp = Date.now();
        console.log('sent', message, 'at time', timestamp);
    })
    
    
    // Udregner svartiden fra serveren ved brug af Date.now()
    // Lytter til svar fra serveren
    client.on('message', function (incommingMessage, remote) {
        console.log('Received', incommingMessage.toString());
        const receivedTime = Date.now();
        const roundTripTime = receivedTime - timestamp;
        console.log('Round trip time:', roundTripTime, 'ms');
    });
}


// Send 10 requests og udregn gennemsnits svartiden
async function pingForAverageRTT (serverAdress, amount = 10, delay = 500) {
    // Sender en besked til serveren
    const message = 'ping'
    const receivedTimeStamps = [];
    const sendTimeStamps = [];
    
    client.on('message', function (incommingMessage, remote) {
        const receivedTime = Date.now();
        receivedTimeStamps.push(receivedTime);

        // Samler alle svar tider
        const roundTripTimes = []
        receivedTimeStamps.forEach((receivedTime, index) => {
            roundTripTimes.push(receivedTime - sendTimeStamps[index])
        })

        // Udregn gennemsnitlig svartid
        let roundTripTimeSum = 0
        roundTripTimes.forEach((roundTripTime) => {
            roundTripTimeSum += roundTripTime;
        })
        const averageRoundTripTime = roundTripTimeSum / roundTripTimes.length;
        console.log('Received message. Average RTT:', averageRoundTripTime, 'ms');    
    });

    for (let i = 0; i < amount; i++) {
        await asyncTimeout(delay)
        await sendMessage(message, PORT, serverAdress).then(() => { 
            timestamp = Date.now();
            sendTimeStamps.push(timestamp);
            console.log('sent', message, 'at time', timestamp);
        })
    }
}


// Send en request til alle servere og udregn svartiden
function pingServersForRTT (serverAdress = []) {
    // Sender en besked til serveren
    const message = 'ping'


    // Sender en besked til alle servere
    for (let i = 0; i < serverAdress.length; i++) {
        sendMessage(message, PORT, serverAdress[i]).then(() => { 
            timestamp = Date.now();
            console.log('sent', message, 'at time', timestamp);
        })
    }

    
    // Lytter til svar fra serveren
    // Udregner svartiden fra serveren ved brug af Date.now()
    client.on('message', function (incommingMessage, remote) {
        console.log('Received', incommingMessage.toString());
        const receivedTime = Date.now();
        const roundTripTime = receivedTime - timestamp;
        console.log('Round trip time:', roundTripTime, 'ms');
    });
}


// Øvelse 1 - fjern kommentarerne og kald funktionerne en for en

// pingForRTT('161.35.41.62')
// pingForRTT('170.64.178.159')
// pingForRTT('64.227.111.29')

// pingForAverageRTT('161.35.41.62', 10, 1000)
// pingForAverageRTT('170.64.178.159', 10, 1000)
// pingForAverageRTT('64.227.111.29', 10, 1000)

// pingServersForRTT(HOSTS)
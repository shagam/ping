"use strict";

// import express from 'express'
const express = require('express')
const https = require('https')
const path = require('path')
const fs = require('fs')
const cors = require('cors')


const app = express()
const router = express.Router();

var metadata = require("node-ec2-metadata");

var port = 5000;
const ssl = true
var key_; 
var cert_;
var url

const os = require('os');
function getLocalIP() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (127.0.0.1) and non-IPv4
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

console.log ('\n\n\n===============\nlocal ip==', getLocalIP())
if (getLocalIP() === '192.168.7.8') {
  port = 5001;
}
else if (getLocalIP() === '192.168.7.6') {
  port = 5002;
}



process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // write to file, send to monitoring, etc.
  process.exit(1); // exit without restart
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM');
  process.exit(0);
});


// console.log ('local ip=', getLocalIP())

const isWindows = process.platform === 'win32';
if (isWindows) {
  console.log('\nExpress running on Windows');
  url = 'portfolio-chk.xyz'
  console.log('Certificate letsEncrypt home test server ' + url + '\n')
  key_ = fs.readFileSync('../localhost-key.pem')
  cert_= fs.readFileSync('../localhost.pem')
} else {
  console.log('Express running on non‑Windows OS');
}


metadata.isEC2().then(function (onEC2) {


console.log("\nRunning on EC2? " + onEC2 + ',  port=' + port + '\n');

console.log ('\n\n\nport=', port)
const externalIp = process.env.NODE_localIP // '62.0.90.49'


  var sslServer;

    if (onEC2) {
      url = 'portfolio-chk.com';
      console.log('Certificate letsEncrypt EC2 production ', '/etc/letsencrypt/live/' + url + '/privkey.pem\n')
      key_ =  fs.readFileSync('/etc/letsencrypt/live/' + url + '/privkey.pem')
      cert_= fs.readFileSync('/etc/letsencrypt/live/' + url + '/fullchain.pem')
    }
    else if (! isWindows) {
      url = 'portfolio-chk.xyz'
      console.log('Certificate letsEncrypt home test server ', '/etc/letsencrypt/live/' + url + '/privkey.pem\n')
      key_ = fs.readFileSync('/etc/letsencrypt/live/' + url + '/privkey.pem')
      cert_= fs.readFileSync('/etc/letsencrypt/live/' + url + '/fullchain.pem')
    }


  console.log ('key', key_)
  console.log ('cert', cert_)
  sslServer = https.createServer({
    key: key_,
    cert: cert_,
  }, app)


  sslServer.listen(port, '0.0.0.0', (err) => {
    // console.log('secureServer on port=', port)
    if (err) {
      console.log('err: ', err)
    }
  })


app.options('*', cors())

app.use(
  cors({
    origin: "*",
    methods: ["GET", "PUT", "POST", "DELETE"],
    credetials: true,
    optionsSuccessStatus: 200,
  })
)



var nowMili = Date.now();

// test response time
app.get('/ping', (req, res) => {
  console.log ('ping query', req.query)

  res.send('ok')
})


function timeout(delay) {
  return new Promise (res => setTimeout(res, delay))
}

process.on('SIGINT', function() {
  console.log ('  SIGINT ^C')
  timeout (20000)

  console.log ('delay end')
  process.exit()
})


}); // onEC2

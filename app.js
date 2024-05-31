const express = require('express')
const cors = require('cors')
const https = require('https')
const fs = require('fs')

const app = express()
const port = 5001
var sslServer;

sslServer = https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/dinagold.org/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/dinagold.org/fullchain.pem'),
}, app)



app.options('*', cors())
app.use(cors())




app.get('/ping', (req, res) => {
  console.log ('ping query', req.query)

  res.send('ok')
})

// sslServer.listen(port, (err) => {
//   // console.log('secureServer on port=', port)
//   if (err) {
//     console.log('err: ', err)
//   }
// })


sslServer.listen(port, (err) => {
  if (err) {
    console.log('err: ', err)
  }

  console.log(`Example app listening on port ${port}`)
})


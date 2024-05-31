const express = require('express')
const cors = require('cors')

const app = express()
const port = 3001

app.options('*', cors())
app.use(cors())

app.get('/ping', (req, res) => {
  console.log ('ping query', req.query)

  res.send('ok')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


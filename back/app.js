const express = require('express')
const app = express()
const routePrime = require('./api/prime')
require('dotenv').config()
const server  = require('http').createServer(app)
require('./socket')(server)

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hey ya!')
})

app.use('/test', routePrime)

const PORT = process.env.PORT

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
})
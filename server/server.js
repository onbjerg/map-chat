var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var _ = require('underscore')

io.on('connection', function (socket) {
  console.log('a user connected')

  socket.on('disconnect', function () {
    console.log('a user disconnected')
  })

  socket.on('message', function (message) {
    console.log('message from ' + this.id + ': ' + message)
    io.emit('message', _.extend(message, {
      sessionID: this.id
    }))
  })
})

app.use('/', express.static(__dirname + '/../client'))

http.listen(3000, function () {
  console.log('listening on *:3000')
})

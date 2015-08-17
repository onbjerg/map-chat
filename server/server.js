var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var _ = require('underscore')
var emojis = require('./emojis')
var htmlspecialchars = require('htmlspecialchars')

io.on('connection', function (socket) {
  console.log('a user connected')

  socket.on('greet', function (loc) {
    console.log('a user greeted the server')
    io.emit('greet', _.extend(loc, {
      sessionID: this.id
    }))
  })

  socket.on('disconnect', function () {
    console.log('a user disconnected')
    io.emit('leave', {
      sessionID: this.id
    })
  })

  socket.on('message', function (message) {
    message.message = htmlspecialchars(emojis(message.message))

    console.log('message from ' + this.id + ': ', message)
    io.emit('message', _.extend(message, {
      sessionID: this.id
    }))
  })
})

app.use('/', express.static(__dirname + '/../client'))

var port = process.env.PORT || 3000
http.listen(port, function () {
  console.log('listening on *:' + port)
})

var stdin = process.openStdin()
stdin.addListener('data', function (d) {
  var input = d.toString().trim()
  var cmd = input.split(' ')

  if (cmd[0] === 'help') {
    console.log('kick <user> - disconnect a user from the server')
    console.log('help - display this page')
    return
  }

  if (cmd.length < 2) {
    console.error('too few arguments')
    return
  }

  var socket
  if ((socket = io.sockets.connected[cmd[1]]) === undefined) {
    console.error('user ' + cmd[1] + ' does not exist')
    return
  }

  if (cmd[0] === 'kick') {
    console.log(socket.id + ' was kicked')
    socket.disconnect()
  }
})

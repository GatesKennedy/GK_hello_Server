//~~~~~~~~~~~~~~~~~~~~~~~
//    Socket.io
//~~~~~~~~~~~~~~~~~~~~~~~

import serv from '../server.js';
const ioC = require('socket.io')(serv);

ioC.on('connection', function (client) {
  console.log('frkn user connected');

  client.emit('alert', 'oh goodness... there you are peter!');

  // client.emit('alert', 'oh goodness... there you are peter!');

  client.on('register', handleRegister);

  client.on('join', handleJoin);

  client.on('leave', handleLeave);

  client.on('message', handleMessage);

  client.on('chatrooms', handleGetChatrooms);

  client.on('availableUsers', handleGetAvailableUsers);

  client.on('disconnect', function () {
    console.log('frkn client disconnect...', client.id);
    handleDisconnect();
  });

  client.on('error', function (err) {
    console.log('received error from client:', client.id);
    console.log(err);
  });
});

module.exports = ioC;

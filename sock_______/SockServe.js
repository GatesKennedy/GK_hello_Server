//~~~~~~~~~~~~~~~~~~~~~~~
//    Socket.io
//~~~~~~~~~~~~~~~~~~~~~~~

global.io.on('connection', (client) => {
  console.log('frkn global user connected');

  client.emit('alert', 'oh goodness... there you are peter!');

  // client.emit('alert', 'oh goodness... there you are peter!');

  // client.on('register', handleRegister);

  // client.on('join', handleJoin);

  // client.on('leave', handleLeave);

  // client.on('message', handleMessage);

  // client.on('chatrooms', handleGetChatrooms);

  // client.on('availableUsers', handleGetAvailableUsers);

  client.on('disconnect', function () {
    console.log('frkn global client disconnect...', client.id);
    // handleDisconnect();
  });

  client.on('error', function (err) {
    console.log('received error from client:', client.id);
    console.log(err);
  });
});

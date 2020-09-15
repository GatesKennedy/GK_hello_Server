// const serv = require('../server');
// const io = require('socket.io')(serv);

// const sockServe = require('http').createServer();
// const io = require('socket.io')(sockServe);

io.on('connection', function (client) {
  client.on('register', handleRegister);

  client.on('join', handleJoin);

  client.on('leave', handleLeave);

  client.on('message', handleMessage);

  client.on('chatrooms', handleGetChatrooms);

  client.on('availableUsers', handleGetAvailableUsers);

  client.on('disconnect', function () {
    console.log('client disconnect...', client.id);
    handleDisconnect();
  });

  client.on('error', function (err) {
    console.log('received error from client:', client.id);
    console.log(err);
  });
});

sockServe.listen(5100, function (err) {
  if (err) {
    console.log(`(>_<)  ERROR > sockServe.js > sockServe.listen()`);
    throw err;
  }
  console.log('listening on port 3000');
});

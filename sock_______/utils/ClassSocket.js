const fs = require('fs');
const http = require('http');
// const https = require('https');
const path = require('path');
//  UTIL FXN
const { getTalkHistory } = require('./dbAccess');

class SockService {
  conorId = process.env.CONOR_ID;
  registry = []; //  [ {id: clientId, nsp: userId, room: talkId }]

  //    Admin
  connection(client) {
    // log event when user connected
    console.log(`ClassSocket > .on('connection') >> `, client.id);

    client.on('disconnect', () => {
      console.log(`ClassSocket > .on('disconnect') >> `, client.id);
    });

    client.on('error', function (err) {
      console.log(`ClassSocket > .on('error') >> `, client.id);
      console.log(err);
    });
    //~~~~~~~~~~~~~~~~~~
    //  ROOMS
    //~~~~~~~~~~~~~~~~~~
    client.on('register', ({ userObj, talkId }) => {
      console.log(`ClassSocket > .on('register', cb) > talkId: `, talkId);
      client.join(talkId, () => {
        let rooms = Object.keys(client.rooms);
        console.log(`ClassSocket > .on('register', cb) > user rooms: `, rooms);
      });

      return client.emit('status', `Welcome to ${talkId}`);
    });
    // mute a chat room
    client.on('leaveTalk', (talkId) => {
      console.log(`ClassSocket > .on('leaveTalk') >>`);
      client.leave(talkId);
      client.to(talkId).emit('user has left...');
    });

    //~~~~~~~~~~~~~~~~~
    //  DATA
    //~~~~~~~~~~~~~~~~~
    client.on('init-talk', async (talkId) => {
      console.log(`ClassSocket > .on('init-talk', talkObj) > talkId: `, talkId);
      const talkObj = await getTalkHistory(talkId);
      client.in(talkId).emit('init-talk', talkObj);
    });

    client.on('chatMsg', (msgObj) => {
      console.log(`ClassSocket > .on('chatMsg', msgObj) >> msgObj: `, msgObj);
      io.in(msgObj.talkId).emit('chatMsg', msgObj);
    });

    client.on('note', ({ talkId, text }) => {
      console.log(`ClassSocket > on.('note') >>`);
      client.to(talkId).emit('note', text);
    });
  }
}

module.exports = SockService;

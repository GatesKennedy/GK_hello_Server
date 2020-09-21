//~~~~~~~~~~~~~~~~~~~~~~~
//    Event Methods
//~~~~~~~~~~~~~~~~~~~~~~~

exports.handleRegister = (userName, callback) => {
  if (!clientManager.isUserAvailable(userName))
    return callback('user is not available');

  const user = clientManager.getUserByName(userName);
  clientManager.registerClient(client, user);

  return callback(null, user);
};

exports.handleEvent = (chatroomName, createEntry) => {
  return ensureValidChatroomAndUserSelected(chatroomName).then(function ({
    chatroom,
    user,
  }) {
    // append event to chat history
    const entry = { user, ...createEntry() };
    chatroom.addEntry(entry);

    // notify other clients in chatroom
    chatroom.broadcastMessage({ chat: chatroomName, ...entry });
    return chatroom;
  });
};

exports.handleJoin = (chatroomName, callback) => {
  const createEntry = () => ({ event: `joined ${chatroomName}` });

  handleEvent(chatroomName, createEntry)
    .then(function (chatroom) {
      // add member to chatroom
      chatroom.addUser(client);

      // send chat history to client
      callback(null, chatroom.getChatHistory());
    })
    .catch(callback);
};

exports.handleDisconnect = () => {
  // remove user profile
  clientManager.removeClient(client);
  // remove member from all chatrooms
  chatroomManager.removeClient(client);
};

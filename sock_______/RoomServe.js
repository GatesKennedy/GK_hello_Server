const members = new Map();
let chatHistory = [];

exports.handleMessage = (data) => {
  // members.forEach((m) => m.emit('message', message));
  io.emit('message', data);
};

exports.addEntry = (entry) => {
  chatHistory = chatHistory.concat(entry);
};

exports.getChatHistory = () => {
  return chatHistory.slice();
};

exports.addUser = (client) => {
  members.set(client.id, client);
};

exports.removeUser = (client) => {
  members.delete(client.id);
};

exports.serialize = () => {
  return {
    name,
    image,
    numMembers: members.size,
  };
};

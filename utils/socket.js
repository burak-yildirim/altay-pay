function ioBuilder(server) {
  const io = require('socket.io')(server);
  function posSendHandler(data) {
    io.emit('fromPos', data);
  }
  function tankSendHandler(data) {
    io.emit('fromTank', data);
  }

  io.on('connection', function (client) {
    console.log(`${client.id} has joined to the socket server`);

    io.on('toCustomer', posSendHandler);
    io.on('toPos', tankSendHandler);
  });
  io.on('close', (client) => console.log(`${client.id} has left`))

  return io;
}

module.exports = ioBuilder;
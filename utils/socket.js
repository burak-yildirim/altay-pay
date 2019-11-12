function ioBuilder(server) {
  const io = require('socket.io')(server);
  function posSendHandler(data) {
    console.log('posSendHandler triggered');
    io.emit('fromPos', data);
  }
  function tankSendHandler(data) {
    console.log('tankSendHandler triggered');
    io.emit('fromTank', data);
  }

  io.on('connection', function (socket) {
    console.log(`${socket.id} has joined to the socket server`);

    socket.on('toTank', posSendHandler);
    socket.on('toPos', tankSendHandler);
    socket.on('disconnect', (socket) => console.log(`a socket disconnected`));
  });

  return io;
}

module.exports = ioBuilder;
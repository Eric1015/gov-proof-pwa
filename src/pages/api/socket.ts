import { Server } from 'socket.io';

// @ts-ignore
const SocketHandler = (_, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      socket.on('send-proof', (msg) => {
        console.log('Broadcasting proof to all sockets');
        socket.broadcast.emit('receive-proof', msg);
      });

      socket.on('send-verified-attestation', (msg) => {
        console.log('Broadcasting verified attestation to all sockets');
        socket.broadcast.emit('receive-verified-attestation', msg);
      });
    });
  }
  res.end();
};

export default SocketHandler;

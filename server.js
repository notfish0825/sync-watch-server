const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on('connection', (socket) => {
  console.log('有人连接：', socket.id);

  socket.on('join_room', (data) => {
    socket.join(data.room);
    io.to(data.room).emit('system_notice', `系统：${data.name} 进入房间 ${data.room}`);
  });

  socket.on('chat_msg', (data) => {
    io.to(data.room).emit('receive_chat', data);
  });

  socket.on('video_play', (data) => {
    socket.to(data.room).emit('remote_play', data);
  });
  socket.on('video_pause', (data) => {
    socket.to(data.room).emit('remote_pause', data);
  });
  socket.on('video_seek', (data) => {
    socket.to(data.room).emit('remote_seek', data);
  });
  socket.on('set_video', (data) => {
    socket.to(data.room).emit('remote_video_src', data);
  });

  socket.on('disconnect', () => {
    console.log('断开', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`服务器运行端口 ${PORT}`);
});

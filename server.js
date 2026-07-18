const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// 루트 주소로 오면 바로 index.html 보여주기
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    // 누군가 들어오면 기존 사람들에게 알림
    socket.broadcast.emit('msg', `📢 어떤 친구가 입장함! (ID: ${socket.id.substring(0,4)})`);

    // 클릭 신호 받으면 모두에게 전달
    socket.on('click', () => {
        io.emit('msg', `🎯 누군가 버튼 누름!`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 서버 구동 중 : ${PORT}`));

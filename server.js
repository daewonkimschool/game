const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.get('/', (req, res) => { res.sendFile(__dirname + '/index.html'); });

// 전체 플레이어 위치 저장소
let players = {};

io.on('connection', (socket) => {
    // 새로운 플레이어 생성 (랜덤 색상, 시작 위치)
    players[socket.id] = {
        x: Math.floor(Math.random() * 350) + 20,
        y: Math.floor(Math.random() * 350) + 20,
        color: '#' + Math.floor(Math.random()*16777215).toString(16)
    };

    // 접속한 사람에게 현재 플레이어들 목록 전송
    io.emit('updatePlayers', players);

    // 움직임 신호 받으면 좌표 업데이트 후 브로드캐스트
    socket.on('move', (data) => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            io.emit('updatePlayers', players); // 모든 유저에게 새 위치 전송
        }
    });

    // 나갔을 때 처리
    socket.on('disconnect', () => {
        delete players[socket.id];
        io.emit('updatePlayers', players);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🎮 게임 서버 가동 중: ${PORT}`));

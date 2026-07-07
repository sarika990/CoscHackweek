"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const initSocket = (io) => {
    const rooms = {};
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);
        socket.on('join-room', (roomId, user) => {
            socket.join(roomId);
            if (!rooms[roomId]) {
                rooms[roomId] = {};
            }
            rooms[roomId][socket.id] = {
                id: socket.id,
                name: user.name,
                color: user.color,
                x: 0,
                y: 0,
            };
            // Notify others in the room
            socket.to(roomId).emit('user-joined', rooms[roomId][socket.id]);
            // Send current users to the new user
            socket.emit('room-users', rooms[roomId]);
        });
        socket.on('leave-room', (roomId) => {
            socket.leave(roomId);
            if (rooms[roomId] && rooms[roomId][socket.id]) {
                delete rooms[roomId][socket.id];
                socket.to(roomId).emit('user-left', socket.id);
            }
        });
        socket.on('cursor-move', (roomId, pos) => {
            const user = rooms[roomId]?.[socket.id];
            if (user) {
                user.x = pos.x;
                user.y = pos.y;
                socket.to(roomId).emit('cursor-moved', { id: socket.id, x: pos.x, y: pos.y });
            }
        });
        socket.on('canvas-update', (roomId, data) => {
            socket.to(roomId).emit('canvas-updated', data);
        });
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
            for (const roomId in rooms) {
                if (rooms[roomId]?.[socket.id]) {
                    delete rooms[roomId][socket.id];
                    socket.to(roomId).emit('user-left', socket.id);
                }
            }
        });
    });
};
exports.initSocket = initSocket;
//# sourceMappingURL=index.js.map
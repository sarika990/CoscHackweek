"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const initSocket = (io) => {
    // Shared in-memory map of socketId -> User
    const activeUsers = {};
    const broadcastOnlineUsers = () => {
        io.emit('online_users_update', activeUsers);
    };
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);
        // user-online registration
        socket.on('user-online', (data) => {
            const name = data.name || data.username || 'Anonymous';
            activeUsers[socket.id] = {
                socketId: socket.id,
                userId: data.userId,
                username: name,
                name: name,
                status: 'online'
            };
            console.log(`User registered: ${name} (${data.userId})`);
            broadcastOnlineUsers();
        });
        // new event: send_request
        socket.on('send_request', (data) => {
            let sender = activeUsers[data.fromId];
            if (!sender) {
                sender = Object.values(activeUsers).find(u => u.userId === data.fromId || u.socketId === data.fromId);
            }
            if (!sender)
                return;
            let targetSocketId = data.toId;
            if (!activeUsers[targetSocketId]) {
                const target = Object.values(activeUsers).find(u => u.userId === data.toId);
                if (target) {
                    targetSocketId = target.socketId;
                }
            }
            const targetUser = activeUsers[targetSocketId];
            if (targetUser && targetUser.status === 'busy') {
                socket.emit('request_rejected');
                return;
            }
            console.log(`Collab request from ${sender.username} to target socket ID: ${targetSocketId}`);
            socket.to(targetSocketId).emit('incoming_request', {
                fromId: sender.socketId,
                fromName: sender.username
            });
        });
        // legacy send-request mapped for safety
        socket.on('send-request', (data) => {
            const sender = activeUsers[socket.id];
            if (!sender)
                return;
            const targetUser = activeUsers[data.targetSocketId];
            if (targetUser && targetUser.status === 'busy') {
                socket.emit('request_rejected');
                return;
            }
            socket.to(data.targetSocketId).emit('incoming_request', {
                fromId: socket.id,
                fromName: sender.username
            });
        });
        // new event: respond_request
        socket.on('respond_request', (data) => {
            let senderSocketId = data.fromId;
            let receiverSocketId = data.toId;
            let sender = activeUsers[senderSocketId];
            if (!sender) {
                sender = Object.values(activeUsers).find(u => u.userId === senderSocketId || u.socketId === senderSocketId);
                if (sender)
                    senderSocketId = sender.socketId;
            }
            let receiver = activeUsers[receiverSocketId];
            if (!receiver) {
                receiver = Object.values(activeUsers).find(u => u.userId === receiverSocketId || u.socketId === receiverSocketId);
                if (receiver)
                    receiverSocketId = receiver.socketId;
            }
            if (!sender || !receiver)
                return;
            if (data.accepted) {
                if (sender.status === 'busy' || receiver.status === 'busy') {
                    return;
                }
                const roomId = `${sender.socketId}-${receiver.socketId}`;
                sender.status = 'busy';
                sender.roomId = roomId;
                sender.partnerId = receiver.userId;
                receiver.status = 'busy';
                receiver.roomId = roomId;
                receiver.partnerId = sender.userId;
                const senderSocket = io.sockets.sockets.get(senderSocketId);
                const receiverSocket = io.sockets.sockets.get(receiverSocketId);
                if (senderSocket)
                    senderSocket.join(roomId);
                if (receiverSocket)
                    receiverSocket.join(roomId);
                // Emit collab_started to both users
                if (senderSocket) {
                    senderSocket.emit('collab_started', {
                        roomId,
                        partnerName: receiver.username
                    });
                }
                if (receiverSocket) {
                    receiverSocket.emit('collab_started', {
                        roomId,
                        partnerName: sender.username
                    });
                }
                broadcastOnlineUsers();
            }
            else {
                const senderSocket = io.sockets.sockets.get(senderSocketId);
                if (senderSocket) {
                    senderSocket.emit('request_rejected');
                }
            }
        });
        // legacy accept-request mapped for safety
        socket.on('accept-request', (data) => {
            const receiver = activeUsers[socket.id];
            const sender = activeUsers[data.senderSocketId];
            if (!receiver || !sender)
                return;
            if (receiver.status === 'busy' || sender.status === 'busy') {
                return;
            }
            const roomId = `${sender.socketId}-${receiver.socketId}`;
            receiver.status = 'busy';
            receiver.roomId = roomId;
            receiver.partnerId = sender.userId;
            sender.status = 'busy';
            sender.roomId = roomId;
            sender.partnerId = receiver.userId;
            socket.join(roomId);
            const senderSocket = io.sockets.sockets.get(data.senderSocketId);
            if (senderSocket) {
                senderSocket.join(roomId);
                senderSocket.emit('collab_started', { roomId, partnerName: receiver.username });
            }
            socket.emit('collab_started', { roomId, partnerName: sender.username });
            broadcastOnlineUsers();
        });
        // legacy reject-request mapped for safety
        socket.on('reject-request', (data) => {
            const senderSocket = io.sockets.sockets.get(data.senderSocketId);
            if (senderSocket) {
                senderSocket.emit('request_rejected');
            }
        });
        // leave-room
        socket.on('leave-room', (data) => {
            console.log(`User leaving room: ${data.roomId}`);
            socket.leave(data.roomId);
            // Find both users in the room and revert their statuses to online
            for (const sId in activeUsers) {
                if (activeUsers[sId].roomId === data.roomId) {
                    activeUsers[sId].status = 'online';
                    activeUsers[sId].roomId = undefined;
                    activeUsers[sId].partnerId = undefined;
                }
            }
            socket.to(data.roomId).emit('partner_disconnected');
            socket.to(data.roomId).emit('partner-disconnected');
            broadcastOnlineUsers();
        });
        // drawing, shapes, and other canvas events scoped to roomId
        socket.on('drawing', (data) => {
            if (data.roomId) {
                socket.to(data.roomId).emit('drawing', data);
            }
        });
        socket.on('draw', (data) => {
            if (data.roomId) {
                socket.to(data.roomId).emit('draw', data);
            }
        });
        socket.on('shape', (data) => {
            if (data.roomId) {
                socket.to(data.roomId).emit('shape', data);
            }
        });
        socket.on('erase', (data) => {
            if (data.roomId) {
                socket.to(data.roomId).emit('erase', data);
            }
        });
        // cursor
        socket.on('cursor', (data) => {
            if (data.roomId) {
                socket.to(data.roomId).emit('cursor', { id: socket.id, x: data.x, y: data.y });
            }
        });
        // undo
        socket.on('undo', (data) => {
            if (data.roomId) {
                socket.to(data.roomId).emit('undo', data);
            }
        });
        // redo
        socket.on('redo', (data) => {
            if (data.roomId) {
                socket.to(data.roomId).emit('redo', data);
            }
        });
        // clear-board
        socket.on('clear-board', (data) => {
            if (data.roomId) {
                socket.to(data.roomId).emit('clear-board');
            }
        });
        // disconnect
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
            const user = activeUsers[socket.id];
            if (user) {
                if (user.roomId) {
                    socket.to(user.roomId).emit('partner_disconnected');
                    socket.to(user.roomId).emit('partner-disconnected');
                    // Clean up partner
                    for (const sId in activeUsers) {
                        if (activeUsers[sId].roomId === user.roomId) {
                            activeUsers[sId].status = 'online';
                            activeUsers[sId].roomId = undefined;
                            activeUsers[sId].partnerId = undefined;
                        }
                    }
                }
                delete activeUsers[socket.id];
                broadcastOnlineUsers();
            }
        });
    });
};
exports.initSocket = initSocket;
//# sourceMappingURL=index.js.map
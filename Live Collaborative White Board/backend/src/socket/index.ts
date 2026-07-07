import { Server, Socket } from 'socket.io';

interface User {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
}

export const initSocket = (io: Server) => {
  const rooms: Record<string, Record<string, User>> = {};

  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join-room', (roomId: string, user: { name: string, color: string }) => {
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

    socket.on('leave-room', (roomId: string) => {
      socket.leave(roomId);
      if (rooms[roomId] && rooms[roomId][socket.id]) {
        delete rooms[roomId][socket.id];
        socket.to(roomId).emit('user-left', socket.id);
      }
    });

    socket.on('cursor-move', (roomId: string, pos: { x: number, y: number }) => {
      const user = rooms[roomId]?.[socket.id];
      if (user) {
        user.x = pos.x;
        user.y = pos.y;
        socket.to(roomId).emit('cursor-moved', { id: socket.id, x: pos.x, y: pos.y });
      }
    });

    socket.on('canvas-update', (roomId: string, data: any) => {
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

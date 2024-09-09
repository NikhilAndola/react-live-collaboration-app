import { Server, Socket } from 'socket.io';
import { Client, UserSocketMap } from './types';
import http from 'http';
import { ACTIONS } from './actions';

const userSocketMap: UserSocketMap = {};

// Function to get all connected clients in a room
const getAllConnectedClients = (io: Server, roomId: string): Client[] => {
  const room = io.sockets.adapter.rooms.get(roomId);
  return Array.from(room || []).map((socketId) => ({
    socketId,
    username: userSocketMap[socketId],
  }));
};

// Function to handle all Socket.io events
export const initializeSocket = (server: http.Server) => {
  const io = new Server(server);

  io.on('connection', (socket: Socket) => {
    console.info(`Socket connected: ${socket.id}`);

    socket.on(ACTIONS.JOIN, ({ roomId, username }: { roomId: string; username: string }) => {
      userSocketMap[socket.id] = username;
      socket.join(roomId);
      const clients = getAllConnectedClients(io, roomId);

      clients.forEach(({ socketId }) => {
        io.to(socketId).emit(ACTIONS.JOINED, {
          clients,
          username,
          socketId: socket.id,
        });
      });
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }: { roomId: string; code: string }) => {
      socket.to(roomId).emit(ACTIONS.CODE_CHANGE, { code }); // Broadcasting to everyone but the sender
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }: { socketId: string; code: string }) => {
      io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on('disconnecting', () => {
      const rooms = [...socket.rooms];
      rooms.forEach((roomId) => {
        socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
          socketId: socket.id,
          username: userSocketMap[socket.id],
        });
      });

      delete userSocketMap[socket.id]; // Remove user from the map
    });

    socket.on('disconnect', () => {
      console.info(`Socket disconnected: ${socket.id}`);
    });

    socket.on('error', (err) => {
      console.error(`Socket error: ${err}`);
    });
  });

  return io;
};

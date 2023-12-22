"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpServer = exports.socketIo = void 0;
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = require("./server"); // Importe o app ou o servidor Express
dotenv_1.default.config();
// Crie um servidor HTTP usando o app Express existente
const httpServer = (0, http_1.createServer)(server_1.server);
exports.httpServer = httpServer;
// Inicialize o Socket.IO passando o servidor HTTP criado
const socketIo = new socket_io_1.Server(httpServer, {
    cors: {
        origin: 'https://front-end-chat-beta.vercel.app',
        credentials: true
    }
});
exports.socketIo = socketIo;
socketIo.on('connection', (socket) => {
    socket.on('disconnect', () => {
        // Lógica ao desconectar um cliente
    });
    socket.on('message', (msg) => {
        socketIo.emit('message', msg);
    });
});

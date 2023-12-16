"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpServer = exports.socketIo = void 0;
//socket.io funcionar precisa criar server http
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = require("./server");
dotenv_1.default.config();
//server http se conecta no server normal do express
const httpServer = (0, http_1.createServer)(server_1.server);
exports.httpServer = httpServer;
//passo o server http para o socketio
const socketIo = new socket_io_1.Server(httpServer, {
    cors: {
        origin: 'https://front-end-chat-lucasmuri777.vercel.app',
    }
});
exports.socketIo = socketIo;
socketIo.on('connection', (socket) => {
    socket.on('disconnect', () => {
    });
    socket.on('message', (msg) => {
        socketIo.emit('message', msg);
    });
});

import { createServer } from 'http';
import { Server as Io } from 'socket.io';
import dotenv from 'dotenv';
import { server } from './server'; // Importe o app ou o servidor Express

dotenv.config();

// Crie um servidor HTTP usando o app Express existente
const httpServer = createServer(server);

// Inicialize o Socket.IO passando o servidor HTTP criado
const socketIo = new Io(httpServer,{
    cors: {
        origin: 'https://front-end-chat-beta.vercel.app',
        credentials: true
    }
});

socketIo.on('connection', (socket) => {
    socket.on('disconnect', () => {
        // Lógica ao desconectar um cliente
    });
    
    socket.on('message', (msg) => {
        socketIo.emit('message', msg);
    });
});

export { socketIo, httpServer };

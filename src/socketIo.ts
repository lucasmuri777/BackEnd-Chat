//socket.io funcionar precisa criar server http
import {Server ,createServer} from 'http';
import { Server as Io } from 'socket.io';
import dotenv from 'dotenv';
import { server } from './server';

dotenv.config();


//server http se conecta no server normal do express
const httpServer = createServer(server);
//passo o server http para o socketio
const socketIo: Io = new Io(httpServer, {
    cors: {
        origin: process.env.CLIENT,
    }
});

socketIo.on('connection', (socket) => {

    socket.on('disconnect', () => {
    })
    
    socket.on('message', (msg) => {
        socketIo.emit('message', msg);
    })
})

export {socketIo, httpServer};
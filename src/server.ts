import express, {Request, Response, ErrorRequestHandler} from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import { mongoConnect } from './instances/mongo';
import { MulterError} from 'multer';
import { httpServer } from './socketIo'; // Importe httpServer e socketIo do arquivo socketSetup.js


import apiRoutes from './routes/api'

dotenv.config();
mongoConnect();

export const server = express();

server.use(cors(
    {
        origin: process.env.CLIENT,
    }
));
server.use(express.json());
server.use(express.static(path.join(__dirname, '../public')));
server.use(express.urlencoded({ extended: true }));

server.use(apiRoutes)

server.use((req: Request, res: Response) => {
    res.status(404)
    res.json({error: 'Endpoint not found'})
})

const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: Function) => {
    res.status(400); //BAD REQUEST

    if(err instanceof MulterError){
        res.json({error: err.code});
        return
    }

    console.log(err);
    res.json({error: 'Ocorreu algum erro'});
}
server.use(errorHandler);

server.listen(process.env.PORT);
httpServer.listen(3333);

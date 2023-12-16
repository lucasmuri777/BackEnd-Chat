import {connect, ConnectOptions} from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const mongoConnect = async()=>{
    try{
        console.log('Connectando no Banco De Dados');

        await connect(process.env.MONGO_URL as string, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as ConnectOptions)
        
    }catch(error){
        console.log(error);
    }
}
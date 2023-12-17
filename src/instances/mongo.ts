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
        console.log('erro' + error);
    }
}




/*import { MongoClient, MongoClientOptions, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

export const mongoConnect = async () => {

    const clientOptions: MongoClientOptions = {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    };

    const client = new MongoClient(process.env.MONGO_URL as string, clientOptions);

    try {
        console.log('Conectando ao banco de dados...');

        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Ping realizado com sucesso. Conexão estabelecida com o MongoDB!");
    } finally {
        await client.close();
        console.log("Conexão encerrada.");
    }
};

// Chamar a função mongoConnect para iniciar a conexão
mongoConnect().catch(console.error);*/
import { connect, ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const mongoConnect = async (): Promise<void> => {
    try {
        console.log('Conectando no Banco De Dados');
        await connect(process.env.MONGO_URL as string);
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        throw new Error('Erro ao conectar ao MongoDB');
        // Ou então, você pode personalizar a mensagem de erro lançada para algo mais específico.
        // throw new Error(`Erro ao conectar ao MongoDB: ${error.message}`);
    }
};





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
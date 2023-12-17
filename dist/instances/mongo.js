"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoConnect = void 0;
const mongoose_1 = require("mongoose");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoConnect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Conectando no Banco De Dados');
        yield (0, mongoose_1.connect)(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
    catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        throw new Error('Erro ao conectar ao MongoDB');
        // Ou então, você pode personalizar a mensagem de erro lançada para algo mais específico.
        // throw new Error(`Erro ao conectar ao MongoDB: ${error.message}`);
    }
});
exports.mongoConnect = mongoConnect;
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

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
exports.getGeneratedFileName = exports.upload = void 0;
const firebase_1 = require("./../instances/firebase"); // Importe sua instância de storage do Firebase
const storage_1 = require("firebase/storage");
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
let generatedFileName = '';
const storageConfig = multer_1.default.memoryStorage(); // Armazenamento em memória para processar o arquivo
const uploadF = (0, multer_1.default)({
    storage: storageConfig,
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Por favor, envie uma imagem válida'));
        }
        cb(null, true);
    },
}).single('image'); // 'file' deve ser o nome do campo no formulário de upload
const upload = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    uploadF(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.error(err);
            return res.status(400).json({ message: err.message || 'Erro durante o upload do arquivo' });
        }
        try {
            if (!req.file) {
                next();
            }
            if (req.file) {
                generatedFileName = (0, uuid_1.v4)(); // Gerar um nome único
                // Gerar um nome único
                const storageRef = (0, storage_1.ref)(firebase_1.storage, `medias/${generatedFileName}.jpg`); // Ajuste o caminho conforme necessário
                generatedFileName = generatedFileName;
                const metadata = {
                    contentType: 'image/jpeg' // Defina o tipo do arquivo como 'image/jpeg'
                };
                const uploadTask = (0, storage_1.uploadBytesResumable)(storageRef, req.file.buffer, metadata);
                uploadTask.on('state_changed', (snapshot) => {
                    // Monitorar o progresso, se necessário
                }, (error) => __awaiter(void 0, void 0, void 0, function* () {
                    console.error(error);
                    return res.status(500).json({ message: 'Erro ao enviar arquivo para o Firebase' });
                }), () => __awaiter(void 0, void 0, void 0, function* () {
                    try {
                        const downloadURL = yield (0, storage_1.getDownloadURL)(uploadTask.snapshot.ref);
                        // Faça o que for necessário com o URL de download
                        next();
                    }
                    catch (error) {
                        console.error(error);
                        return res.status(500).json({ message: 'Erro ao obter URL do arquivo no Firebase' });
                    }
                }));
            }
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro durante o processo de upload para o Firebase' });
        }
    }));
});
exports.upload = upload;
const getGeneratedFileName = () => generatedFileName; // Função para acessar o nome gerado
exports.getGeneratedFileName = getGeneratedFileName;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const storageConfig = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/media');
    },
    filename: (req, file, cb) => {
        let letras = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '-', '_'];
        let nome = '';
        for (let i = 0; i < 21; i++) {
            let random = Math.floor(Math.random() * 2);
            if (random == 0) {
                nome += letras[Math.floor(Math.random() * letras.length)];
            }
            else {
                nome += letras[Math.floor(Math.random() * letras.length)].toUpperCase();
            }
        }
        let randomName = Math.floor(Math.random() * 999999999999999) + Date.now() + nome;
        cb(null, `${randomName}.jpg`);
    }
});
exports.upload = (0, multer_1.default)({
    storage: storageConfig,
    fileFilter: (req, file, cb) => {
        const allowed = ['image/png', 'image/jpg', 'image/jpeg'];
        cb(null, allowed.includes(file.mimetype));
    },
    limits: {
        fileSize: 1000000 * 15
    }
});

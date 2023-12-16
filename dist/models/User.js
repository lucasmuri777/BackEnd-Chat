"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const schema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: {
        type: String,
        required: true,
        set: (value) => {
            let salt = bcrypt_1.default.genSaltSync(10);
            let hash = bcrypt_1.default.hashSync(value, salt);
            return hash;
        }
    },
    photo: { type: String, default: 'default-perfil.jpg' },
    friends: { type: [String], default: [] },
    invites: { type: [String], default: [] }
});
const modelName = 'User';
exports.default = (mongoose_1.connection && mongoose_1.connection.models[modelName]) ?
    mongoose_1.connection.models[modelName]
    :
        (0, mongoose_1.model)(modelName, schema);

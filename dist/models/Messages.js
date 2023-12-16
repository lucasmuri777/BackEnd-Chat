"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    author: { type: String, required: true },
    name: { type: String, required: true },
    authorPhoto: { type: String, required: true },
    message: {
        type: String,
        required: true,
    },
    image: { type: String, default: '' },
    to: {
        type: Object,
        required: true,
        typeMsg: {
            type: String,
            required: true
        },
        id: { type: String }
    },
    created: { type: Date, default: Date.now },
});
const modelName = 'messages';
exports.default = (mongoose_1.connection && mongoose_1.connection.models[modelName]) ?
    mongoose_1.connection.models[modelName]
    :
        (0, mongoose_1.model)(modelName, schema);

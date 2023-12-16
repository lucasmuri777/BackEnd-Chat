import {Schema, model, Model, connection} from 'mongoose';
import bcrypt from 'bcrypt';

export type MessageType = {
    _id: string,
    author: string,
    name: string,
    authorPhoto: string,
    message: string,
    image?: string,
    to: {
        id: string
        typeMsg: string,
    },
    created: Date;
}

const schema = new Schema<MessageType>({
    author: {type: String, required: true},
    name: {type: String, required: true},
    authorPhoto: {type: String, required: true},
    message: {
        type: String, 
        required: true,
    },
    image: {type: String, default: ''}, 
    to: {
        type: Object,
        required: true,
        typeMsg: {
            type: String,
            required: true
        },
        id: {type: String}
    },
    created: {type:Date, default:Date.now},
});

const modelName: string = 'messages';

export default (connection && connection.models[modelName]) ?
connection.models[modelName] as Model<MessageType> 
:
model<MessageType>(modelName, schema);

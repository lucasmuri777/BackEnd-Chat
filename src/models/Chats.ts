import {Schema, model, Model, connection} from 'mongoose';
import bcrypt from 'bcrypt';

export type ChatType = {
    _id: string,
    name: string,
    password: string,
    members: string[],
    owner: string[],
    photo: string
}

const schema = new Schema<ChatType>({
    name: {type: String, required: true},
    password: {
        type: String, 
        required: true,
        set: (value: string)=>{
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(value, salt);
            return hash;
        }
    },
    members: {type: [String]},
    owner: {type: [String]},
    photo: {type: String}
});

const modelName: string = 'chats';

export default (connection && connection.models[modelName]) ?
connection.models[modelName] as Model<ChatType> 
:
model<ChatType>(modelName, schema);

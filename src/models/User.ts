import {Schema, model, Model, connection} from 'mongoose';
import bcrypt from 'bcrypt';

export type UserType = {
    _id: string,
    email: string,
    name: string,
    password: string,
    photo: string,
    friends: string[],
    invites: string[],
}

const schema = new Schema<UserType>({
    email: {type: String, required: true, unique: true},
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
    photo: {type: String, default: 'default-perfil.jpg'},
    friends: {type: [String], default: []},
    invites: {type: [String], default: []}
});

const modelName: string = 'User';

export default (connection && connection.models[modelName]) ?
connection.models[modelName] as Model<UserType> 
:
model<UserType>(modelName, schema);

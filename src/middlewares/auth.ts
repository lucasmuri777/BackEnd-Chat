import {Request, Response, NextFunction} from 'express';
import User from '../models/User';
import JWT, { JwtPayload} from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();


export const Auth = {
    private: async(req: Request, res: Response, next: NextFunction)=>{
        let sucess = false;

        if(req.headers.authorization){

            const [authType, token] = req.headers.authorization.split(' ');
            if(authType === 'Bearer'){
                try{
                    const decoded = JWT.verify(
                        token, 
                        process.env.JWT_SECRET_KEY as string
                    );
                    if(!decoded || typeof decoded !== 'object' || !('email' in decoded)){
                        return false;
                    }
                    let hasUser = await User.find({
                        email: decoded.email,
                    })
                    if(hasUser.length > 0){
                        sucess = true
                    }
                    
                }catch(err){
                    sucess = false;
                }
            }
        }
        if(sucess){
            next();
            return;
        }

        res.status(403)
        res.json({error: 'Unauthorized'})
    }
}


import JWT, {JwtPayload} from 'jsonwebtoken';
export const userContext = (vis: any) => {
    let token = vis.headers.authorization?.split(' ')[1];
    if(!token){
        return false;
    }
    let decodedToken = JWT.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;
    if(!decodedToken || typeof decodedToken !== 'object' || !('email' in decodedToken)){
        return false;
    }
    return decodedToken;
}
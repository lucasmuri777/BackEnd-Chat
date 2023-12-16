import multer from 'multer';
import path from 'path';

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, './public/media');
    }, 
    filename: (req, file, cb) =>{
        let letras = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '-', '_'];
        let nome = '';
        for(let i = 0; i < 21; i++){
            let random = Math.floor(Math.random() * 2);
            if(random == 0){
                nome += letras[Math.floor(Math.random() * letras.length)];
            }else{
                nome += letras[Math.floor(Math.random() * letras.length)].toUpperCase();
            }
        }
        let randomName = Math.floor(Math.random() * 999999999999999) + Date.now() + nome;

        cb(null, `${randomName}.jpg`);
    }
});

export const upload = multer({
    storage: storageConfig,
    fileFilter: (req, file, cb)=>{
        const allowed: string[] = ['image/png', 'image/jpg', 'image/jpeg'];
        cb(null, allowed.includes(file.mimetype));
    },
    limits: {
        fileSize: 1000000 * 15
    }
})
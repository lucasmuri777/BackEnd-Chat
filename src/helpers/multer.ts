import { NextFunction, Request, Response } from 'express';
import { storage } from './../instances/firebase'; // Importe sua instância de storage do Firebase
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

let generatedFileName: string = '';
const storageConfig = multer.memoryStorage(); // Armazenamento em memória para processar o arquivo

const uploadF = multer({
  storage: storageConfig,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Por favor, envie uma imagem válida'));
    }
    cb(null, true);
  },
}).single('image'); // 'file' deve ser o nome do campo no formulário de upload

export const upload = async (req: Request, res: Response, next: NextFunction) => {
  uploadF(req, res, async (err: any) => {
    if (err) {
      console.error(err);
      return res.status(400).json({ message: err.message || 'Erro durante o upload do arquivo' });
    }

    try {
      if (!req.file) {
        next();
      }
      if(req.file){
      
      generatedFileName = uuidv4(); // Gerar um nome único
      // Gerar um nome único


      const storageRef = ref(storage, `medias/${generatedFileName}.jpg`); // Ajuste o caminho conforme necessário
      generatedFileName = generatedFileName;
      const metadata = {
        contentType: 'image/jpeg' // Defina o tipo do arquivo como 'image/jpeg'
      };

      const uploadTask = uploadBytesResumable(storageRef, req.file.buffer, metadata);

      uploadTask.on('state_changed',
        (snapshot) => {
          // Monitorar o progresso, se necessário
        },
        async (error) => {
          console.error(error);
          return res.status(500).json({ message: 'Erro ao enviar arquivo para o Firebase' });
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            // Faça o que for necessário com o URL de download

            next();
          } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao obter URL do arquivo no Firebase' });
          }
        }
      );
    }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro durante o processo de upload para o Firebase' });
    }
  });
};

export const getGeneratedFileName = () => generatedFileName; // Função para acessar o nome gerado


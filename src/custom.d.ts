// custom.d.ts

import { Request } from 'express';

// Estendendo a interface Request do Express para adicionar a propriedade generatedFileName
declare module 'express' {
  interface Request {
    generatedFileName?: string;
  }
}

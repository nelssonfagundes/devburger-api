import { extname, resolve } from 'node:path'
import multer from 'multer'
import { v4 } from 'uuid'

const uploadsFolder = resolve(import.meta.dirname, '..', '..', 'uploads')

export default {
  storage: multer.diskStorage({
    destination: uploadsFolder,
    // nome único para a imagem não sobrescrever outra
    filename: (_request, file, callback) =>
      callback(null, v4() + extname(file.originalname)),
  }),
}

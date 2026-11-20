import { resolve } from 'node:path'
import cors from 'cors'
import express from 'express'

import routes from './routes.js'
import './database/index.js'

class App {
  constructor() {
    this.app = express()

    this.middlewares()
    this.routes()
  }

  middlewares() {
    // libera o front-end (outro endereço) para acessar a API
    this.app.use(cors())
    this.app.use(express.json())
    // deixa as imagens acessíveis pelo navegador
    const uploads = resolve(import.meta.dirname, '..', 'uploads')

    this.app.use('/product-file', express.static(uploads))
    this.app.use('/category-file', express.static(uploads))
  }

  routes() {
    this.app.use(routes)
  }
}

export default new App().app
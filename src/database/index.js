import mongoose from 'mongoose'
import Sequelize from 'sequelize'

import databaseConfig from '../config/database.js'
import Category from '../app/models/Category.js'
import Product from '../app/models/Product.js'
import User from '../app/models/User.js'

const models = [User, Product, Category]

class Database {
  constructor() {
    this.init()
    this.mongo()
  }

  // PostgreSQL: usuários, produtos e categorias
  init() {
    this.connection = new Sequelize(databaseConfig)
    models
      .map((model) => model.init(this.connection))
      .map((model) => model.associate?.(this.connection.models))
  }

  // MongoDB: pedidos
  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/devburger',
    )
  }
}

export default new Database()

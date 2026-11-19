// Popula o banco com um admin, categorias e produtos de exemplo
// Uso: npm run seed
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import mongoose from 'mongoose'
import { v4 } from 'uuid'

import Category from '../app/models/Category.js'
import Product from '../app/models/Product.js'
import User from '../app/models/User.js'
import database from './index.js'

const imagesFolder = resolve(import.meta.dirname, 'seed-images')
const uploadsFolder = resolve(import.meta.dirname, '..', '..', 'uploads')

// copia a imagem de exemplo para a pasta uploads e devolve o nome
function image(file) {
  const name = `seed-${file}`
  const destination = resolve(uploadsFolder, name)
  if (!existsSync(destination)) {
    copyFileSync(resolve(imagesFolder, file), destination)
  }
  return name
}

const categories = [
  { name: 'Hambúrgueres', file: 'monstruoso.jpg' },
  { name: 'Veganos', file: 'xvegan.jpg' },
  { name: 'Combos', file: 'bacon-egg.jpg' },
]

// preço em centavos
const products = [
  { name: 'X-Salada', price: 3000, category: 'Hambúrgueres', file: 'xsalada.jpg', offer: false },
  { name: 'X-Bacon', price: 3400, category: 'Hambúrgueres', file: 'xbacon.jpg', offer: true },
  { name: 'X-Bacon Egg', price: 3900, category: 'Hambúrgueres', file: 'bacon-egg.jpg', offer: true },
  { name: 'Monstruoso', price: 5000, category: 'Hambúrgueres', file: 'monstruoso.jpg', offer: true },
  { name: 'Big Vegano', price: 5500, category: 'Veganos', file: 'monstruoso-vegan.jpg', offer: true },
  { name: 'X-Vegan', price: 4500, category: 'Veganos', file: 'xvegan.jpg', offer: false },
  { name: 'Combo Junior', price: 4500, category: 'Combos', file: 'xsalada.jpg', offer: true },
  { name: 'Combo Senior', price: 7500, category: 'Combos', file: 'monstruoso.jpg', offer: false },
]

async function seed() {
  const adminEmail = 'admin@devburger.com'

  if (!(await User.findOne({ where: { email: adminEmail } }))) {
    await User.create({
      id: v4(),
      name: 'Admin DevBurger',
      email: adminEmail,
      password: '123456',
      admin: true,
    })
    console.log(`Admin criado: ${adminEmail} / senha 123456`)
  }

  const categoryIds = {}

  for (const item of categories) {
    const [category] = await Category.findOrCreate({
      where: { name: item.name },
      defaults: { path: image(item.file) },
    })
    categoryIds[item.name] = category.id
  }

  for (const item of products) {
    await Product.findOrCreate({
      where: { name: item.name },
      defaults: {
        price: item.price,
        category_id: categoryIds[item.category],
        path: image(item.file),
        offer: item.offer,
      },
    })
  }

  console.log(`✅ ${categories.length} categorias e ${products.length} produtos prontos`)
}

seed()
  .catch((err) => {
    console.error('Erro ao popular o banco:', err.message)
    process.exitCode = 1
  })
  .finally(async () => {
    await database.connection.close()
    await mongoose.disconnect()
  })

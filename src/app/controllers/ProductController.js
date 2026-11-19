import * as Yup from 'yup'

import Category from '../models/Category.js'
import Product from '../models/Product.js'

class ProductController {
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category_id: Yup.number().required(),
      offer: Yup.boolean(),
    })

    try {
      schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    if (!request.file) {
      return response.status(400).json({ error: 'Envie a imagem do produto' })
    }

    const { filename: path } = request.file
    const { name, price, category_id, offer } = request.body

    const category = await Category.findByPk(category_id)

    if (!category) {
      return response.status(400).json({ error: 'Categoria não existe' })
    }

    const product = await Product.create({
      name,
      price: Number(price),
      category_id: Number(category_id),
      path,
      offer: offer === true || offer === 'true',
    })

    return response.status(201).json(product)
  }

  async index(_request, response) {
    const products = await Product.findAll({
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
      ],
    })

    return response.json(products)
  }

  async update(request, response) {
    const schema = Yup.object({
      name: Yup.string(),
      price: Yup.number(),
      category_id: Yup.number(),
      offer: Yup.boolean(),
    })

    try {
      schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { id } = request.params

    const product = await Product.findByPk(id)

    if (!product) {
      return response.status(404).json({ error: 'Produto não encontrado' })
    }

    const { name, price, category_id, offer } = request.body

    if (category_id) {
      const category = await Category.findByPk(category_id)

      if (!category) {
        return response.status(400).json({ error: 'Categoria não existe' })
      }
    }

    await product.update({
      name: name ?? product.name,
      price: price !== undefined ? Number(price) : product.price,
      category_id: category_id ? Number(category_id) : product.category_id,
      offer: offer !== undefined ? offer === true || offer === 'true' : product.offer,
      path: request.file?.filename ?? product.path,
    })

    return response.status(200).json(product)
  }
}

export default new ProductController()

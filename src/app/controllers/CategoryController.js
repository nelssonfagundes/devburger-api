import * as Yup from 'yup'

import Category from '../models/Category.js'

class CategoryController {
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
    })

    try {
      schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { name } = request.body
    const path = request.file?.filename

    const categoryExists = await Category.findOne({ where: { name } })

    if (categoryExists) {
      return response.status(409).json({ error: 'Categoria já existe' })
    }

    const { id } = await Category.create({ name, path })

    return response.status(201).json({ id, name })
  }

  async index(_request, response) {
    const categories = await Category.findAll()

    return response.json(categories)
  }

  async update(request, response) {
    const schema = Yup.object({
      name: Yup.string(),
    })

    try {
      schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { id } = request.params

    const category = await Category.findByPk(id)

    if (!category) {
      return response.status(404).json({ error: 'Categoria não encontrada' })
    }

    const { name } = request.body
    const path = request.file?.filename

    if (name && name !== category.name) {
      const nameInUse = await Category.findOne({ where: { name } })

      if (nameInUse) {
        return response.status(409).json({ error: 'Categoria já existe' })
      }
    }

    await category.update({ name: name ?? category.name, path: path ?? category.path })

    return response.status(200).json(category)
  }
}

export default new CategoryController()

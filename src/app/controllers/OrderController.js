import * as Yup from 'yup'

import Category from '../models/Category.js'
import Product from '../models/Product.js'
import Order from '../schemas/Order.js'

const STATUS = ['Pedido realizado', 'Em preparação', 'Saiu para entrega', 'Entregue', 'Cancelado']

class OrderController {
  async store(request, response) {
    const schema = Yup.object({
      products: Yup.array()
        .required()
        .min(1)
        .of(
          Yup.object({
            id: Yup.number().required(),
            quantity: Yup.number().integer().min(1).required(),
          }),
        ),
    })

    try {
      schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { products } = request.body
    const productsIds = products.map((product) => product.id)

    // busca os produtos no PostgreSQL para pegar preço e categoria reais
    const foundProducts = await Product.findAll({
      where: { id: productsIds },
      include: [{ model: Category, as: 'category', attributes: ['name'] }],
    })

    if (foundProducts.length !== new Set(productsIds).size) {
      return response.status(400).json({ error: 'Produto não encontrado' })
    }

    const orderProducts = foundProducts.map((product) => {
      const { quantity } = products.find((item) => item.id === product.id)

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category?.name ?? 'Sem categoria',
        url: product.url,
        quantity,
      }
    })

    const order = await Order.create({
      user: { id: request.userId, name: request.userName },
      products: orderProducts,
      status: 'Pedido realizado',
    })

    return response.status(201).json(order)
  }

  async index(request, response) {
    // admin vê todos os pedidos; cliente vê só os dele
    const filter = request.userIsAdmin ? {} : { 'user.id': request.userId }

    const orders = await Order.find(filter).sort({ createdAt: -1 })

    return response.json(orders)
  }

  async update(request, response) {
    const schema = Yup.object({
      status: Yup.string().oneOf(STATUS).required(),
    })

    try {
      schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { id } = request.params
    const { status } = request.body

    try {
      const order = await Order.findByIdAndUpdate(id, { status }, { new: true })

      if (!order) {
        return response.status(404).json({ error: 'Pedido não encontrado' })
      }

      return response.json(order)
    } catch {
      return response.status(400).json({ error: 'Id de pedido inválido' })
    }
  }
}

export default new OrderController()

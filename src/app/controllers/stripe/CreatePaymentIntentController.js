import Stripe from 'stripe'
import * as Yup from 'yup'

import Product from '../../models/Product.js'

export const DELIVERY_FEE = 500 // taxa de entrega em centavos (R$ 5,00)

class CreatePaymentIntentController {
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

    if (!process.env.STRIPE_SECRET_KEY) {
      return response
        .status(500)
        .json({ error: 'Chave do Stripe não configurada no arquivo .env' })
    }

    const { products } = request.body

    // o valor é calculado com os preços do banco, nunca com o que veio do navegador
    const foundProducts = await Product.findAll({
      where: { id: products.map((item) => item.id) },
    })

    const subtotal = products.reduce((acc, item) => {
      const product = foundProducts.find((p) => p.id === item.id)
      return product ? acc + product.price * item.quantity : acc
    }, 0)

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: subtotal + DELIVERY_FEE,
      currency: 'brl',
      automatic_payment_methods: { enabled: true },
    })

    return response.json({
      clientSecret: paymentIntent.client_secret,
      amount: subtotal + DELIVERY_FEE,
    })
  }
}

export default new CreatePaymentIntentController()

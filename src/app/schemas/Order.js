import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  url: { type: String, required: true },
  quantity: { type: Number, required: true },
})

const OrderSchema = new mongoose.Schema(
  {
    user: {
      id: { type: String, required: true },
      name: { type: String, required: true },
    },
    products: [ProductSchema],
    status: { type: String, required: true },
  },
  { timestamps: true },
)

export default mongoose.model('Order', OrderSchema)

import jwt from 'jsonwebtoken'
import * as Yup from 'yup'

import authConfig from '../../config/auth.js'

import User from '../models/User.js'

class SessionController {
  async store(request, response) {
    const schema = Yup.object({
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
    })

    const isValid = await schema.isValid(request.body)

    // mesma mensagem para qualquer erro: não revela se o e-mail existe
    const loginError = () =>
      response.status(401).json({ error: 'E-mail ou senha incorretos' })

    if (!isValid) {
      return loginError()
    }

    const { email, password } = request.body

    const user = await User.findOne({ where: { email } })

    if (!user) {
      return loginError()
    }

    const passwordIsCorrect = await user.checkPassword(password)

    if (!passwordIsCorrect) {
      return loginError()
    }

    // o token guarda quem é o usuário e se ele é admin
    const token = jwt.sign(
      { id: user.id, name: user.name, admin: user.admin },
      authConfig.secret,
      { expiresIn: authConfig.expiresIn },
    )

    return response.status(200).json({
      id: user.id,
      name: user.name,
      email,
      admin: user.admin,
      token,
    })
  }
}

export default new SessionController()

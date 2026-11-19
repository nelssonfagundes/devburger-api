import jwt from 'jsonwebtoken'

import authConfig from '../../config/auth.js'

// confere o token enviado no cabeçalho: Authorization: Bearer <token>
function authMiddleware(request, response, next) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    return response.status(401).json({ error: 'Token não enviado' })
  }

  const [, token] = authHeader.split(' ')

  try {
    const decoded = jwt.verify(token, authConfig.secret)

    request.userId = decoded.id
    request.userName = decoded.name
    request.userIsAdmin = decoded.admin

    return next()
  } catch {
    return response.status(401).json({ error: 'Token inválido' })
  }
}

export default authMiddleware

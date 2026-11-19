// só deixa passar usuário administrador (usar depois do authMiddleware)
function adminMiddleware(request, response, next) {
  if (!request.userIsAdmin) {
    return response
      .status(401)
      .json({ error: 'Acesso permitido só para administradores' })
  }

  return next()
}

export default adminMiddleware

const authorizeSelfOrAdmin = (req, res, next) => {
  const userId = req.user.id; // ID do usuário autenticado
  const targetUserId = req.params.id; // ID do usuário a ser atualizado
  const userRole = req.user.role; // Papel do usuário autenticado

  if (userRole === 'admin' || userId === targetUserId) {
    // Usuário é admin ou está tentando editar seu próprio perfil
    return next();
  } else {
    // Usuário não tem permissão
    return res.status(403).json({
      error: 'Acesso negado. Você não tem permissão para realizar esta ação.',
      success: false,
    });
  }
};

module.exports = authorizeSelfOrAdmin;

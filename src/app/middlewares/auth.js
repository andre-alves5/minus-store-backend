const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const configAuth = require('../../config/auth');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: true,
      message: 'Erro: Token não encontrado!',
    });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, configAuth.secret);
    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(401).json({
      error: true,
      message: 'Erro: Token inválido!',
    });
  }
};

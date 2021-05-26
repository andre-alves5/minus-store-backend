import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User';
import configAuth from '../../config/auth';

class LoginController {
  async store(req, res) {
    const { email, password } = req.body;

    const userExists = await UserModel.findOne({ email: email });

    if (!userExists) {
      return res.status(401).json({
        error: true,
        message: 'Erro: Usuario não encontrado',
      });
    }

    if (!(await bcrypt.compare(password, userExists.password))) {
      return res.status(401).json({
        error: true,
        message: 'Erro: Senha inválida!',
      });
    }

    return res.json({
      user: {
        id: userExists._id,
        name: userExists.name,
        email,
      },
      token: jwt.sign({ id: userExists._id }, configAuth.secret, {
        expiresIn: configAuth.expiresIn,
      }),
    });
  }
}

export default new LoginController();

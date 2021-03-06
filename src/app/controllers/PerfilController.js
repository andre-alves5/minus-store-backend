const Yup = require('yup');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const config = require('../../config/config');
const configAuth = require('../../config/auth');

class PerfilController {
  async show(req, res) {
    UserModel.findOne(
      { _id: req.userId },
      '_id name email createdAt updatedAt fileName'
    )
      .then((user) => {
        if (user.fileName) {
          let url = config.url + '/files/users/' + user.fileName;
        } else {
          let url = config.url + '/files/users/icone_usuario.png';
        }

        const { _id, name, email, createdAt, updatedAt, fileName } = user;

        return res.json({
          error: false,
          user: {
            _id,
            name,
            email,
            createdAt,
            updatedAt,
            fileName,
            url: url,
          },
          url: url,
          token: jwt.sign({ id: req.userId }, configAuth.secret, {
            expiresIn: configAuth.expiresIn,
          }),
        });
      })
      .catch((error) => {
        return res.status(200).json({
          error: true,
          message: 'Erro: Perfil não encontrado!',
        });
      });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      password: Yup.string().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: true,
        message: 'Erro: data do formulário inválido!',
      });
    }

    const { email } = req.body;

    const userExists = await UserModel.findOne({ _id: req.userId });

    if (!userExists) {
      return res.status(400).json({
        error: true,
        message: 'Erro: Usuário não encontrado!',
      });
    }

    if (email != userExists.email) {
      const emailExists = await UserModel.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          error: true,
          message: 'Erro: Este e-mail já está cadastrado!',
        });
      }
    }

    let data = req.body;
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 8);
    }

    await UserModel.updateOne({ _id: req.userId }, data, (err) => {
      if (err)
        return res.status(400).json({
          error: true,
          message: 'Erro: Usuário não foi editado com sucesso!',
        });

      return res.json({
        error: false,
        message: 'Perfil editado com sucesso!',
      });
    });
  }
}

module.exports = new PerfilController();

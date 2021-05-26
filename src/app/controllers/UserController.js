import * as Yup from 'yup';
import bcrypt from 'bcryptjs';
import UserModel from '../models/User';

class UserController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const { limit = 40 } = req.query;
    await UserModel.paginate(
      {},
      { select: '_id name email', page, limit, sort: '-createdAt' }
    )
      .then((data) => {
        return res.json({
          error: false,
          users: data,
        });
      })
      .catch((error) => {
        return res.status(400).json({
          error: true,
          message: 'Erro: Não foi possível executar a solicitação!',
        });
      });
  }

  async show(req, res) {
    UserModel.findOne(
      { _id: req.params.id },
      '_id name email createdAt updatedAt originalName fileName'
    )
      .then((data) => {
        return res.json({
          error: false,
          user: data,
        });
      })
      .catch((error) => {
        return res.status(400).json({
          error: true,
          message: 'Erro: Não foi possível executar a solicitação!',
        });
      });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: true,
        message: 'Error: Dados inválidos!',
      });
    }

    const emailExists = await UserModel.findOne({ email: req.body.email });
    if (emailExists) {
      return res.status(400).json({
        error: true,
        message: 'Error: Este e-mail já está cadastrado!',
      });
    }

    var data = req.body;
    data.password = await bcrypt.hash(data.password, 8);

    const user = UserModel.create(data, (error) => {
      if (error)
        return res.status(400).json({
          error: true,
          message: 'Error: Usuário não foi cadastrado com sucesso!',
        });

      return res.status(200).json({
        error: false,
        message: 'Usuário cadastrado com sucesso!',
        data: user,
      });
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      _id: Yup.string().required(),
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

    const { _id, email } = req.body;

    const userExists = await UserModel.findOne({ _id: _id });

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

    var data = req.body;
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 8);
    }

    await UserModel.updateOne({ _id: data._id }, data, (err) => {
      if (err)
        return res.status(400).json({
          error: true,
          message: 'Erro: Usuário não foi editado com sucesso!',
        });

      return res.json({
        error: false,
        message: 'Usuário editado com sucesso!',
      });
    });
  }

  async delete(req, res) {
    const userExists = await UserModel.findOne({ _id: req.params.id });
    if (!userExists) {
      return res.status(400).json({
        error: true,
        message: 'Erro: Usuário não encontrado',
      });
    }

    await UserModel.deleteOne({ _id: req.params.id }, (error) => {
      if (error)
        return res.status(400).json({
          error: true,
          message: 'Error: Usuário não foi apagado com sucesso!',
        });
    });

    return res.json({
      error: false,
      message: 'Usuário apagado com sucesso!',
    });
  }
}

export default new UserController();

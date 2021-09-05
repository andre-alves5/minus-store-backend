import * as Yup from "yup";
import bcrypt from "bcryptjs";
import UserModel from "../models/User";
import nodemailer from "nodemailer";
import config from "../../config/config";
import configEmail from "../../config/email";

class PasswordRecoveryController {
  async show(req, res) {
    UserModel.findOne({ passwordRecovery: req.params.passwordRecovery }, "_id")
      .then((user) => {
        if (user._id) {
          return res.json({
            error: false,
            user: user,
          });
        }
      })
      .catch((error) => {
        return res.status(400).json({
          error: true,
          messsage: "Erro: URL inválida!",
        });
      });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: true,
        messsage: "Erro: Dados inválidos!",
      });
    }

    var data = req.body;
    const userExists = await UserModel.findOne(
      { email: data.email },
      "_id name email"
    );
    if (!userExists) {
      return res.status(400).json({
        error: true,
        message: "Error: Nenhum usuário encontrado com esse e-mail!",
      });
    }

    data.passwordRecovery = Math.random().toString(36).substr(3, 10);

    await UserModel.updateOne({ email: data.email }, data, (error) => {
      if (error)
        return res.status(400).json({
          error: true,
          message: "Erro: Não foi possível executar a solicitação!",
        });

      let transport = nodemailer.createTransport({
        host: configEmail.host,
        port: configEmail.port,
        auth: {
          user: configEmail.user,
          pass: configEmail.pass,
        },
      });

      let emailHtml =
        "Prezado(a) " +
        userExists.name +
        "<br><br> Você solicitou uma alteração de senha.<br>Seguindo o link abaixo você poderá alterar sua senha.<br>Para continuar o processo de recuperação de sua senha, clique no link abaixo ou cole o endereço abaixo no seu navegador.<br><br>" +
        config.urlSite +
        "/atualizar-senha-login/" +
        data.passwordRecovery +
        "<br><br>Usuário: " +
        userExists.email +
        "<br><br>Se você não solicitou essa alteração, nenhuma ação é necessária. Sua senha permanecerá a mesma até que você ative este código";

      let emailText =
        "Prezado(a) " +
        userExists.name +
        "\n\nVocê solicitou uma alteração de senha.\nSeguindo o link abaixo você poderá alterar sua senha.\nPara continuar o processo de recuperação de sua senha, clique no link abaixo ou cole o endereço abaixo no seu navegador.\n\n" +
        config.urlSite +
        "/atualizar-senha-login/" +
        data.passwordRecovery +
        "\n\nUsuário: " +
        userExists.email +
        "\n\nSe você não solicitou essa alteração, nenhuma ação é necessária. Sua senha permanecerá a mesma até que você ative este código";

      let emailMessage = {
        from: configEmail.from,
        to: userExists.email,
        subject: "Instruções para recuperar a senha",
        html: emailHtml,
        text: emailText,
      };

      transport.sendMail(emailMessage, function (error) {
        if (error)
          return res.status(400).json({
            error: true,
            code: 111,
            message: "Erro: Não foi possível executar a solicitação!",
          });

        return res.json({
          error: false,
          message:
            "Enviado no e-mail as intruções para recuperar a senha, verifique sua caixa de entrada!",
        });
      });
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      _id: Yup.string().required(),
      passwordRecovery: Yup.string().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: true,
        messsage: "Erro: data inválidos!",
      });
    }

    const { _id, passwordRecovery } = req.body;

    const usuarioExiste = await UserModel.findOne({ _id: _id }, "_id");
    if (!usuarioExiste) {
      return res.status(400).json({
        error: true,
        messsage: "Erro: Usuário não encontrado!",
      });
    }

    const validateKey = await UserModel.findOne(
      { passwordRecovery: passwordRecovery },
      "_id"
    );
    if (!validateKey) {
      return res.status(401).json({
        error: true,
        message: "Erro: URL inválida!",
      });
    }

    var data = req.body;
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 8);
      data.passwordRecovery = null;
    }

    await UserModel.updateOne({ _id: data._id }, data, (error) => {
      if (error)
        return res.status(400).json({
          error: true,
          message: "Erro: Senha não foi editada com sucesso!",
        });

      return res.json({
        error: false,
        message: "Senha editada com sucesso!",
      });
    });
  }
}

export default new PasswordRecoveryController();

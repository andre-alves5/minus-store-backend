const UserModel = require('../models/User');
const fs = require('fs');

class PerfilImagemController {
  async update(req, res) {
    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: 'Error: Selecione uma imagem válida JPEG ou PNG!',
      });
    }

    const imageData = {
      originalName: req.file.originalname,
      fileName: req.file.filename,
    };

    await UserModel.findOne({ _id: req.userId }, '_id fileName')
      .then((user) => {
        req.userImageData = user.fileName;
      })
      .catch((error) => {
        return res.status(400).json({
          error: true,
          code: 128,
          message: 'Erro: Não foi possível executar a solicitação!',
        });
      });

    await UserModel.updateOne({ _id: req.userId }, imageData, (error) => {
      if (error)
        return res.status(400).json({
          error: true,
          message: 'Erro: Imagem do perfil não editado com sucesso!',
        });
    });

    const oldUserImage = req.file.destination + '/' + req.userImageData;

    fs.access(oldUserImage, (error) => {
      if (!error) {
        fs.unlink(oldUserImage, (error) => {
          //
        });
      }
    });

    return res.json({
      error: false,
      message: 'Imagem do perfil editado com sucesso!',
    });
  }
}

module.exports = new PerfilImagemController();

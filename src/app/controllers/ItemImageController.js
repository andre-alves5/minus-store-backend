const ItemModel = require("../models/Item");
const fs = require("fs");

class ItemImageController {
  async update(req, res) {
    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: "Error: Selecione uma imagem válida JPEG ou PNG!",
      });
    }

    const imageData = {
      originalName: req.file.originalname,
      fileName: req.file.filename,
    };

    await ItemModel.findOne({ _id: req.params.id }, "_id fileName")
      .then((item) => {
        req.itemImageData = item.fileName;
      })
      .catch((error) => {
        return res.status(400).json({
          error: true,
          code: 128,
          message: "Erro: Não foi possível executar a solicitação!",
        });
      });

    await ItemModel.updateOne({ _id: req.params.id }, imageData, (error) => {
      if (error)
        return res.status(400).json({
          error: true,
          message: "Erro: Imagem do item não editada com sucesso!",
        });
    });

    const oldItemImage = req.file.destination + "/" + req.itemImageData;

    fs.access(oldItemImage, (error) => {
      if (!error) {
        fs.unlink(oldItemImage, (error) => {
          //
        });
      }
    });

    return res.json({
      error: false,
      message: "Imagem do item editada com sucesso!",
    });
  }
}

module.exports = new ItemImageController();

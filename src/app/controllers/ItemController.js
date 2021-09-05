const Yup = require("yup");
const ItemModel = require("../models/Item");

class ItemController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const { limit = 20 } = req.query;
    await ItemModel.paginate(
      {},
      {
        select: "_id title description color size price url",
        page,
        limit,
        sort: "title color size",
      }
    )
      .then((data) => {
        return res.json({
          error: false,
          items: data,
        });
      })
      .catch((error) => {
        return res.status(400).json({
          error: true,
          message: "Erro: Não foi possivel executar a solicitação",
        });
      });
  }

  async show(req, res) {
    ItemModel.findOne(
      { _id: req.params.id },
      "_id title description color size price url createdAt updatedAt"
    )
      .then((data) => {
        const {
          _id,
          title,
          description,
          color,
          size,
          price,
          url,
          createdAt,
          updatedAt,
        } = data;
        return res.json({
          error: false,
          item: {
            _id,
            title,
            description,
            color,
            size,
            price,
            url,
            createdAt,
            updatedAt,
          },
        });
      })
      .catch((error) => {
        return res.status(400).json({
          error: true,
          message: "Erro: Não foi possivel executar a solicitação",
        });
      });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      color: Yup.string().required(),
      size: Yup.string().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: true,
        message: "Error: Dados inválidos!",
      });
    }

    let data = req.body;

    const item = ItemModel.create(req.body, (error) => {
      if (error)
        return res.status(400).json({
          error: true,
          message: "Error: Item não foi cadastrado com sucesso!",
        });

      return res.status(200).json({
        error: false,
        message: "Item cadastrado com sucesso!",
        data: item,
      });
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      color: Yup.string().required(),
      size: Yup.string().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: true,
        message: "Erro: Dados do formulário inválido!",
      });
    }

    const { id } = req.params;

    const itemExists = await ItemModel.findOne({ _id: req.params.id });

    if (!itemExists) {
      return res.status(400).json({
        error: true,
        message: "Erro: Item não encontrado!",
      });
    }

    let data = req.body;

    await ItemModel.updateOne({ _id: req.params.id }, req.body, (error) => {
      if (error)
        return res.status(400).json({
          error: true,
          message: "Erro: Item não foi editado com sucesso!",
        });

      return res.json({
        error: false,
        message: "Item editado com sucesso!",
      });
    });
  }

  async delete(req, res) {
    const itemExists = await ItemModel.findOne({ _id: req.params.id });
    if (!itemExists) {
      return res.status(400).json({
        error: true,
        message: "Erro: Item não encontrado",
      });
    }

    await ItemModel.deleteOne({ _id: req.params.id }, (error) => {
      if (error)
        return res.status(400).json({
          error: true,
          message: "Error: Item não foi apagado com sucesso!",
        });
    });

    return res.json({
      error: false,
      message: "Item apagado com sucesso!",
    });
  }
}

module.exports = new ItemController();

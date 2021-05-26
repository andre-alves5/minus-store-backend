import * as Yup from 'yup';
import ItemModel from '../models/Item';
import config from '../../config/config';

class ItemController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const { limit = 20 } = req.query;
    await ItemModel.paginate(
      {},
      {
        select: '_id title description color size price fileName',
        page,
        limit,
        sort: '-createdAt',
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
          message: 'Erro: Não foi possivel executar a solicitação',
        });
      });
  }

  async show(req, res) {
    let url = '';

    ItemModel.findOne(
      { _id: req.params.id },
      '_id title description color size price createdAt updatedAt originalName fileName'
    )
      .then((data) => {
        if (data.fileName) {
          url = config.url + '/files/items/' + data.fileName;
        } else {
          url = config.url + '/files/items/placeholder.jpg';
        }

        const {
          _id,
          title,
          description,
          color,
          size,
          price,
          createdAt,
          updatedAt,
          originalName,
          fileName,
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
            createdAt,
            updatedAt,
            originalName,
            fileName,
            url: url,
          },
        });
      })
      .catch((error) => {
        return res.status(400).json({
          error: true,
          message: 'Erro: Não foi possivel executar a solicitação',
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
        message: 'Error: Dados inválidos!',
      });
    }

    let data = req.body;

    const item = ItemModel.create(data, (error) => {
      if (error)
        return res.status(400).json({
          error: true,
          message: 'Error: Item não foi cadastrado com sucesso!',
        });

      return res.status(200).json({
        error: false,
        message: 'Item cadastrado com sucesso!',
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
        message: 'Erro: Dados do formulário inválido!',
      });
    }

    const { id } = req.params;

    const itemExists = await ItemModel.findOne({ _id: id });

    if (!itemExists) {
      return res.status(400).json({
        error: true,
        message: 'Erro: Item não encontrado!',
      });
    }

    let data = req.body;

    await ItemModel.updateOne({ _id: req.params.id }, data, (error) => {
      if (error)
        return res.status(400).json({
          error: true,
          message: 'Erro: Item não foi editado com sucesso!',
        });

      return res.json({
        error: false,
        message: 'Item editado com sucesso!',
      });
    });
  }

  async delete(req, res) {
    const itemExists = await ItemModel.findOne({ _id: req.params.id });
    if (!itemExists) {
      return res.status(400).json({
        error: true,
        message: 'Erro: Usuário não encontrado',
      });
    }

    await ItemModel.deleteOne({ _id: req.params.id }, (error) => {
      if (error)
        return res.status(400).json({
          error: true,
          message: 'Error: Item não foi apagado com sucesso!',
        });
    });

    return res.json({
      error: false,
      message: 'Item apagado com sucesso!',
    });
  }
}

export default new ItemController();

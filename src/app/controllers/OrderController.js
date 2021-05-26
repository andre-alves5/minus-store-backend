import * as Yup from 'yup';
import OrderModel from '../models/Order';

class OrderController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const { limit = 40 } = req.query;
    await OrderModel.paginate(
      {},
      {
        select: '_id client status',
        page,
        limit,
        sort: '-createdAt',
      }
    )
      .then((data) => {
        return res.json({
          error: false,
          orders: data,
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
    OrderModel.findOne(
      { _id: req.params.id },
      '_id client phone address order volume status dueDate createdAt updatedAt'
    )
      .then((data) => {
        return res.json({
          error: false,
          order: data,
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
      client: Yup.string().required(),
      phone: Yup.string().required(),
      address: Yup.object().shape({
        street: Yup.string().required(),
        number: Yup.string().required(),
        complement: Yup.string(),
        neighborhood: Yup.string().required(),
        town: Yup.string().required(),
        state: Yup.string().required(),
        country: Yup.string().required(),
        zipcode: Yup.string().required(),
      }),
      order: Yup.array().of(
        Yup.object().shape({
          itemId: Yup.string().required(),
          title: Yup.string().required(),
          color: Yup.string().required(),
          size: Yup.string().required(),
          quantity: Yup.number().required(),
          price: Yup.number().required(),
          total: Yup.number().required(),
        })
      ),
      total: Yup.number().required(),
      volume: Yup.object()
        .shape({
          height: Yup.string().required(),
          width: Yup.string().required(),
          length: Yup.string().required(),
          weight: Yup.string().required(),
        })
        .required(),
      status: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: true,
        message: 'Error: Dados inválidos!',
      });
    }

    let data = req.body;

    const order = OrderModel.create(data, (error) => {
      if (error)
        return res.status(400).json({
          error: true,
          message: 'Error: Pedido não foi cadastrado com sucesso!',
        });

      return res.status(200).json({
        error: false,
        message: 'Pedido cadastrado com sucesso!',
        data: order,
      });
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      status: Yup.string(),
      dueDate: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: true,
        message: 'Erro: Dados do formulário inválido!',
      });
    }

    const orderExists = await OrderModel.findOne({ _id: req.params.id });

    if (!orderExists) {
      return res.status(400).json({
        error: true,
        message: 'Erro: Item não encontrado!',
      });
    }

    let data = req.body;

    await OrderModel.updateOne({ _id: req.params.id }, data, (error) => {
      if (error)
        return res.status(400).json({
          error: true,
          message: 'Erro: Pedido não foi editado com sucesso!',
        });

      return res.json({
        error: false,
        message: 'Pedido editado com sucesso!',
      });
    });
  }

  async delete(req, res) {
    const orderExists = await OrderModel.findOne({ _id: req.params.id });

    if (!orderExists) {
      return res.status(400).json({
        error: true,
        message: 'Erro: Pedido não encontrado',
      });
    }

    await OrderModel.deleteOne({ _id: req.params.id }, (error) => {
      if (error)
        return res.status(400).json({
          error: true,
          message: 'Error: Pedido não foi apagado com sucesso!',
        });
    });

    return res.json({
      error: false,
      message: 'Pedido apagado com sucesso!',
    });
  }
}

export default new OrderController();

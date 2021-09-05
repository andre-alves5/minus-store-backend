const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const OrderDetailsModel = new mongoose.Schema({
  itemId: {
    type: String,
    required: true,
  },
  itemTitle: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const OrderModel = new mongoose.Schema(
  {
    client: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      street: { type: String, required: true },
      number: { type: String, required: true },
      complement: { type: String },
      neighborhood: { type: String, required: true },
      town: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipcode: { type: String, required: true },
    },
    order: [OrderDetailsModel],
    total: {
      type: Number,
      required: true,
    },
    volume: {
      height: {
        type: String,
        required: true,
      },
      width: {
        type: String,
        required: true,
      },
      length: {
        type: String,
        required: true,
      },
      weight: {
        type: String,
        required: true,
      },
    },
    status: { type: String, required: true },
    dueDate: { type: String },
  },
  {
    timestamps: true,
  }
);
OrderModel.plugin(mongoosePaginate);

module.exports = mongoose.model('order', OrderModel);

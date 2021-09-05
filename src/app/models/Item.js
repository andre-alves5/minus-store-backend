const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ItemModel = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
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
    price: {
      type: Number,
      required: true,
    },
    originalName: {
      type: String,
    },
    fileName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
ItemModel.plugin(mongoosePaginate);

module.exports = mongoose.model('item', ItemModel);

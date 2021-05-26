import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

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

export default mongoose.model('item', ItemModel);

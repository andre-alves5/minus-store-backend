const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const UserModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    passwordRecovery: {
      type: String,
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
UserModel.plugin(mongoosePaginate);

module.exports = mongoose.model('user', UserModel);

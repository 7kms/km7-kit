// const Mongoose = require('mongoose');
// const ObjectId = Mongoose.Schema.Types.ObjectId;

// 资源集合
module.exports = app => {
  const mongoose = app.mongoose;
  const schema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        unique: true,
      },
      icon: {
        type: String,
        default: '',
      },
    },
    {
      collection: 'category',
      timestamps: true,
    },
  );
  schema.methods = {};
  return mongoose.model('Category', schema);
};

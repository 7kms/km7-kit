const Mongoose = require('mongoose');
const ObjectId = Mongoose.Schema.Types.ObjectId;

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
      category: {
        type: ObjectId,
        ref: 'Category',
        required: true,
      },
    },
    {
      collection: 'tag',
      timestamps: true,
    },
  );
  schema.methods = {};
  return mongoose.model('Tag', schema);
};

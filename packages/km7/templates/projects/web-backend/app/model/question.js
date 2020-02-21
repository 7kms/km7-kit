const Mongoose = require('mongoose');
const ObjectId = Mongoose.Schema.Types.ObjectId;

// 资源集合
module.exports = app => {
  const mongoose = app.mongoose;
  const schema = new mongoose.Schema(
    {
      title: {
        type: String,
        default: '',
        required: true,
      },
      keywords: [
        {
          type: String,
        },
      ],
      description: {
        type: String,
        default: '',
        required: true,
      },
      content: {
        type: String,
        default: '',
        required: true,
      },
      category: {
        type: ObjectId,
        ref: 'Category',
        required: true,
      },
      tags: [
        {
          type: ObjectId,
          ref: 'Tag',
        },
      ],
      admin: {
        type: ObjectId,
        ref: 'Admin',
      },
      viewCount: {
        type: Number,
        default: 0,
      },
      level: {
        type: Number,
        default: 0,
      },
    },
    {
      collection: 'question',
      timestamps: true,
    },
  );
  schema.methods = {};
  return mongoose.model('Question', schema);
};

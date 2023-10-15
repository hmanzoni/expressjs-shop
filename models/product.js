const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
});

module.exports = mongoose.model('Product', productSchema);

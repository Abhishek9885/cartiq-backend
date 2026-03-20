const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: String,
      required: true,
      enum: ['pc', 'gaming', 'study', 'fashion', 'kitchen'],
    },
    rating: { type: Number, min: 0, max: 5, default: 4.0 },
    reviews: { type: Number, default: 100 },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    features: [String],
    iqScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);


ProductSchema.pre('save', function (next) {
  this.iqScore = Math.round(
    (this.rating * Math.log(this.reviews + 1)) / this.price * 10000
  );
  next();
});

module.exports = mongoose.model('Product', ProductSchema);

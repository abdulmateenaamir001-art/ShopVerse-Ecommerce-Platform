import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  { timestamps: true }
);

const productSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: true, trim: true },
    image: { type: String, required: true }, 
    images: [{ type: String }], 
    brand: { type: String, required: true },
    category: { 
      type: String, 
      required: true,
      enum: [
        'Mens Fashion', 
        'Womens Fashion', 
        'Kids', 
        'Accessories', 
        'Perfumes', 
        'Games', 
        'Home Decor', 
        'Stationery',
        'Electronics'
      ] 
    },
    description: { type: String, required: true },
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0.0 },
    countInStock: { type: Number, required: true, default: 0 },

    // Variant attributes (optional)
    sizes: [{ type: String }],
    colors: [{ type: String }],
    capacity: [{ type: String }],

    featured: { type: Boolean, default: false } // <-- FIXED HERE!
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
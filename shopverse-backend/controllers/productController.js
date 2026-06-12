import Product from '../models/Product.js';

// @desc    Fetch all products (with search AND pagination)
// @route   GET /api/products
// @desc    Fetch all products (with advanced search, category filters, and pagination)
// @route   GET /api/products
export const getProducts = async (req, res) => {
  try {
    const pageSize = 8; // Number of products per page
    const page = Number(req.query.pageNumber) || 1;

    // 1. Build a dynamic built-in MongoDB query object
    let query = {};

    // Keyword Search Logic
    if (req.query.keyword) {
      query.title = { $regex: req.query.keyword, $options: 'i' };
    }

    // Category Filter Logic (Handles array of multiple categories passed from frontend)
    if (req.query.category) {
      const categoriesArray = req.query.category.split(',');
      query.category = { $in: categoriesArray };
    }

    // 2. Count the total number of products matching this specific filter matrix
    const count = await Product.countDocuments(query);

    // 3. Fetch only the specific 8 products for the current page
    const products = await Product.find(query)
      .sort({ createdAt: -1 }) // Shows newest items first
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    // 4. Send back the payload structure your frontend expects
    res.status(200).json({ 
      products, 
      page, 
      pages: Math.ceil(count / pageSize) 
    });
  } catch (error) {
    console.error("Error inside getProducts controller:", error);
    res.status(500).json({ message: 'Server Error fetching products' });
  }
};
// @desc    Fetch single product by ID
// @route   GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    res.status(404).json({ message: 'Invalid Product ID' });
  }
};

// @desc    Create a product (Admin Sample)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const product = new Product({
      title: 'Sample name',
      price: 0,
      user: req.user._id,
      image: '/images/sample.jpg',
      brand: 'Sample brand',
      category: 'Sample category',
      countInStock: 0,
      numReviews: 0,
      description: 'Sample description',
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating product' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { title, price, description, image, brand, category, countInStock } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.title = title;
      product.price = price;
      product.description = description;
      product.image = image;
      product.brand = brand;
      product.category = category;
      product.countInStock = countInStock;
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error updating product' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting product' });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'You already reviewed this product' });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added successfully!' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error creating review' });
  }
};

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
export const getTopProducts = async (req, res) => {
  try {
    // Sort by rating in descending order (-1), and only grab the top 3!
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching top products' });
  }
};
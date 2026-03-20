const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sort } = req.query;
    let query = {};

    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = {};
    if (sort === 'price_asc') sortOption.price = 1;
    else if (sort === 'price_desc') sortOption.price = -1;
    else if (sort === 'rating') sortOption.rating = -1;
    else sortOption.iqScore = -1;

    const products = await Product.find(query).sort(sortOption);
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, error: 'Product not found' });

    const similar = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    })
      .sort({ iqScore: -1 })
      .limit(4);

    res.json({ success: true, product, similar });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getCategories = async (req, res) => {
  const categories = [
    { id: 'pc', name: 'PC Setup', icon: '💻', description: 'Monitors, keyboards, mice & more' },
    { id: 'gaming', name: 'Gaming Setup', icon: '🎮', description: 'Controllers, headsets & gear' },
    { id: 'study', name: 'Study Setup', icon: '📚', description: 'Stationery, bags & accessories' },
    { id: 'fashion', name: 'Fashion', icon: '👗', description: 'Clothes, shoes & accessories' },
    { id: 'kitchen', name: 'Kitchen', icon: '🍳', description: 'Appliances & utensils' },
  ];
  res.json({ success: true, categories });
};

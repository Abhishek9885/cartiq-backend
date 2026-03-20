const Product = require('../models/Product');


const calcIQScore = (product) => {
  return Math.round(
    (product.rating * Math.log(product.reviews + 1)) / product.price * 10000
  );
};


const normalizeScore = (score) => Math.min(100, Math.max(0, Math.round(score / 8)));

exports.generateCart = async (req, res) => {
  try {
    const { budget, category } = req.body;

    if (!budget || !category) {
      return res.status(400).json({ success: false, error: 'Budget and category are required' });
    }
    if (Number(budget) < 100) {
      return res.status(400).json({ success: false, error: 'Minimum budget is ₹100' });
    }

    let products = await Product.find({
      category,
      price: { $lte: Number(budget) },
    });

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No products found for this category within your budget. Try increasing the budget.',
      });
    }

    products = products
      .map((p) => ({ ...p.toObject(), iqScore: calcIQScore(p) }))
      .sort((a, b) => b.iqScore - a.iqScore);

   
    let cart = [];
    let total = 0;

    for (const product of products) {
      if (total + product.price <= Number(budget)) {
        cart.push({ ...product, normalizedIQ: normalizeScore(product.iqScore) });
        total += product.price;
      }
    }

    const avgRawIQ =
      cart.length > 0
        ? cart.reduce((sum, p) => sum + p.iqScore, 0) / cart.length
        : 0;
    const cartIQ = normalizeScore(avgRawIQ);
    const avgMarketTotal = Math.round(total * 1.18); // assume 18% avg market premium
    const savings = avgMarketTotal - total;
    const remaining = Number(budget) - total;

    res.json({
      success: true,
      cart,
      stats: {
        total,
        budget: Number(budget),
        remaining,
        cartIQ,
        savings,
        avgMarketTotal,
        itemCount: cart.length,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

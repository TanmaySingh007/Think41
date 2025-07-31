const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const Database = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database
const db = new Database();

// Connect to database on startup
db.connect().catch(console.error);

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'E-commerce API is running!',
    endpoints: {
      products: '/api/products',
      productById: '/api/products/:id',
      productsByDepartment: '/api/products/department/:department'
    }
  });
});

// GET all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await db.getAllProducts();
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// GET product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await db.getProductById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

// GET products by department
app.get('/api/products/department/:department', async (req, res) => {
  try {
    const department = req.params.department;
    const products = await db.getProductsByDepartment(department);
    
    res.json({
      success: true,
      department: department,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products by department:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products by department',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API Documentation:`);
  console.log(`   GET /api/products - Get all products`);
  console.log(`   GET /api/products/:id - Get product by ID`);
  console.log(`   GET /api/products/department/:department - Get products by department`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  db.close();
  process.exit(0);
});

module.exports = app; 
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const Database = require('./database');

const app = express();
const PORT = process.env.PORT || 4000;

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
      productsByDepartment: '/api/products/department/:department',
      departments: '/api/departments',
      departmentById: '/api/departments/:id'
    }
  });
});

// GET all products with filtering
app.get('/api/products', async (req, res) => {
  try {
    const { 
      search, 
      department, 
      minPrice, 
      maxPrice, 
      limit, 
      offset,
      sortBy,
      sortOrder
    } = req.query;
    
    const filters = {
      search,
      department,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      limit: limit ? parseInt(limit) : 20,
      offset: offset ? parseInt(offset) : 0,
      sortBy: sortBy || 'name',
      sortOrder: sortOrder || 'ASC'
    };
    
    const products = await db.getProductsWithFilters(filters);
    
    res.json({
      success: true,
      count: products.length,
      filters,
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

// GET all departments
app.get('/api/departments', async (req, res) => {
  try {
    const { search, withCounts } = req.query;
    
    let departments;
    if (search) {
      departments = await db.searchDepartments(search);
    } else if (withCounts === 'true') {
      departments = await db.getDepartmentsWithProductCounts();
    } else {
      departments = await db.getAllDepartments();
    }
    
    res.json({
      success: true,
      count: departments.length,
      data: departments
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching departments',
      error: error.message
    });
  }
});

// GET department by ID
app.get('/api/departments/:id', async (req, res) => {
  try {
    const departmentId = parseInt(req.params.id);
    const { stats } = req.query;
    
    let department;
    if (stats === 'true') {
      department = await db.getDepartmentStats(departmentId);
    } else {
      department = await db.getDepartmentById(departmentId);
    }
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }
    
    res.json({
      success: true,
      data: department
    });
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching department',
      error: error.message
    });
  }
});

// POST create new department
app.post('/api/departments', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Department name is required'
      });
    }
    
    const department = await db.createDepartment(name, description);
    
    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: department
    });
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating department',
      error: error.message
    });
  }
});

// PUT update department
app.put('/api/departments/:id', async (req, res) => {
  try {
    const departmentId = parseInt(req.params.id);
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Department name is required'
      });
    }
    
    const department = await db.updateDepartment(departmentId, name, description);
    
    res.json({
      success: true,
      message: 'Department updated successfully',
      data: department
    });
  } catch (error) {
    console.error('Error updating department:', error);
    if (error.message === 'Department not found') {
      res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error updating department',
        error: error.message
      });
    }
  }
});

// DELETE department
app.delete('/api/departments/:id', async (req, res) => {
  try {
    const departmentId = parseInt(req.params.id);
    const result = await db.deleteDepartment(departmentId);
    
    res.json({
      success: true,
      message: 'Department deleted successfully',
      data: result
    });
  } catch (error) {
    console.error('Error deleting department:', error);
    if (error.message === 'Department not found') {
      res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    } else if (error.message.includes('associated products')) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error deleting department',
        error: error.message
      });
    }
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
  console.log(`   GET /api/products - Get all products (with filtering)`);
  console.log(`   GET /api/products/:id - Get product by ID`);
  console.log(`   GET /api/products/department/:department - Get products by department`);
  console.log(`   GET /api/departments - Get all departments`);
  console.log(`   GET /api/departments?withCounts=true - Get departments with product counts`);
  console.log(`   GET /api/departments?search=term - Search departments`);
  console.log(`   GET /api/departments/:id - Get department by ID`);
  console.log(`   GET /api/departments/:id?stats=true - Get department with statistics`);
  console.log(`   POST /api/departments - Create new department`);
  console.log(`   PUT /api/departments/:id - Update department`);
  console.log(`   DELETE /api/departments/:id - Delete department`);
});

module.exports = app; 
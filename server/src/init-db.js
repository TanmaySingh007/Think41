const Database = require('./database');

async function initializeDatabase() {
  const db = new Database();
  
  try {
    console.log('Starting database initialization with refactored schema...');
    
    // Connect to database
    await db.connect();
    
    // Create tables (departments and products with foreign key)
    await db.createTables();
    
    // Load data from CSV with refactored structure
    await db.loadDataFromCSV();
    
    // Verify data was loaded correctly
    const products = await db.getAllProducts();
    const departments = await db.getAllDepartments();
    
    console.log(`Database initialized successfully with ${products.length} products and ${departments.length} departments`);
    
    // Display sample data
    console.log('\nSample departments:');
    departments.forEach(dept => {
      console.log(`- ${dept.name} (ID: ${dept.id})`);
    });
    
    console.log('\nSample products:');
    products.slice(0, 3).forEach(product => {
      console.log(`- ${product.name} ($${product.price}) - ${product.department}`);
    });
    
    // Test department-specific queries
    const electronicsProducts = await db.getProductsByDepartment('Electronics');
    console.log(`\nElectronics department has ${electronicsProducts.length} products`);
    
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    db.close();
  }
}

// Run initialization if this file is executed directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase; 
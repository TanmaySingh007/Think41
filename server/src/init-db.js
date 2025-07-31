const Database = require('./database');

async function initializeDatabase() {
  const db = new Database();
  
  try {
    console.log('Starting database initialization...');
    
    // Connect to database
    await db.connect();
    
    // Create tables
    await db.createTables();
    
    // Load data from CSV
    await db.loadDataFromCSV();
    
    // Verify data was loaded
    const products = await db.getAllProducts();
    console.log(`Database initialized successfully with ${products.length} products`);
    
    // Display sample data
    console.log('\nSample products:');
    products.slice(0, 3).forEach(product => {
      console.log(`- ${product.name} ($${product.price}) - ${product.department}`);
    });
    
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
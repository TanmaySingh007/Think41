const Database = require('./src/database');

async function testDatabase() {
  const db = new Database();
  
  try {
    console.log('Testing database connection and data...');
    
    // Connect to database
    await db.connect();
    
    // Test getting all products
    const products = await db.getAllProducts();
    console.log(`\nTotal products in database: ${products.length}`);
    
    // Test getting products by department
    const electronics = await db.getProductsByDepartment('Electronics');
    console.log(`\nElectronics products: ${electronics.length}`);
    electronics.forEach(product => {
      console.log(`- ${product.name} ($${product.price})`);
    });
    
    // Test getting a specific product
    const product = await db.getProductById(1);
    if (product) {
      console.log(`\nProduct ID 1: ${product.name} - $${product.price} - ${product.department}`);
    }
    
    console.log('\nDatabase test completed successfully!');
    
  } catch (error) {
    console.error('Database test failed:', error);
  } finally {
    db.close();
  }
}

testDatabase(); 
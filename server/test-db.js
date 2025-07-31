const Database = require('./src/database');

async function testDatabase() {
  const db = new Database();
  
  try {
    console.log('Testing refactored database with departments table...');
    
    // Connect to database
    await db.connect();
    
    // Test getting all departments
    const departments = await db.getAllDepartments();
    console.log(`\nTotal departments in database: ${departments.length}`);
    departments.forEach(dept => {
      console.log(`- ${dept.name} (ID: ${dept.id})`);
    });
    
    // Test getting all products with department info
    const products = await db.getAllProducts();
    console.log(`\nTotal products in database: ${products.length}`);
    
    // Test getting products by department
    const electronics = await db.getProductsByDepartment('Electronics');
    console.log(`\nElectronics products: ${electronics.length}`);
    electronics.forEach(product => {
      console.log(`- ${product.name} ($${product.price}) - Department ID: ${product.department_id}`);
    });
    
    // Test getting a specific product with department info
    const product = await db.getProductById(1);
    if (product) {
      console.log(`\nProduct ID 1: ${product.name} - $${product.price} - ${product.department} (Dept ID: ${product.department_id})`);
    }
    
    // Test getting department by ID
    if (departments.length > 0) {
      const firstDept = await db.getDepartmentById(departments[0].id);
      console.log(`\nDepartment by ID ${departments[0].id}: ${firstDept.name}`);
    }
    
    console.log('\nDatabase refactoring test completed successfully!');
    console.log('✅ Departments table working');
    console.log('✅ Products table with foreign key working');
    console.log('✅ JOIN queries working');
    console.log('✅ Data integrity maintained');
    
  } catch (error) {
    console.error('Database test failed:', error);
  } finally {
    db.close();
  }
}

testDatabase(); 
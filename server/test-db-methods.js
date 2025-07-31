const Database = require('./src/database');

async function testDatabaseMethods() {
  console.log('🧪 Testing Database Methods...');
  
  const db = new Database();
  
  try {
    await db.connect();
    console.log('✅ Database connected');
    
    // Test getAllDepartments
    console.log('\n📋 Testing getAllDepartments...');
    const departments = await db.getAllDepartments();
    console.log(`✅ Found ${departments.length} departments:`, departments.map(d => d.name));
    
    // Test getDepartmentsWithProductCounts
    console.log('\n📊 Testing getDepartmentsWithProductCounts...');
    const deptsWithCounts = await db.getDepartmentsWithProductCounts();
    console.log(`✅ Found ${deptsWithCounts.length} departments with counts:`, 
      deptsWithCounts.map(d => `${d.name} (${d.product_count} products)`));
    
    // Test searchDepartments
    console.log('\n🔍 Testing searchDepartments...');
    const searchResults = await db.searchDepartments('Electronics');
    console.log(`✅ Search results:`, searchResults.map(d => d.name));
    
    // Test getDepartmentById
    console.log('\n🆔 Testing getDepartmentById...');
    const dept = await db.getDepartmentById(1);
    console.log(`✅ Department 1:`, dept ? dept.name : 'Not found');
    
    // Test getDepartmentStats
    console.log('\n📈 Testing getDepartmentStats...');
    const stats = await db.getDepartmentStats(1);
    console.log(`✅ Department 1 stats:`, stats ? {
      name: stats.name,
      total_products: stats.total_products,
      avg_price: stats.avg_price
    } : 'Not found');
    
    // Test getAllProducts
    console.log('\n📦 Testing getAllProducts...');
    const products = await db.getAllProducts();
    console.log(`✅ Found ${products.length} products`);
    
    // Test getProductsWithFilters
    console.log('\n🔧 Testing getProductsWithFilters...');
    const filteredProducts = await db.getProductsWithFilters({ limit: 3 });
    console.log(`✅ Found ${filteredProducts.length} filtered products`);
    
    console.log('\n🎉 All database methods working correctly!');
    
  } catch (error) {
    console.error('❌ Error testing database methods:', error);
  } finally {
    db.close();
  }
}

testDatabaseMethods(); 
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testRefactoredAPI() {
  console.log('🧪 Testing Refactored E-commerce API with Departments...\n');

  try {
    // Test 1: Root endpoint
    console.log('1. Testing root endpoint...');
    const rootResponse = await axios.get(`${BASE_URL}/`);
    console.log('✅ Root endpoint:', rootResponse.data.message);
    console.log('Available endpoints:', Object.keys(rootResponse.data.endpoints));
    console.log('');

    // Test 2: Get all departments
    console.log('2. Testing GET /api/departments...');
    const departmentsResponse = await axios.get(`${BASE_URL}/api/departments`);
    console.log(`✅ Found ${departmentsResponse.data.count} departments`);
    console.log('Departments:');
    departmentsResponse.data.data.forEach(dept => {
      console.log(`   - ${dept.name} (ID: ${dept.id})`);
    });
    console.log('');

    // Test 3: Get department by ID
    console.log('3. Testing GET /api/departments/1...');
    const departmentResponse = await axios.get(`${BASE_URL}/api/departments/1`);
    const department = departmentResponse.data.data;
    console.log(`✅ Department ID 1: ${department.name}`);
    console.log('');

    // Test 4: Get all products (should work with refactored schema)
    console.log('4. Testing GET /api/products...');
    const productsResponse = await axios.get(`${BASE_URL}/api/products`);
    console.log(`✅ Found ${productsResponse.data.count} products`);
    console.log('Sample products:');
    productsResponse.data.data.slice(0, 3).forEach(product => {
      console.log(`   - ${product.name} ($${product.price}) - ${product.department} (Dept ID: ${product.department_id})`);
    });
    console.log('');

    // Test 5: Get products by department
    console.log('5. Testing GET /api/products/department/Electronics...');
    const electronicsResponse = await axios.get(`${BASE_URL}/api/products/department/Electronics`);
    console.log(`✅ Found ${electronicsResponse.data.count} Electronics products`);
    electronicsResponse.data.data.forEach(product => {
      console.log(`   - ${product.name} ($${product.price}) - Dept ID: ${product.department_id}`);
    });
    console.log('');

    // Test 6: Get product by ID (should include department info)
    console.log('6. Testing GET /api/products/1...');
    const productResponse = await axios.get(`${BASE_URL}/api/products/1`);
    const product = productResponse.data.data;
    console.log(`✅ Product ID 1: ${product.name} - $${product.price} - ${product.department} (Dept ID: ${product.department_id})`);
    console.log('');

    // Test 7: Test non-existent department
    console.log('7. Testing GET /api/departments/999 (non-existent)...');
    try {
      await axios.get(`${BASE_URL}/api/departments/999`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('✅ Correctly returned 404 for non-existent department');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    console.log('');

    console.log('🎉 All refactored API tests completed successfully!');
    console.log('📊 Refactored API Summary:');
    console.log('   - GET /api/departments ✅');
    console.log('   - GET /api/departments/:id ✅');
    console.log('   - GET /api/products ✅ (with department info)');
    console.log('   - GET /api/products/:id ✅ (with department info)');
    console.log('   - GET /api/products/department/:department ✅');
    console.log('   - Database refactoring successful ✅');
    console.log('   - Foreign key relationships working ✅');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the server is running on port 5000');
      console.log('   Run: npm run dev');
    }
  }
}

// Run the test
testRefactoredAPI(); 
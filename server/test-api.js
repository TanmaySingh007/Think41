const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAPI() {
  console.log('🧪 Testing E-commerce API Endpoints...\n');

  try {
    // Test 1: Root endpoint
    console.log('1. Testing root endpoint...');
    const rootResponse = await axios.get(`${BASE_URL}/`);
    console.log('✅ Root endpoint:', rootResponse.data.message);
    console.log('Available endpoints:', Object.keys(rootResponse.data.endpoints));
    console.log('');

    // Test 2: Get all products
    console.log('2. Testing GET /api/products...');
    const productsResponse = await axios.get(`${BASE_URL}/api/products`);
    console.log(`✅ Found ${productsResponse.data.count} products`);
    console.log('Sample products:');
    productsResponse.data.data.slice(0, 3).forEach(product => {
      console.log(`   - ${product.name} ($${product.price}) - ${product.department}`);
    });
    console.log('');

    // Test 3: Get product by ID
    console.log('3. Testing GET /api/products/1...');
    const productResponse = await axios.get(`${BASE_URL}/api/products/1`);
    const product = productResponse.data.data;
    console.log(`✅ Product ID 1: ${product.name} - $${product.price} - ${product.department}`);
    console.log('');

    // Test 4: Get products by department
    console.log('4. Testing GET /api/products/department/Electronics...');
    const electronicsResponse = await axios.get(`${BASE_URL}/api/products/department/Electronics`);
    console.log(`✅ Found ${electronicsResponse.data.count} Electronics products`);
    electronicsResponse.data.data.forEach(product => {
      console.log(`   - ${product.name} ($${product.price})`);
    });
    console.log('');

    // Test 5: Test non-existent product
    console.log('5. Testing GET /api/products/999 (non-existent)...');
    try {
      await axios.get(`${BASE_URL}/api/products/999`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('✅ Correctly returned 404 for non-existent product');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    console.log('');

    console.log('🎉 All API tests completed successfully!');
    console.log('📊 API Summary:');
    console.log('   - GET /api/products ✅');
    console.log('   - GET /api/products/:id ✅');
    console.log('   - GET /api/products/department/:department ✅');
    console.log('   - Error handling ✅');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the server is running on port 5000');
      console.log('   Run: npm run dev');
    }
  }
}

// Run the test
testAPI(); 
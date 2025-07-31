const axios = require('axios');

const BASE_URL = 'http://localhost:3002/api';

async function testSimpleAPI() {
  console.log('🧪 Testing Simple API Endpoints...');
  
  try {
    // Test basic departments endpoint
    console.log('\n📋 Testing GET /api/departments...');
    const response = await axios.get(`${BASE_URL}/departments`, {
      timeout: 5000,
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('✅ GET /api/departments - SUCCESS');
    console.log(`   Status: ${response.status}`);
    console.log(`   Data: ${JSON.stringify(response.data, null, 2)}`);
    
    // Test departments with counts
    console.log('\n📊 Testing GET /api/departments?withCounts=true...');
    const response2 = await axios.get(`${BASE_URL}/departments?withCounts=true`, {
      timeout: 5000,
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('✅ GET /api/departments?withCounts=true - SUCCESS');
    console.log(`   Status: ${response2.status}`);
    console.log(`   Data: ${JSON.stringify(response2.data, null, 2)}`);
    
    // Test products endpoint
    console.log('\n📦 Testing GET /api/products...');
    const response3 = await axios.get(`${BASE_URL}/products`, {
      timeout: 5000,
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('✅ GET /api/products - SUCCESS');
    console.log(`   Status: ${response3.status}`);
    console.log(`   Data: ${JSON.stringify(response3.data, null, 2)}`);
    
    console.log('\n🎉 All basic API tests passed!');
    
  } catch (error) {
    console.error('❌ API Test Failed:');
    console.error(`   Error: ${error.message}`);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
}

testSimpleAPI(); 
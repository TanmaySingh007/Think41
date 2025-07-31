const axios = require('axios');

async function quickTest() {
  console.log('🧪 Quick API Test...');
  
  try {
    const response = await axios.get('http://localhost:4000/api/departments', {
      timeout: 3000
    });
    
    console.log('✅ SUCCESS!');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('❌ FAILED!');
    console.log('Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('Server is not running or not accessible');
    }
  }
}

quickTest(); 
const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api';

// Test configuration
const testConfig = {
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
};

// Test utilities
const logTest = (testName, result) => {
  const status = result ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} ${testName}`);
  return result;
};

const logError = (testName, error) => {
  console.log(`❌ FAIL ${testName}`);
  console.log(`   Error: ${error.message}`);
  if (error.response) {
    console.log(`   Status: ${error.response.status}`);
    console.log(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
  }
};

// Test functions
const testGetAllDepartments = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/departments`, testConfig);
    const { success, count, data } = response.data;
    
    return logTest(
      'GET /api/departments - Get all departments',
      success && Array.isArray(data) && count >= 0
    );
  } catch (error) {
    logError('GET /api/departments - Get all departments', error);
    return false;
  }
};

const testGetDepartmentsWithCounts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/departments?withCounts=true`, testConfig);
    const { success, count, data } = response.data;
    
    const hasProductCount = data.every(dept => 'product_count' in dept);
    
    return logTest(
      'GET /api/departments?withCounts=true - Get departments with product counts',
      success && Array.isArray(data) && hasProductCount
    );
  } catch (error) {
    logError('GET /api/departments?withCounts=true - Get departments with product counts', error);
    return false;
  }
};

const testSearchDepartments = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/departments?search=Electronics`, testConfig);
    const { success, count, data } = response.data;
    
    return logTest(
      'GET /api/departments?search=Electronics - Search departments',
      success && Array.isArray(data)
    );
  } catch (error) {
    logError('GET /api/departments?search=Electronics - Search departments', error);
    return false;
  }
};

const testGetDepartmentById = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/departments/1`, testConfig);
    const { success, data } = response.data;
    
    return logTest(
      'GET /api/departments/1 - Get department by ID',
      success && data && data.id === 1
    );
  } catch (error) {
    logError('GET /api/departments/1 - Get department by ID', error);
    return false;
  }
};

const testGetDepartmentStats = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/departments/1?stats=true`, testConfig);
    const { success, data } = response.data;
    
    const hasStats = data && 'total_products' in data && 'avg_price' in data;
    
    return logTest(
      'GET /api/departments/1?stats=true - Get department with statistics',
      success && hasStats
    );
  } catch (error) {
    logError('GET /api/departments/1?stats=true - Get department with statistics', error);
    return false;
  }
};

const testCreateDepartment = async () => {
  try {
    const newDepartment = {
      name: 'Test Department',
      description: 'A test department for API testing'
    };
    
    const response = await axios.post(`${BASE_URL}/departments`, newDepartment, testConfig);
    const { success, data } = response.data;
    
    return logTest(
      'POST /api/departments - Create new department',
      success && data && data.name === newDepartment.name
    );
  } catch (error) {
    logError('POST /api/departments - Create new department', error);
    return false;
  }
};

const testUpdateDepartment = async () => {
  try {
    const updateData = {
      name: 'Updated Test Department',
      description: 'Updated description'
    };
    
    const response = await axios.put(`${BASE_URL}/departments/1`, updateData, testConfig);
    const { success, data } = response.data;
    
    return logTest(
      'PUT /api/departments/1 - Update department',
      success && data && data.name === updateData.name
    );
  } catch (error) {
    logError('PUT /api/departments/1 - Update department', error);
    return false;
  }
};

const testEnhancedProductsEndpoint = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/products?limit=5&sortBy=name&sortOrder=ASC`, testConfig);
    const { success, count, data, filters } = response.data;
    
    return logTest(
      'GET /api/products with filtering - Enhanced products endpoint',
      success && Array.isArray(data) && filters
    );
  } catch (error) {
    logError('GET /api/products with filtering - Enhanced products endpoint', error);
    return false;
  }
};

const testProductsWithDepartmentFilter = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/products?department=Electronics&limit=3`, testConfig);
    const { success, count, data, filters } = response.data;
    
    const allElectronics = data.every(product => product.department === 'Electronics');
    
    return logTest(
      'GET /api/products?department=Electronics - Products with department filter',
      success && allElectronics
    );
  } catch (error) {
    logError('GET /api/products?department=Electronics - Products with department filter', error);
    return false;
  }
};

const testProductsWithSearch = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/products?search=headphones&limit=5`, testConfig);
    const { success, count, data, filters } = response.data;
    
    return logTest(
      'GET /api/products?search=headphones - Products with search',
      success && Array.isArray(data)
    );
  } catch (error) {
    logError('GET /api/products?search=headphones - Products with search', error);
    return false;
  }
};

// Main test runner
const runAllTests = async () => {
  console.log('🧪 Testing Enhanced Departments API (Milestone 5)');
  console.log('=' .repeat(60));
  
  const tests = [
    testGetAllDepartments,
    testGetDepartmentsWithCounts,
    testSearchDepartments,
    testGetDepartmentById,
    testGetDepartmentStats,
    testCreateDepartment,
    testUpdateDepartment,
    testEnhancedProductsEndpoint,
    testProductsWithDepartmentFilter,
    testProductsWithSearch
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    const result = await test();
    if (result) passed++;
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('=' .repeat(60));
  console.log(`📊 Test Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Milestone 5 Departments API is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the server and database.');
  }
};

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  runAllTests,
  testGetAllDepartments,
  testGetDepartmentsWithCounts,
  testSearchDepartments,
  testGetDepartmentById,
  testGetDepartmentStats,
  testCreateDepartment,
  testUpdateDepartment,
  testEnhancedProductsEndpoint,
  testProductsWithDepartmentFilter,
  testProductsWithSearch
}; 
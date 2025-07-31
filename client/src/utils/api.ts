import axios from 'axios';
import { Product, ProductsResponse, ProductResponse, DepartmentProductsResponse } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productApi = {
  // Get all products
  getAllProducts: async (): Promise<ProductsResponse> => {
    const response = await api.get('/products');
    return response.data;
  },

  // Get product by ID
  getProductById: async (id: number): Promise<ProductResponse> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get products by department
  getProductsByDepartment: async (department: string): Promise<DepartmentProductsResponse> => {
    const response = await api.get(`/products/department/${encodeURIComponent(department)}`);
    return response.data;
  },
};

export default api; 
import { Product, Department, ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

// Product API functions
export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const fetchProductById = async (id: number): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return response.json();
};

export const fetchProductsByDepartment = async (department: string): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products/department/${encodeURIComponent(department)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products by department');
  }
  return response.json();
};

// Department API functions
export const fetchDepartments = async (): Promise<Department[]> => {
  const response = await fetch(`${API_BASE_URL}/departments`);
  if (!response.ok) {
    throw new Error('Failed to fetch departments');
  }
  return response.json();
};

export const fetchDepartmentById = async (id: number): Promise<Department> => {
  const response = await fetch(`${API_BASE_URL}/departments/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch department');
  }
  return response.json();
};

// Search and filter functions
export const searchProducts = async (query: string, department?: string): Promise<Product[]> => {
  let url = `${API_BASE_URL}/products`;
  const params = new URLSearchParams();
  
  if (query) {
    params.append('search', query);
  }
  
  if (department) {
    params.append('department', department);
  }
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to search products');
  }
  return response.json();
}; 
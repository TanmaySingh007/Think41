export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  department: string;
  image_url: string;
  stock_quantity: number;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
  message?: string;
  error?: string;
}

export interface ProductsResponse extends ApiResponse<Product[]> {
  count: number;
}

export interface ProductResponse extends ApiResponse<Product> {}

export interface DepartmentProductsResponse extends ApiResponse<Product[]> {
  department: string;
  count: number;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
} 
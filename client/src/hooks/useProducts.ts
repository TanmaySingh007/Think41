import { useState, useEffect } from 'react';
import { Product, Department, FilterState } from '../types';
import { 
  fetchProducts, 
  fetchProductById, 
  fetchProductsByDepartment, 
  fetchDepartments,
  searchProducts 
} from '../utils/api';

// Hook for fetching all products
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return { products, loading, error };
};

// Hook for fetching a single product
export const useProductById = (id: number) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(id);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  return { product, loading, error };
};

// Hook for fetching departments
export const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setLoading(true);
        const data = await fetchDepartments();
        setDepartments(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch departments');
      } finally {
        setLoading(false);
      }
    };

    loadDepartments();
  }, []);

  return { departments, loading, error };
};

// Hook for filtered products with search and department filtering
export const useFilteredProducts = (filters: FilterState) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFilteredProducts = async () => {
      try {
        setLoading(true);
        let data: Product[];

        if (filters.searchQuery || filters.selectedDepartment) {
          data = await searchProducts(filters.searchQuery, filters.selectedDepartment || undefined);
        } else {
          data = await fetchProducts();
        }

        // Apply sorting
        const sortedData = [...data].sort((a, b) => {
          let aValue: any, bValue: any;

          switch (filters.sortBy) {
            case 'name':
              aValue = a.name.toLowerCase();
              bValue = b.name.toLowerCase();
              break;
            case 'price':
              aValue = a.price;
              bValue = b.price;
              break;
            case 'department':
              aValue = a.department.toLowerCase();
              bValue = b.department.toLowerCase();
              break;
            default:
              return 0;
          }

          if (filters.sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });

        setProducts(sortedData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    loadFilteredProducts();
  }, [filters]);

  return { products, loading, error };
}; 
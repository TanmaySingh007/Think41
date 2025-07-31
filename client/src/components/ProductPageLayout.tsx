import React from 'react';
import { Product, FilterState } from '../types';
import ProductList from './ProductList';
import SearchAndFilter from './SearchAndFilter';
import MobileFilterToggle from './MobileFilterToggle';
import { Department } from '../types';

interface ProductPageLayoutProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  departments: Department[];
  departmentsLoading: boolean;
  onProductClick: (product: Product) => void;
}

const ProductPageLayout: React.FC<ProductPageLayoutProps> = ({
  products,
  loading,
  error,
  filters,
  onFiltersChange,
  departments,
  departmentsLoading,
  onProductClick
}) => {
  const activeFiltersCount = (filters.searchQuery ? 1 : 0) + (filters.selectedDepartment ? 1 : 0);

  return (
    <div>
      {/* Mobile Filter Toggle */}
      <MobileFilterToggle
        filters={filters}
        onFiltersChange={onFiltersChange}
        departments={departments}
        departmentsLoading={departmentsLoading}
        activeFiltersCount={activeFiltersCount}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar - Hidden on mobile */}
        <div className="hidden lg:block lg:w-80 flex-shrink-0">
          <div className="sticky top-8">
            <SearchAndFilter
              filters={filters}
              onFiltersChange={onFiltersChange}
              departments={departments}
              departmentsLoading={departmentsLoading}
            />
          </div>
        </div>

        {/* Products Section */}
        <div className="flex-1">
          {/* Results Summary */}
          {!loading && !error && (
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {products.length} product{products.length !== 1 ? 's' : ''} found
                  {filters.selectedDepartment && (
                    <span className="ml-2">
                      in <span className="font-medium">{filters.selectedDepartment}</span>
                    </span>
                  )}
                  {filters.searchQuery && (
                    <span className="ml-2">
                      matching "<span className="font-medium">{filters.searchQuery}</span>"
                    </span>
                  )}
                </div>
                {filters.sortBy !== 'name' && (
                  <div className="text-sm text-gray-500">
                    Sorted by {filters.sortBy} ({filters.sortOrder})
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Products Grid */}
          <ProductList
            products={products}
            loading={loading}
            error={error}
            onProductClick={onProductClick}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPageLayout; 
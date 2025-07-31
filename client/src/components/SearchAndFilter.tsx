import React from 'react';
import { FilterState } from '../types';
import DepartmentFilter from './DepartmentFilter';
import { Department } from '../types';

interface SearchAndFilterProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  departments: Department[];
  departmentsLoading: boolean;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  filters,
  onFiltersChange,
  departments,
  departmentsLoading
}) => {
  const handleSearchChange = (searchQuery: string) => {
    onFiltersChange({
      ...filters,
      searchQuery
    });
  };

  const handleDepartmentChange = (selectedDepartment: string | null) => {
    onFiltersChange({
      ...filters,
      selectedDepartment
    });
  };

  const handleSortChange = (sortBy: 'name' | 'price' | 'department') => {
    onFiltersChange({
      ...filters,
      sortBy
    });
  };

  const handleSortOrderChange = (sortOrder: 'asc' | 'desc') => {
    onFiltersChange({
      ...filters,
      sortOrder
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      selectedDepartment: null,
      searchQuery: '',
      sortBy: 'name',
      sortOrder: 'asc'
    });
  };

  const hasActiveFilters = filters.searchQuery || filters.selectedDepartment;

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={filters.searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          
          {/* Sort Controls */}
          <div className="flex items-center space-x-2">
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value as 'name' | 'price' | 'department')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="department">Sort by Department</option>
            </select>
            
            <button
              onClick={() => handleSortOrderChange(filters.sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              title={filters.sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
            >
              {filters.sortOrder === 'asc' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>
          </div>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Department Filter */}
      <DepartmentFilter
        departments={departments}
        selectedDepartment={filters.selectedDepartment}
        onDepartmentChange={handleDepartmentChange}
        loading={departmentsLoading}
      />
    </div>
  );
};

export default SearchAndFilter; 
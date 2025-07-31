import React, { useState } from 'react';
import { FilterState } from '../types';
import SearchAndFilter from './SearchAndFilter';
import { Department } from '../types';

interface MobileFilterToggleProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  departments: Department[];
  departmentsLoading: boolean;
  activeFiltersCount: number;
}

const MobileFilterToggle: React.FC<MobileFilterToggleProps> = ({
  filters,
  onFiltersChange,
  departments,
  departmentsLoading,
  activeFiltersCount
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFilters = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="lg:hidden">
      {/* Mobile Filter Toggle Button */}
      <div className="mb-4">
        <button
          onClick={toggleFilters}
          className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border"
        >
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
            <span className="font-medium text-gray-900">Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <svg 
            className={`w-5 h-5 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Mobile Filter Panel */}
      {isOpen && (
        <div className="mb-6 bg-white rounded-lg shadow-sm border p-4">
          <SearchAndFilter
            filters={filters}
            onFiltersChange={onFiltersChange}
            departments={departments}
            departmentsLoading={departmentsLoading}
          />
        </div>
      )}
    </div>
  );
};

export default MobileFilterToggle; 
import React from 'react';
import { Department } from '../types';

interface DepartmentFilterProps {
  departments: Department[];
  selectedDepartment: string | null;
  onDepartmentChange: (department: string | null) => void;
  loading?: boolean;
}

const DepartmentFilter: React.FC<DepartmentFilterProps> = ({
  departments,
  selectedDepartment,
  onDepartmentChange,
  loading = false
}) => {
  const totalProducts = departments.reduce((total, dept) => total + (dept.product_count || 0), 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Filter by Department
        </h3>
        {selectedDepartment && (
          <button
            onClick={() => onDepartmentChange(null)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear Filter
          </button>
        )}
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading departments...</span>
        </div>
      ) : (
        <div className="space-y-2">
          {/* All Departments Option */}
          <label className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg transition-colors ${
            selectedDepartment === null 
              ? 'bg-blue-50 border border-blue-200' 
              : 'hover:bg-gray-50 border border-transparent'
          }`}>
            <input
              type="radio"
              name="department"
              value=""
              checked={selectedDepartment === null}
              onChange={() => onDepartmentChange(null)}
              className="text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <span className={`font-medium ${
                selectedDepartment === null ? 'text-blue-900' : 'text-gray-700'
              }`}>
                All Departments
              </span>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">
                  Browse all products
                </span>
                <span className="text-gray-500 text-sm font-medium">
                  {totalProducts} products
                </span>
              </div>
            </div>
          </label>

          {/* Individual Departments */}
          {departments.map((department) => (
            <label
              key={department.id}
              className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg transition-colors ${
                selectedDepartment === department.name 
                  ? 'bg-blue-50 border border-blue-200' 
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <input
                type="radio"
                name="department"
                value={department.name}
                checked={selectedDepartment === department.name}
                onChange={() => onDepartmentChange(department.name)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className={`font-medium ${
                  selectedDepartment === department.name ? 'text-blue-900' : 'text-gray-700'
                }`}>
                  {department.name}
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">
                    {department.description || 'Products in this department'}
                  </span>
                  <span className="text-gray-500 text-sm font-medium">
                    {department.product_count || 0} products
                  </span>
                </div>
              </div>
            </label>
          ))}
        </div>
      )}

      {!loading && departments.length === 0 && (
        <div className="text-center py-4">
          <div className="text-gray-400 text-4xl mb-2">🏢</div>
          <p className="text-gray-600">No departments available</p>
        </div>
      )}
    </div>
  );
};

export default DepartmentFilter; 
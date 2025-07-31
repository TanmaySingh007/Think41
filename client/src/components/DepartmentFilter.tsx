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
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Filter by Department
      </h3>
      
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-2">
          {/* All Departments Option */}
          <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
            <input
              type="radio"
              name="department"
              value=""
              checked={selectedDepartment === null}
              onChange={() => onDepartmentChange(null)}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700 font-medium">All Departments</span>
            <span className="text-gray-500 text-sm">
              ({departments.reduce((total, dept) => total + (dept.product_count || 0), 0)} products)
            </span>
          </label>

          {/* Individual Departments */}
          {departments.map((department) => (
            <label
              key={department.id}
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
            >
              <input
                type="radio"
                name="department"
                value={department.name}
                checked={selectedDepartment === department.name}
                onChange={() => onDepartmentChange(department.name)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">{department.name}</span>
              <span className="text-gray-500 text-sm">
                ({department.product_count || 0} products)
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default DepartmentFilter; 
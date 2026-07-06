import React from 'react';
import Button from '../Button/Button';
import { Filter as FilterIcon, X } from 'lucide-react';

const Filter = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex items-center mb-3 text-gray-700 font-medium">
        <FilterIcon size={18} className="mr-2" />
        Filters
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filters.status || ''}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm py-2 px-3 border"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Employee</label>
          <select
            value={filters.assignedEmployeeId || ''}
            onChange={(e) => onFilterChange('assignedEmployeeId', e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm py-2 px-3 border"
          >
            <option value="">All Employees</option>
            {/* Ideally this comes from props or API, hardcoding for now or using a generic employee list */}
            <option value="1">Alice Johnson</option>
            <option value="2">Bob Williams</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <div className="flex space-x-2">
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => onFilterChange('startDate', e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm py-2 px-3 border"
            />
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => onFilterChange('endDate', e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm py-2 px-3 border"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button variant="outline" onClick={onReset} className="flex items-center text-sm">
          <X size={16} className="mr-1" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default Filter;

import React from 'react';
import Button from '../Button/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage, 
  onItemsPerPageChange 
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
      <div className="flex items-center mb-4 sm:mb-0">
        <span className="text-sm text-gray-700 mr-2">Rows per page:</span>
        <select 
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="border border-gray-300 rounded-md text-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-2 py-1 flex items-center"
        >
          <ChevronLeft size={16} className="mr-1" />
          Previous
        </Button>
        <span className="text-sm text-gray-700 px-4">
          Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
        </span>
        <Button 
          variant="outline" 
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-2 py-1 flex items-center"
        >
          Next
          <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;

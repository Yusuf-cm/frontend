// src/components/PaginationControls.jsx
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function PaginationControls({
  hasNextPage,
  hasPrevPage,
  totalPages,
  path,
  searchQuery,
  category,
  sort,
  filters
}) {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page') || 1);
  
  const createPageUrl = (page) => {
    const params = new URLSearchParams();
    
    // Preserve existing parameters
    if (searchQuery) params.set('search', searchQuery);
    if (category) params.set('category', category);
    if (sort) params.set('sort', sort);
    
    // Add filters
    Object.entries(filters).forEach(([key, values]) => {
      values.forEach(value => params.append(`filter_${key}`, value));
    });
    
    // Set page
    params.set('page', page);
    
    return `${path}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-200 pt-8">
      <div className="text-sm text-gray-700">
        Page <span className="font-medium">{currentPage}</span> of{' '}
        <span className="font-medium">{totalPages}</span>
      </div>
      
      <div className="flex space-x-2">
        {hasPrevPage ? (
          <Link
            href={createPageUrl(currentPage - 1)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <FiChevronLeft className="h-5 w-5 mr-1" />
            Previous
          </Link>
        ) : (
          <button
            disabled
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-400 cursor-not-allowed"
          >
            <FiChevronLeft className="h-5 w-5 mr-1" />
            Previous
          </button>
        )}

        {hasNextPage ? (
          <Link
            href={createPageUrl(currentPage + 1)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Next
            <FiChevronRight className="h-5 w-5 ml-1" />
          </Link>
        ) : (
          <button
            disabled
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-400 cursor-not-allowed"
          >
            Next
            <FiChevronRight className="h-5 w-5 ml-1" />
          </button>
        )}
      </div>
    </div>
  );
}
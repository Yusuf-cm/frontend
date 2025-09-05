// src/components/FilterBar.jsx
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function FilterBar({ categories, selectedCategory }) {
  const searchParams = useSearchParams();
  
  // Preserve other query parameters
  const createUrl = (category) => {
    const params = new URLSearchParams(searchParams);
    params.set('category', category);
    params.delete('page'); // Reset to first page when changing category
    return `/portfolio?${params.toString()}`;
  };
  
  const clearFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('category');
    params.delete('page'); // Reset to first page when clearing filter
    return `/portfolio?${params.toString()}`;
  };
  
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <Link
        href={clearFilter()}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          !selectedCategory
            ? 'bg-primary text-white shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All Projects
      </Link>
      
      {categories.map((category) => (
        <Link
          key={category.id}
          href={createUrl(category.slug)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === category.slug
              ? 'bg-primary text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
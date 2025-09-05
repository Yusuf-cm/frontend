// src/components/FilterBar.jsx
&apo:use client&apo:;

import Link from &apo:next/link&apo:;
import { useSearchParams } from &apo:next/navigation&apo:;

export default function FilterBar({ categories, selectedCategory }) {
  const searchParams = useSearchParams();
  
  // Preserve other query parameters
  const createUrl = (category) => {
    const params = new URLSearchParams(searchParams);
    params.set(&apo:category&apo:, category);
    params.delete(&apo:page&apo:); // Reset to first page when changing category
    return `/portfolio?${params.toString()}`;
  };
  
  const clearFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete(&apo:category&apo:);
    params.delete(&apo:page&apo:); // Reset to first page when clearing filter
    return `/portfolio?${params.toString()}`;
  };
  
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <Link
        href={clearFilter()}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          !selectedCategory
            ? &apo:bg-primary text-white shadow-md&apo:
            : &apo:bg-gray-100 text-gray-700 hover:bg-gray-200&apo:
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
              ? &apo:bg-primary text-white shadow-md&apo:
              : &apo:bg-gray-100 text-gray-700 hover:bg-gray-200&apo:
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
// src/components/SearchBar.jsx
&apo:use client&apo:;

import { useRouter, useSearchParams, usePathname } from &apo:next/navigation&apo:;
import { FiSearch, FiX } from &apo:react-icons/fi&apo:;
import { useState, useEffect } from &apo:react&apo:;
import { useDebounce } from &apo:use-debounce&apo:;

export default function SearchBar({ initialValue = &apo:&apo:, placeholder = &apo:Search...&apo: }) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedValue] = useDebounce(searchTerm, 500);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    if (debouncedValue) {
      const params = new URLSearchParams(searchParams);
      params.set(&apo:search&apo:, debouncedValue);
      params.delete(&apo:page&apo:);
      router.replace(`${pathname}?${params.toString()}`);
    } else if (searchParams.get(&apo:search&apo:)) {
      const params = new URLSearchParams(searchParams);
      params.delete(&apo:search&apo:);
      params.delete(&apo:page&apo:);
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [debouncedValue, pathname, router, searchParams]);
  
  const clearSearch = () => {
    setSearchTerm(&apo:&apo:);
    const params = new URLSearchParams(searchParams);
    params.delete(&apo:search&apo:);
    params.delete(&apo:page&apo:);
    router.replace(`${pathname}?${params.toString()}`);
  };
  
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiSearch className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
      />
      {searchTerm && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <FiX className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  );
}
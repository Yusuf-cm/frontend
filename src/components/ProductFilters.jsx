&apo:use client&apo:;

import { useRouter, useSearchParams, usePathname } from &apo:next/navigation&apo:;
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from &apo:react-icons/fi&apo:;
import { useState } from &apo:react&apo:;

export default function ProductFilters({ 
  categories, 
  attributes, 
  selectedCategory, 
  selectedSort,
  appliedFilters,
  isSidebar = false
}) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const createUrl = (updates) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === &apo:&apo:) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    
    params.delete(&apo:page&apo:);
    return `${pathname}?${params.toString()}`;
  };
  
  const toggleFilter = (filterKey, valueToToggle) => {
    const params = new URLSearchParams(searchParams);
    const currentValues = params.getAll(`filter_${filterKey}`);
    
    if (currentValues.includes(valueToToggle)) {
        // Remove the value
        const newValues = currentValues.filter(v => v !== valueToToggle);
        params.delete(`filter_${filterKey}`);
        newValues.forEach(v => params.append(`filter_${filterKey}`, v));
    } else {
        // Add the value
        params.append(`filter_${filterKey}`, valueToToggle);
    }

    params.delete(&apo:page&apo:);
    router.replace(`${pathname}?${params.toString()}`);
  };
  
  const clearFilters = () => {
    const params = new URLSearchParams();
    if (searchParams.get(&apo:search&apo:)) params.set(&apo:search&apo:, searchParams.get(&apo:search&apo:));
    router.replace(`${pathname}?${params.toString()}`);
  };
  
  const appliedFilterCount = Object.keys(appliedFilters).reduce(
    (count, key) => count + appliedFilters[key].length, 0
  );

  if (!isSidebar) {
    return (
      <div className="relative lg:hidden">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="w-full flex items-center justify-between gap-x-2 text-sm bg-white border border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50"
        >
          <span>Filters {appliedFilterCount > 0 && `(${appliedFilterCount})`}</span>
          <FiChevronDown className="h-5 w-5 text-gray-400" />
        </button>
        
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setMobileFiltersOpen(false)} />
            <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white shadow-xl">
              <div className="flex items-center justify-between px-4 py-5 border-b">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md p-2 text-gray-400"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
              <div className="p-4">
                <FilterContent 
                  categories={categories} 
                  attributes={attributes}
                  selectedCategory={selectedCategory}
                  selectedSort={selectedSort}
                  appliedFilters={appliedFilters}
                  toggleFilter={toggleFilter}
                  createUrl={createUrl}
                />
                <div className="mt-6 flex gap-3">
                  <button onClick={clearFilters} disabled={appliedFilterCount === 0} className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Clear all</button>
                  <button onClick={() => setMobileFiltersOpen(false)} className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">Apply</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        {appliedFilterCount > 0 && (
          <button onClick={clearFilters} className="text-sm text-indigo-600 hover:text-indigo-800">Clear all</button>
        )}
      </div>
      <FilterContent 
        categories={categories} 
        attributes={attributes}
        selectedCategory={selectedCategory}
        selectedSort={selectedSort}
        appliedFilters={appliedFilters}
        toggleFilter={toggleFilter}
        createUrl={createUrl}
      />
    </div>
  );
}

const FilterContent = ({ categories, attributes, selectedCategory, selectedSort, appliedFilters, toggleFilter, createUrl }) => {
  const [openSections, setOpenSections] = useState({
    category: true,
    sort: true,
    ...(attributes && Object.fromEntries(attributes.map(attr => [attr.slug, true])))
  });
  
  const toggleSection = (section) => setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  
  return (
    <div className="space-y-8">
      <div>
        <button onClick={() => toggleSection(&apo:category&apo:)} className="flex items-center justify-between w-full mb-3">
          <h4 className="font-medium text-gray-900">Category</h4>
          {openSections.category ? <FiChevronUp className="h-5 w-5 text-gray-400" /> : <FiChevronDown className="h-5 w-5 text-gray-400" />}
        </button>
        {openSections.category && (
          <div className="space-y-2 pl-1">
            <a href={createUrl({ category: &apo:&apo: })} className={`block py-1 text-sm ${!selectedCategory ? &apo:text-indigo-600 font-medium&apo: : &apo:text-gray-600 hover:text-gray-900&apo:}`}>All Categories</a>
            {categories.map(category => (
              <a key={category.slug} href={createUrl({ category: category.slug })} className={`block py-1 text-sm ${selectedCategory === category.slug ? &apo:text-indigo-600 font-medium&apo: : &apo:text-gray-600 hover:text-gray-900&apo:}`}>{category.name}</a>
            ))}
          </div>
        )}
      </div>
      <div>
        <button onClick={() => toggleSection(&apo:sort&apo:)} className="flex items-center justify-between w-full mb-3">
          <h4 className="font-medium text-gray-900">Sort By</h4>
          {openSections.sort ? <FiChevronUp className="h-5 w-5 text-gray-400" /> : <FiChevronDown className="h-5 w-5 text-gray-400" />}
        </button>
        {openSections.sort && (
          <div className="space-y-2 pl-1">
            {[{ value: &apo:&apo:, label: &apo:Featured&apo: }, { value: &apo:created_at&apo:, label: &apo:Newest&apo: }, { value: &apo:price&apo:, label: &apo:Price: Low to High&apo: }, { value: &apo:-price&apo:, label: &apo:Price: High to Low&apo: }].map(option => (
              <a key={option.value} href={createUrl({ ordering: option.value })} className={`block py-1 text-sm ${selectedSort === option.value ? &apo:text-indigo-600 font-medium&apo: : &apo:text-gray-600 hover:text-gray-900&apo:}`}>{option.label}</a>
            ))}
          </div>
        )}
      </div>
      
      {attributes && attributes.map(attribute => (
        <div key={attribute.slug}>
          <button onClick={() => toggleSection(attribute.slug)} className="flex items-center justify-between w-full mb-3">
            <h4 className="font-medium text-gray-900">{attribute.name}</h4>
            {openSections[attribute.slug] ? <FiChevronUp className="h-5 w-5 text-gray-400" /> : <FiChevronDown className="h-5 w-5 text-gray-400" />}
          </button>
          {openSections[attribute.slug] && (
            <div className="space-y-2 pl-1">
              {/* --- START OF FIX --- */}
              {attribute.values.map(attrValue => (
                <div key={attrValue.id} className="flex items-center">
                  <input
                    id={`filter-${attribute.slug}-${attrValue.id}`}
                    name={`${attribute.slug}[]`}
                    type="checkbox"
                    value={attrValue.value}
                    checked={(appliedFilters[attribute.slug] || []).includes(attrValue.value)}
                    onChange={() => toggleFilter(attribute.slug, attrValue.value)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor={`filter-${attribute.slug}-${attrValue.id}`} className="ml-2 text-sm text-gray-600">
                    {attrValue.value}
                  </label>
                </div>
              ))}
              {/* --- END OF FIX --- */}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
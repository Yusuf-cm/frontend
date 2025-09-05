// src/app/portfolio/page.js

import PaginationControls from "@/components/PaginationControls";
import ProjectCard from "@/components/ProjectCard"; // <-- CORRECTED IMPORT
import { Suspense } from 'react';
import { fetchProjectCategories } from '@/lib/data';
import FilterBar from '@/components/FilterBar';

// The data-fetching function now accepts a page number and category
async function getProjects({ page = '1', category = '' }) {
    // The endpoint name needs to be project-categories for filtering
    const url = `http://127.0.0.1:8000/api/projects/?page=${page}${
      category ? `&category=${category}` : ''
  }`;
    
    const res = await fetch(url, { 
        cache: 'no-store' 
    });
    
    if (!res.ok) {
        throw new Error('Failed to fetch projects');
    }
    
    return res.json();
}
  
export default async function PortfolioPage({ searchParams }) {
    const page = searchParams.page ?? '1';
    const category = searchParams.category ?? '';
    
    // Fetch the full data object which includes 'results', 'count', etc.
    const data = await getProjects({ page, category });
    const projects = data.results;
    
    // Fetch project categories
    const categories = await fetchProjectCategories();
    // -------------------------------

    // Calculate details needed for the pagination controls.
    const hasNextPage = data.next !== null;
    const hasPrevPage = data.previous !== null;
    const totalPages = Math.ceil(data.count / 12);

    return (
      <div className="bg-background py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-serif text-base text-primary font-semibold tracking-wider uppercase">Our Portfolio</h2>
            <p className="mt-2 font-serif text-3xl font-extrabold text-text tracking-tight sm:text-4xl">
              Spaces Reimagined
            </p>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-text-light">
              See how we've transformed spaces and brought our clients' visions to life.
            </p>
          </div>
          
          {/* Filter Bar */}
          <div className="mt-10">
            <Suspense fallback={<div className="h-12 bg-gray-100 rounded-md animate-pulse"></div>}>
              <FilterBar categories={categories} selectedCategory={category} />
            </Suspense>
          </div>
  
          <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:gap-8">
            {projects.length > 0 ? (
                projects.map((project) => (
                  <ProjectCard key={project.id} project={project} /> // <-- USING THE CORRECT COMPONENT
                ))
            ) : (
                <div className="col-span-full text-center py-16">
                  <div className="mx-auto bg-gray-100 rounded-full p-4 w-24 h-24 flex items-center justify-center mb-6">
                    <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-text">No projects found</h3>
                  <p className="mt-2 text-text-light max-w-md mx-auto">
                    Try adjusting your filters or check back later for new portfolio additions.
                  </p>
                </div>
            )}
          </div>

          {/* Render the pagination controls at the bottom */}
          {projects.length > 0 && (
            <div className="mt-12">
              <PaginationControls
                hasNextPage={hasNextPage}
                hasPrevPage={hasPrevPage}
                totalPages={totalPages}
                path="/portfolio"
                currentCategory={category}
              />
            </div>
          )}
        </div>
      </div>
    );
}
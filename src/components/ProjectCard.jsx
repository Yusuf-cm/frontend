'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiMove } from 'react-icons/fi';

export default function ProjectCard({ project }) {
  // Graceful fallback for missing images to prevent crashes
  const beforeImage = project.before_image || '/placeholder-image.png';
  const afterImage = project.after_image || '/placeholder-image.png';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="group bg-white rounded-2xl shadow-md overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Image container with the hover effect */}
      <div className="relative aspect-square cursor-pointer overflow-hidden">
        
        {/* Layer 1: Before Image (The base layer, always visible underneath) */}
        <Image
          src={beforeImage}
          alt={`Before: ${project.title}`}
          fill
          className="object-cover select-none" // prevent image dragging
          sizes="(max-width: 768px) 100vw, 33vw"
          priority // Prioritize loading images in the viewport
        />
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs font-semibold px-2 py-1 rounded-full pointer-events-none">
            BEFORE
        </div>

        {/* Layer 2: After Image (The sliding layer on top) */}
        <motion.div
          className="absolute inset-0"
          // Animate the clipPath for a smooth wipe effect from right to left on hover
          initial={{ clipPath: 'inset(0 0 0 0)' }}
          whileHover={{ clipPath: 'inset(0 100% 0 0)' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }} // A smoother, more elegant ease
        >
          <Image
            src={afterImage}
            alt={`After: ${project.title}`}
            fill
            className="object-cover select-none"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs font-semibold px-2 py-1 rounded-full pointer-events-none">
            AFTER
          </div>
        </motion.div>

        {/* Layer 3: The draggable-style handle that follows the wipe effect */}
        <motion.div
          className="absolute top-0 bottom-0 w-[3px] bg-white bg-opacity-75 shadow-lg cursor-ew-resize backdrop-blur-sm"
          initial={{ left: '100%', x: '-50%' }}
          whileHover={{ left: '0%', x: '-50%' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -left-[18px] w-10 h-10 rounded-full bg-white shadow-2xl flex items-center justify-center border-2 border-gray-200">
            <FiMove className="text-gray-800" />
          </div>
        </motion.div>

      </div>

      {/* Card Content */}
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors">
              {project.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {project.category?.name || 'General Project'}
            </p>
          </div>
          {project.is_featured && (
            <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0">
              Featured
            </span>
          )}
        </div>
        <p className="mt-3 text-gray-600 line-clamp-2">
          {project.description}
        </p>
      </div>
    </motion.div>
  );
}
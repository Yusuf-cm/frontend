&apo:use client&apo:;

import { motion } from &apo:framer-motion&apo:;
import Link from &apo:next/link&apo:;
import { FiArrowLeft } from &apo:react-icons/fi&apo:;

export default function InfoPageLayout({ title, children }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-md border border-gray-100"
        >
          <div className="p-8 sm:p-12">
            <div className="mb-10">
              <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
                <FiArrowLeft className="mr-2" />
                Back to Home
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight font-serif">
                {title}
              </h1>
              <p className="mt-4 text-lg text-gray-600">Last updated: {new Date().toLocaleDateString(&apo:en-US&apo:, { year: &apo:numeric&apo:, month: &apo:long&apo:, day: &apo:numeric&apo: })}</p>
            </div>
            <div className="mt-12 prose prose-indigo lg:prose-lg max-w-none">
              {children}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
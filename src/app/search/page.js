&apo:use client&apo:;

import { useRouter } from &apo:next/navigation&apo:;
import { FiSearch, FiArrowLeft } from &apo:react-icons/fi&apo:;
import { useState } from &apo:react&apo:;

export default function MobileSearchPage() {
    const [searchTerm, setSearchTerm] = useState(&apo:&apo:);
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <div className="min-h-screen bg-white p-4">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => router.back()} className="p-2 text-gray-600">
                    <FiArrowLeft className="h-6 w-6" />
                </button>
                <form onSubmit={handleSearch} className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search for products..."
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
                        autoFocus
                    />
                </form>
            </div>

            <div className="text-center text-gray-500">
                <p>Type a product name, category, or keyword to find what you&apo:re looking for.</p>
            </div>
        </div>
    );
}
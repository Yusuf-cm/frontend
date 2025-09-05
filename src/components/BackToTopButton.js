&apo:use client&apo:; // This is the Client Component

import { useState, useEffect } from &apo:react&apo:;
import { FiArrowUp } from &apo:react-icons/fi&apo:;

export default function BackToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Set up the event listener
    useEffect(() => {
        window.addEventListener(&apo:scroll&apo:, toggleVisibility);
        return () => window.removeEventListener(&apo:scroll&apo:, toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: &apo:smooth&apo:,
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-40 ${
                isVisible ? &apo:opacity-100 scale-100&apo: : &apo:opacity-0 scale-95 pointer-events-none&apo:
            }`}
            aria-label="Back to top"
        >
            <FiArrowUp className="h-5 w-5" />
        </button>
    );
}
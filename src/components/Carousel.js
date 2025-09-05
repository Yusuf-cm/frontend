&apo:use client&apo:; // This MUST be a client component

import React, { useCallback } from &apo:react&apo:;
import useEmblaCarousel from &apo:embla-carousel-react&apo:;
import { flushSync } from &apo:react-dom&apo:;

// A simple SVG arrow component
const Arrow = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    className={`absolute top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 shadow-md backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-white transition-all z-10 ${
      direction === &apo:left&apo: ? &apo:left-2&apo: : &apo:right-2&apo:
    }`}
    aria-label={direction === &apo:left&apo: ? &apo:Previous slide&apo: : &apo:Next slide&apo:}
  >
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {direction === &apo:left&apo: ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      )}
    </svg>
  </button>
);


export default function Carousel({ children }) {
  // 1. Initialize Embla Carousel
  // The second argument is options. &apo:loop: true&apo: makes it an infinite carousel.
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: &apo:start&apo: });

  // 2. Functions to scroll to the previous or next slide
  // We use flushSync to ensure the DOM is updated synchronously, which can
  // improve the perceived responsiveness of the carousel.
  const scrollPrev = useCallback(() => {
    if (emblaApi) flushSync(() => emblaApi.scrollPrev());
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) flushSync(() => emblaApi.scrollNext());
  }, [emblaApi]);


  return (
    // This outer div is relative to position the absolute-positioned arrows
    <div className="relative">
      {/* 3. This is the main viewport of the carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        {/* 4. The container holds the slides. Embla will apply styles to this. */}
        {/* We use flexbox to lay out the children (our product cards). */}
        <div className="flex">
          {/* 5. We map over the `children` prop */}
          {React.Children.map(children, (child) => (
            // Each child is a "slide". We set a fixed width for each slide.
            // flex-shrink-0 and flex-grow-0 prevent the slides from resizing.
            // The width sets how many slides are visible. w-1/4 = 4 slides on desktop.
            <div className="relative flex-shrink-0 flex-grow-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* 6. Render the navigation arrows */}
      <Arrow direction="left" onClick={scrollPrev} />
      <Arrow direction="right" onClick={scrollNext} />
    </div>
  );
}
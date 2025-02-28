import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import GridItem from "./GridItem";

const ScrollableGrid = ({ gridPosts }) => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200; // Adjust scroll amount as needed
      const newScrollPosition =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full max-w-[434px]">
      {/* Scroll Buttons */}
      <button
        onClick={() => scroll("left")}
        className="absolute -left-0 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-black bg-opacity-50 p-1"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute -right-0 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-black bg-opacity-50 p-1"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Scrollable Container with Modern Thin Scrollbar */}
      <div
        ref={scrollContainerRef}
        className="thin-scrollbar flex w-full gap-4 overflow-x-auto"
        style={{
          /* Modern scrollbar styling with inline styles for cross-browser support */
          scrollbarWidth: "thin" /* Firefox */,
          scrollbarColor: "rgba(155, 155, 155, 0.5) transparent" /* Firefox */,
          paddingBottom: "8px" /* Space for the scrollbar */,
        }}
      >
        <style jsx>{`
          /* Custom scrollbar for Webkit browsers (Chrome, Safari, newer Edge) */
          .thin-scrollbar::-webkit-scrollbar {
            height: 4px;
          }
          .thin-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .thin-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(155, 155, 155, 0.5);
            border-radius: 20px;
          }
        `}</style>

        {gridPosts.map((post) => (
          <div key={post._id} className="flex-none">
            <GridItem article={post} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollableGrid;

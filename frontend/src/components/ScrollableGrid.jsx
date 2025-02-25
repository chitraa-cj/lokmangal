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

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex w-full gap-4 overflow-x-auto pb-4"
      >
        {gridPosts.map((post) => (
          <div key={post._id} className="flex-none">
            <GridItem article={post} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Add CSS to hide scrollbar
// const style = document.createElement("style");
// style.textContent = `
//   .scrollbar-hide::-webkit-scrollbar {
//     display: none;
//   }
// `;
// document.head.appendChild(style);

export default ScrollableGrid;

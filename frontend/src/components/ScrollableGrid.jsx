// import { useRef } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import GridItem from "./GridItem";

// const ScrollableGrid = ({ gridPosts }) => {
//   const scrollContainerRef = useRef(null);

//   const scroll = (direction) => {
//     if (scrollContainerRef.current) {
//       const scrollAmount = 200; // Adjust scroll amount as needed
//       const newScrollPosition =
//         scrollContainerRef.current.scrollLeft +
//         (direction === "left" ? -scrollAmount : scrollAmount);
//       scrollContainerRef.current.scrollTo({
//         left: newScrollPosition,
//         behavior: "smooth",
//       });
//     }
//   };

//   return (
//     <div className="relative w-4/5 sm:w-full sm:max-w-[434px]">
//       {/* Scroll Buttons */}
//       <button
//         onClick={() => scroll("left")}
//         className="absolute -left-0 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-black bg-opacity-50 p-1 hover:bg-opacity-70"
//       >
//         <ChevronLeft className="h-4 w-4 text-white sm:h-6 sm:w-6" />
//       </button>
//       <button
//         onClick={() => scroll("right")}
//         className="absolute -right-0 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-black bg-opacity-50 p-1 hover:bg-opacity-70"
//       >
//         <ChevronRight className="h-4 w-4 text-white sm:h-6 sm:w-6" />
//       </button>

//       {/* Scrollable Container with Modern Thin Scrollbar */}
//       <div
//         ref={scrollContainerRef}
//         className="thin-scrollbar flex w-full gap-2 overflow-x-auto px-1 sm:gap-4"
//         style={{
//           /* Modern scrollbar styling with inline styles for cross-browser support */
//           scrollbarWidth: "thin" /* Firefox */,
//           scrollbarColor: "rgba(155, 155, 155, 0.5) transparent" /* Firefox */,
//           paddingBottom: "8px" /* Space for the scrollbar */,
//         }}
//       >
//         <style>
//           {`
//           /* Custom scrollbar for Webkit browsers (Chrome, Safari, newer Edge) */
//           .thin-scrollbar::-webkit-scrollbar {
//             height: 4px;
//           }
//           .thin-scrollbar::-webkit-scrollbar-track {
//             background: transparent;
//           }
//           .thin-scrollbar::-webkit-scrollbar-thumb {
//             background-color: rgba(155, 155, 155, 0.5);
//             border-radius: 20px;
//           }
//         `}
//         </style>

//         {gridPosts.map((post) => (
//           <div key={post._id} className="flex-none">
//             <GridItem article={post} />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ScrollableGrid;

import GridItem from "./GridItem";

const ScrollableGrid = ({ gridPosts }) => {
  return (
    <div className="media-scroller snaps-inline girdMaxWidth w-full max-w-full overflow-x-auto">
      {gridPosts.map((post) => (
        <div key={post._id}>
          <GridItem article={post} />
        </div>
      ))}
    </div>
  );
};
export default ScrollableGrid;

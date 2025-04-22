// import { useNewsPosts } from "../hooks/useApi";
// import HeroArticle from "../components/HeroArticle";
// import BreakingNews from "../components/BreakingNews";
// import ScrollableGrid from "../components/ScrollableGrid";
// import VideoCard from "../components/VideoCard";
// import RightSideBar from "../components/RightSideBar";
// import LeftSideBar from "../components/LeftSideBar";
// import Loader from "../components/Loader";
// import Error from "../components/Error";
// import Weather from "../components/Weather";
// import FollowUs from "../components/FollowUs";
// import { useRef, useEffect } from "react";

// const HomePage = () => {
//   const { data, isLoading, error } = useNewsPosts();
//   const leftSidebarRef = useRef(null);
//   const rightSidebarRef = useRef(null);

//   useEffect(() => {
//     const handleScroll = () => {
//       const leftSidebar = leftSidebarRef.current;
//       const rightSidebar = rightSidebarRef.current;

//       if (!leftSidebar || !rightSidebar) return;

//       const leftSidebarHeight = leftSidebar.scrollHeight;
//       const rightSidebarHeight = rightSidebar.scrollHeight;
//       const windowHeight = window.innerHeight;

//       // Handle left sidebar
//       if (leftSidebarHeight <= windowHeight) {
//         leftSidebar.style.position = "sticky";
//         leftSidebar.style.top = "1rem";
//       } else {
//         const leftSidebarBottom = leftSidebar.getBoundingClientRect().bottom;
//         if (leftSidebarBottom <= windowHeight) {
//           leftSidebar.style.position = "fixed";
//           leftSidebar.style.bottom = "1rem";
//           leftSidebar.style.top = "auto";
//         } else {
//           leftSidebar.style.position = "relative";
//           leftSidebar.style.bottom = "auto";
//           leftSidebar.style.top = "auto";
//         }
//       }

//       // Handle right sidebar
//       if (rightSidebarHeight <= windowHeight) {
//         rightSidebar.style.position = "sticky";
//         rightSidebar.style.top = "1rem";
//       } else {
//         const rightSidebarBottom = rightSidebar.getBoundingClientRect().bottom;
//         if (rightSidebarBottom <= windowHeight) {
//           rightSidebar.style.position = "fixed";
//           rightSidebar.style.bottom = "1rem";
//           rightSidebar.style.top = "auto";
//         } else {
//           rightSidebar.style.position = "relative";
//           rightSidebar.style.bottom = "auto";
//           rightSidebar.style.top = "auto";
//         }
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   if (isLoading) return <Loader />;
//   if (error) return <Error />;

//   let breakingNews,
//     mainPosts = [],
//     leftPosts = [],
//     rightPosts = [],
//     gridPosts = [];

//   if (data) {
//     ({
//       breakingNews,
//       main: mainPosts,
//       left: leftPosts,
//       right: rightPosts,
//       grid: gridPosts,
//     } = data);
//   }

//   return (
//     <div className="flex min-w-full flex-col items-center justify-center bg-gray-100 px-2 pb-8 pt-2 sm:px-4 sm:pb-12 sm:pt-4">
//       <BreakingNews breakingNews={breakingNews} />

//       <main className="relative flex items-start justify-center md:space-x-4 lg:space-x-6">
//         <div
//           ref={leftSidebarRef}
//           className="hidden lg:flex lg:flex-col lg:items-end lg:gap-y-6"
//         >
//           {leftPosts?.length > 0 && <LeftSideBar leftNews={leftPosts} />}
//           <FollowUs />
//         </div>

//         <div className="flex flex-col items-center justify-center">
//           <div className="block md:hidden">
//             <Weather />
//           </div>

//           {mainPosts?.length > 0 && (
//             <div className="">
//               <HeroArticle id={mainPosts[0]._id} article={mainPosts[0]} />
//             </div>
//           )}

//           {gridPosts?.length > 0 && (
//             <div className="my-4 sm:my-8">
//               <ScrollableGrid gridPosts={gridPosts.slice(0, 6)} />
//             </div>
//           )}

//           {mainPosts?.slice(1, 2).map((post) => (
//             <div key={post._id}>
//               <HeroArticle id={post._id} article={post} />
//             </div>
//           ))}

//           {gridPosts?.length > 6 && (
//             <div className="my-4 sm:my-8">
//               <ScrollableGrid gridPosts={gridPosts.slice(6)} />
//             </div>
//           )}

//           <div className="space-y-4 sm:space-y-8">
//             {mainPosts?.slice(2).map((post) => (
//               <div key={post._id}>
//                 <HeroArticle id={post._id} article={post} />
//               </div>
//             ))}
//           </div>

//           <VideoCard />
//         </div>

//         <div
//           ref={rightSidebarRef}
//           className="hidden lg:flex lg:flex-col lg:items-start"
//         >
//           <Weather />
//           {rightPosts?.length > 0 && <RightSideBar trendingNews={rightPosts} />}
//         </div>
//       </main>

//       <div className="fixed bottom-8 right-3">
//         <iframe
//           className="h-40 w-40 rounded-lg shadow-lg"
//           src="https://www.youtube.com/embed/CDjD5gQjXQk?autoplay=1&mute=1&loop=1&playlist=CDjD5gQjXQk"
//           title="YouTube video player"
//           frameBorder="0"
//           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//           allowFullScreen
//         ></iframe>
//       </div>
//     </div>
//   );
// };

// export default HomePage;

// Bad Code

// import { useNewsPosts } from "../hooks/useApi";
// import HeroArticle from "../components/HeroArticle";
// import BreakingNews from "../components/BreakingNews";
// import ScrollableGrid from "../components/ScrollableGrid";
// import VideoCard from "../components/VideoCard";
// import RightSideBar from "../components/RightSideBar";
// import LeftSideBar from "../components/LeftSideBar";
// import Loader from "../components/Loader";
// import Error from "../components/Error";
// import Weather from "../components/Weather";
// import FollowUs from "../components/FollowUs";
// import { useRef, useEffect } from "react";

// // Utility function to debounce a callback
// const debounce = (func, wait) => {
//   let timeout;
//   return (...args) => {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => func(...args), wait);
//   };
// };

// const HomePage = () => {
//   const { data, isLoading, error } = useNewsPosts();
//   const leftSidebarRef = useRef(null);
//   const rightSidebarRef = useRef(null);

//   useEffect(() => {
//     // Check if the screen size is large (lg) using a media query
//     const isLargeScreen = () =>
//       window.matchMedia("(min-width: 1024px)").matches;

//     // Only apply the scroll behavior if the screen is large
//     if (!isLargeScreen()) return;

//     let lastScrollY = window.scrollY;

//     const handleScroll = () => {
//       const leftSidebar = leftSidebarRef.current;
//       const rightSidebar = rightSidebarRef.current;

//       if (!leftSidebar || !rightSidebar) return;

//       const currentScrollY = window.scrollY;
//       const scrollingUp = currentScrollY < lastScrollY;
//       const windowHeight = window.innerHeight;

//       // Force relative positioning when at the top of the page or overscrolling
//       if (currentScrollY <= 10) {
//         // Using a small threshold to account for overscroll
//         leftSidebar.style.position = "relative";
//         leftSidebar.style.top = "auto";
//         leftSidebar.style.bottom = "auto";

//         rightSidebar.style.position = "relative";
//         rightSidebar.style.top = "auto";
//         rightSidebar.style.bottom = "auto";
//         lastScrollY = currentScrollY;
//         return;
//       }

//       const leftSidebarHeight = leftSidebar.scrollHeight;
//       const rightSidebarHeight = rightSidebar.scrollHeight;

//       // Handle left sidebar
//       if (leftSidebarHeight <= windowHeight) {
//         leftSidebar.style.position = "sticky";
//         leftSidebar.style.top = "1rem";
//         leftSidebar.style.bottom = "auto";
//       } else {
//         const leftSidebarRect = leftSidebar.getBoundingClientRect();
//         const leftSidebarBottom = leftSidebarRect.bottom;
//         const leftSidebarTop = leftSidebarRect.top;

//         if (scrollingUp) {
//           // When scrolling up, check if the top of the sidebar is above the viewport
//           if (leftSidebarTop >= 1) {
//             leftSidebar.style.position = "relative";
//             leftSidebar.style.top = "auto";
//             leftSidebar.style.bottom = "auto";
//           }
//         } else {
//           // When scrolling down, fix the sidebar when it reaches the bottom
//           if (leftSidebarBottom <= windowHeight) {
//             leftSidebar.style.position = "fixed";
//             leftSidebar.style.bottom = "1rem";
//             leftSidebar.style.top = "auto";
//           } else {
//             leftSidebar.style.position = "relative";
//             leftSidebar.style.top = "auto";
//             leftSidebar.style.bottom = "auto";
//           }
//         }
//       }

//       // Handle right sidebar
//       if (rightSidebarHeight <= windowHeight) {
//         rightSidebar.style.position = "sticky";
//         rightSidebar.style.top = "1rem";
//         rightSidebar.style.bottom = "auto";
//       } else {
//         const rightSidebarRect = rightSidebar.getBoundingClientRect();
//         const rightSidebarBottom = rightSidebarRect.bottom;
//         const rightSidebarTop = rightSidebarRect.top;

//         if (scrollingUp) {
//           // When scrolling up, check if the top of the sidebar is above the viewport
//           if (rightSidebarTop >= 1) {
//             rightSidebar.style.position = "relative";
//             rightSidebar.style.top = "auto";
//             rightSidebar.style.bottom = "auto";
//           }
//         } else {
//           // When scrolling down, fix the sidebar when it reaches the bottom
//           if (rightSidebarBottom <= windowHeight) {
//             rightSidebar.style.position = "fixed";
//             rightSidebar.style.bottom = "1rem";
//             rightSidebar.style.top = "auto";
//           } else {
//             rightSidebar.style.position = "relative";
//             rightSidebar.style.top = "auto";
//             rightSidebar.style.bottom = "auto";
//           }
//         }
//       }

//       lastScrollY = currentScrollY;
//     };

//     // Debounce the scroll handler to prevent rapid toggling
//     const debouncedHandleScroll = debounce(handleScroll, 50);

//     window.addEventListener("scroll", debouncedHandleScroll);

//     // Handle resize events to enable/disable the behavior based on screen size
//     const handleResize = () => {
//       if (!isLargeScreen()) {
//         // Reset styles on smaller screens
//         if (leftSidebarRef.current) {
//           leftSidebarRef.current.style.position = "relative";
//           leftSidebarRef.current.style.top = "auto";
//           leftSidebarRef.current.style.bottom = "auto";
//         }
//         if (rightSidebarRef.current) {
//           rightSidebarRef.current.style.position = "relative";
//           rightSidebarRef.current.style.top = "auto";
//           rightSidebarRef.current.style.bottom = "auto";
//         }
//       } else {
//         // Re-run the scroll handler if the screen becomes large
//         debouncedHandleScroll();
//       }
//     };

//     window.addEventListener("resize", handleResize);

//     // Initial call to set the correct state
//     debouncedHandleScroll();

//     return () => {
//       window.removeEventListener("scroll", debouncedHandleScroll);
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   if (isLoading) return <Loader />;
//   if (error) return <Error />;

//   let breakingNews,
//     mainPosts = [],
//     leftPosts = [],
//     rightPosts = [],
//     gridPosts = [];

//   if (data) {
//     ({
//       breakingNews,
//       main: mainPosts,
//       left: leftPosts,
//       right: rightPosts,
//       grid: gridPosts,
//     } = data);
//   }

//   return (
//     <div className="flex min-w-full flex-col items-center justify-center bg-gray-100 px-2 pb-8 pt-2 sm:px-4 sm:pb-12 sm:pt-4">
//       <BreakingNews breakingNews={breakingNews} />

//       <main className="relative flex items-start justify-center md:space-x-4 lg:space-x-6">
//         <div
//           ref={leftSidebarRef}
//           className="hidden flex-col items-end gap-y-6 lg:flex"
//         >
//           {leftPosts?.length > 0 && <LeftSideBar leftNews={leftPosts} />}
//           <FollowUs />
//         </div>

//         <div className="flex flex-col items-center justify-center">
//           <div className="block md:hidden">
//             <Weather />
//           </div>

//           {mainPosts?.length > 0 && (
//             <div className="">
//               <HeroArticle id={mainPosts[0]._id} article={mainPosts[0]} />
//             </div>
//           )}

//           {gridPosts?.length > 0 && (
//             <div className="my-4 sm:my-8">
//               <ScrollableGrid gridPosts={gridPosts.slice(0, 6)} />
//             </div>
//           )}

//           {mainPosts?.slice(1, 2).map((post) => (
//             <div key={post._id}>
//               <HeroArticle id={post._id} article={post} />
//             </div>
//           ))}

//           {gridPosts?.length > 6 && (
//             <div className="my-4 sm:my-8">
//               <ScrollableGrid gridPosts={gridPosts.slice(6)} />
//             </div>
//           )}

//           <div className="space-y-4 sm:space-y-8">
//             {mainPosts?.slice(2).map((post) => (
//               <div key={post._id}>
//                 <HeroArticle id={post._id} article={post} />
//               </div>
//             ))}
//           </div>

//           <VideoCard />
//         </div>

//         <div
//           ref={rightSidebarRef}
//           className="hidden flex-col items-start lg:block"
//         >
//           <Weather />
//           {rightPosts?.length > 0 && <RightSideBar trendingNews={rightPosts} />}
//         </div>
//       </main>

//       <div className="fixed bottom-8 right-3">
//         <iframe
//           className="h-40 w-40 rounded-lg shadow-lg"
//           src="https://www.youtube.com/embed/CDjD5gQjXQk?autoplay=1&mute=1&loop=1&playlist=CDjD5gQjXQk"
//           title="YouTube video player"
//           frameBorder="0"
//           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//           allowFullScreen
//         ></iframe>
//       </div>
//     </div>
//   );
// };

// export default HomePage;

import { useState, useEffect } from "react";
import { useNewsPosts, usePaginatedMainNewsPosts } from "../hooks/useApi";
import HeroArticle from "../components/HeroArticle";
import BreakingNews from "../components/BreakingNews";
import ScrollableGrid from "../components/ScrollableGrid";
import VideoCard from "../components/VideoCard";
import RightSideBar from "../components/RightSideBar";
import LeftSideBar from "../components/LeftSideBar";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Weather from "../components/Weather";
import FollowUs from "../components/FollowUs";

const HomePage = () => {
  const { data, isLoading, error } = useNewsPosts();
  const [page, setPage] = useState(1);
  const [allMainPosts, setAllMainPosts] = useState([]);

  const {
    data: paginatedData,
    isLoading: isPaginatedLoading,
    error: paginatedError,
  } = usePaginatedMainNewsPosts(page);

  // Effect to initialize allMainPosts with initial data
  useEffect(() => {
    if (data?.main && allMainPosts.length === 0) {
      setAllMainPosts(data.main);
    }
  }, [data, allMainPosts.length]);

  // Effect to append paginated main posts
  useEffect(() => {
    if (paginatedData?.mainPosts && page > 1) {
      setAllMainPosts((prev) => [...prev, ...paginatedData.mainPosts]);
    }
  }, [paginatedData, page]);

  if (isLoading) return <Loader />;
  if (error) return <Error />;

  let breakingNews,
    leftPosts = [],
    rightPosts = [],
    gridPosts = [];

  if (data) {
    ({
      breakingNews,
      left: leftPosts,
      right: rightPosts,
      grid: gridPosts,
    } = data);
  }

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="flex min-w-full flex-col items-center justify-center bg-gray-100 px-2 pb-8 pt-2 sm:px-4 sm:pb-12 sm:pt-4">
      <BreakingNews breakingNews={breakingNews} />

      <main className="relative flex items-start justify-center lg:space-x-6">
        <div className="hidden lg:sticky lg:top-4 lg:flex lg:flex-col lg:items-end lg:gap-y-6">
          {leftPosts?.length > 0 && <LeftSideBar leftNews={leftPosts} />}
          <FollowUs />
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="block md:hidden">
            <Weather />
          </div>

          {allMainPosts?.length > 0 && (
            <div className="">
              <HeroArticle id={allMainPosts[0]._id} article={allMainPosts[0]} />
            </div>
          )}

          {gridPosts?.length > 0 && (
            <div className="my-4 sm:my-8">
              <ScrollableGrid gridPosts={gridPosts.slice(0, 6)} />
            </div>
          )}

          {gridPosts?.length === 0 && <div className="mt-4 sm:mt-8"></div>}

          {allMainPosts?.slice(1, 2).map((post) => (
            <div key={post._id}>
              <HeroArticle id={post._id} article={post} />
            </div>
          ))}

          {gridPosts?.length > 6 && (
            <div className="my-4 sm:my-8">
              <ScrollableGrid gridPosts={gridPosts.slice(6)} />
            </div>
          )}

          {gridPosts?.length < 6 && <div className="mt-4 sm:mt-8"></div>}

          <div className="space-y-4 sm:space-y-8">
            {allMainPosts?.slice(2).map((post) => (
              <div key={post._id}>
                <HeroArticle id={post._id} article={post} />
              </div>
            ))}
          </div>

          {isPaginatedLoading && <Loader />}
          {paginatedError && <Error />}
          {paginatedData?.hasMore && (
            <button
              onClick={handleLoadMore}
              className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              disabled={isPaginatedLoading}
            >
              {isPaginatedLoading ? "Loading..." : "Load More"}
            </button>
          )}

          <VideoCard link={data?.videos[0]?.url} />
        </div>

        <div className="hidden lg:sticky lg:top-4 lg:flex lg:flex-col lg:items-start">
          <Weather />
          {rightPosts?.length > 0 && <RightSideBar trendingNews={rightPosts} />}
        </div>
      </main>

      <div className="fixed bottom-10 left-8 hidden lg:block">
        <iframe
          className="h-auto w-48 rounded-lg shadow-lg"
          src={data?.videos[1]?.url}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default HomePage;

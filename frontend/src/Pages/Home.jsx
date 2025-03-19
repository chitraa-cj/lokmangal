import { Link, useLocation, useParams } from "react-router-dom";
import { useNewsPosts } from "../hooks/useApi";
import { X } from "lucide-react";
import HeroArticle from "../components/HeroArticle";
import BreakingNews from "../components/BreakingNews";
import ScrollableGrid from "../components/ScrollableGrid";
import VideoCard from "../components/VideoCard";
import RightSideBar from "../components/RightSideBar";
import LeftSideBar from "../components/LeftSideBar";
import Loader from "../components/Loader";
import Error from "../components/Error";
import CricketScore from "../components/CricketScore";
import Weather from "../components/Weather";
import FollowUs from "../components/FollowUs";
import YouTube from "react-youtube"; // Import the YouTube component

const NewsArticlePage = () => {
  const { category } = useParams();
  const location = useLocation();
  const categoryNewsPosts = location.state?.mainPosts;

  const { data, isLoading, error } = useNewsPosts();

  // console.log(data);

  // Check if data is defined before destructuring
  let breakingNews,
    mainPosts = [],
    leftPosts = [],
    rightPosts = [],
    gridPosts = [];

  if (data) {
    ({
      breakingNews,
      main: mainPosts,
      left: leftPosts,
      right: rightPosts,
      grid: gridPosts,
    } = data);
  }

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Error />;
  }

  if (category) {
    if (!categoryNewsPosts) {
      return (
        <p className="flex min-h-screen items-center justify-center bg-gray-100">
          Error loading news articles.
        </p>
      );
    }
  }

  // Options for the YouTube player
  const youtubeOptions = {
    // height: "390",
    // width: "640",
    playerVars: {
      autoplay: 0, // Set to 1 to autoplay
    },
  };

  return (
    <div className="flex min-w-full flex-col items-center justify-center bg-gray-100 px-2 pb-8 pt-2 sm:px-4 sm:pb-12 sm:pt-4">
      <BreakingNews breakingNews={breakingNews} />

      <main className="relative flex items-start justify-center md:space-x-4 lg:space-x-6">
        <div className="sticky top-4 hidden flex-col items-end gap-y-6 lg:flex">
          {leftPosts.length > 0 && <LeftSideBar leftNews={leftPosts} />}
          <FollowUs />
        </div>

        <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-8">
          <div className="mx-4 md:mx-0">
            {/* <CricketScore /> */}
            <div className="block md:hidden">
              <Weather />
            </div>
            {mainPosts.length > 0 && (
              <HeroArticle id={mainPosts[0]._id} article={mainPosts[0]} />
            )}
          </div>

          {/* <div className="hidden md:block"> */}
          <div className="">
            {gridPosts.length > 0 && (
              <ScrollableGrid gridPosts={gridPosts.slice(0, 6)} />
            )}
          </div>

          <div className="mx-4 md:mx-0">
            {mainPosts.slice(1, 2).map((post) => (
              <div key={post._id}>
                <HeroArticle id={post._id} article={post} />
              </div>
            ))}
          </div>

          {/* <div className="hidden md:block"> */}
          <div className="">
            {gridPosts.length > 6 && (
              <ScrollableGrid gridPosts={gridPosts.slice(6)} />
            )}
          </div>

          <div className="mx-4 space-y-4 sm:space-y-8 md:mx-0">
            {mainPosts.slice(2).map((post) => (
              <div key={post._id}>
                <HeroArticle id={post._id} article={post} />
              </div>
            ))}
          </div>

          {/* <div className="mx-3 md:mx-0"> */}
          {/* <div className=""> */}
          {/* <VideoCard /> */}
          {/* </div> */}
          <>
            <VideoCard />
          </>
        </div>

        <div className="sticky top-4 hidden flex-col items-start lg:flex">
          <Weather />
          {rightPosts.length > 0 && <RightSideBar trendingNews={rightPosts} />}
        </div>
      </main>
      {/* Add YouTube player here */}
      <div className="fixed bottom-8 right-3">
        {/* <YouTube
          videoId="dQw4w9WgXcQ" // Replace with your desired YouTube video ID
          opts={youtubeOptions}
          onReady={(event) => event.target.pauseVideo()} // Optional: Pause video on load
        /> */}
        {/* <iframe
          className="h-40 w-40 rounded-lg shadow-lg"
          src="https://www.youtube.com/embed/CDjD5gQjXQk?si=9oLqbmoIyEGdw3Xd"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe> */}
        <iframe
          className="h-40 w-40 rounded-lg shadow-lg"
          src="https://www.youtube.com/embed/CDjD5gQjXQk?autoplay=1&mute=1&loop=1&playlist=CDjD5gQjXQk"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default NewsArticlePage;

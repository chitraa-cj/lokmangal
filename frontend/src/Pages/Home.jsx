import { useNewsPosts } from "../hooks/useApi";
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

  if (isLoading) return <Loader />;
  if (error) return <Error />;

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

  return (
    <div className="flex min-w-full flex-col items-center justify-center bg-gray-100 px-2 pb-8 pt-2 sm:px-4 sm:pb-12 sm:pt-4">
      <BreakingNews breakingNews={breakingNews} />

      <main className="relative flex items-start justify-center md:space-x-4 lg:space-x-6">
        <div className="sticky top-4 hidden flex-col items-end gap-y-6 lg:flex">
          {leftPosts?.length > 0 && <LeftSideBar leftNews={leftPosts} />}
          <FollowUs />
        </div>

        <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-8">
          <div className="mx-4 md:mx-0">
            <div className="block md:hidden">
              <Weather />
            </div>
            {mainPosts?.length > 0 && (
              <HeroArticle id={mainPosts[0]._id} article={mainPosts[0]} />
            )}
          </div>

          {gridPosts?.length > 0 && (
            <ScrollableGrid gridPosts={gridPosts.slice(0, 6)} />
          )}

          <div className="mx-4 md:mx-0">
            {mainPosts?.slice(1, 2).map((post) => (
              <div key={post._id}>
                <HeroArticle id={post._id} article={post} />
              </div>
            ))}
          </div>

          {gridPosts?.length > 6 && (
            <ScrollableGrid gridPosts={gridPosts.slice(6)} />
          )}

          <div className="mx-4 space-y-4 sm:space-y-8 md:mx-0">
            {mainPosts?.slice(2).map((post) => (
              <div key={post._id}>
                <HeroArticle id={post._id} article={post} />
              </div>
            ))}
          </div>

          <VideoCard />
        </div>

        <div className="sticky top-4 hidden flex-col items-start lg:flex">
          <Weather />
          {rightPosts?.length > 0 && <RightSideBar trendingNews={rightPosts} />}
        </div>
      </main>

      <div className="fixed bottom-8 right-3">
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

export default HomePage;

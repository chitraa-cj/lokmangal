import { useLocation, useParams } from "react-router-dom";
import { useNewsPosts } from "../hooks/useApi";
import { X } from "lucide-react";
import HeroArticle from "../components/HeroArticle";
import ScrollableGrid from "../components/ScrollableGrid";
import VideoCard from "../components/VideoCard";
import RightSideBar from "../components/RightSideBar";
import LeftSideBar from "../components/LeftSideBar";
import Loader from "../components/Loader";
import Error from "../components/Error";

const NewsArticlePage = () => {
  const { category } = useParams();
  const location = useLocation();
  const categoryNewsPosts = location.state?.mainPosts;

  const { data, isLoading, error } = useNewsPosts();

  // console.log(data);

  // Check if data is defined before destructuring
  let mainPosts = [],
    leftPosts = [],
    rightPosts = [],
    gridPosts = [];

  if (data) {
    ({
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

  return (
    <div className="flex min-w-full flex-col items-center justify-center bg-gray-100 px-2 pb-8 pt-2 sm:px-4 sm:pb-12 sm:pt-4">
      {/* Breaking News */}
      <div className="mb-4 flex w-full max-w-3xl items-center justify-between space-x-1 rounded-md bg-red-600 px-2 py-1 text-xs text-white shadow-md sm:mb-4 sm:space-x-2 sm:text-sm lg:rounded-full lg:px-4">
        <span className="font-bold">BREAKING NEWS</span>
        <span className="flex-1 items-center justify-center border-l pl-2 sm:pl-4 lg:truncate">
          JK: कठुआ जिले के बिलावर इलाके में मिले 3 लापता नागरिकों के शव - सूत्र
        </span>
      </div>

      <main className="relative flex items-start justify-center md:space-x-4 lg:space-x-6">
        <div className="sticky top-4 hidden flex-col items-end lg:flex">
          {leftPosts.length > 0 && <LeftSideBar leftNews={leftPosts} />}
        </div>

        <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-8">
          {mainPosts.length > 0 && (
            <HeroArticle id={mainPosts[0]._id} article={mainPosts[0]} />
          )}

          {gridPosts.length > 0 && (
            <ScrollableGrid gridPosts={gridPosts.slice(0, 6)} />
          )}

          {mainPosts.slice(1, 2).map((post) => (
            <div key={post._id}>
              <HeroArticle id={post._id} article={post} />
            </div>
          ))}

          {gridPosts.length > 6 && (
            <ScrollableGrid gridPosts={gridPosts.slice(6)} />
          )}

          {mainPosts.slice(2).map((post) => (
            <div key={post._id}>
              <HeroArticle id={post._id} article={post} />
            </div>
          ))}

          <VideoCard />
        </div>

        <div className="sticky top-4 hidden flex-col items-start lg:flex">
          {rightPosts.length > 0 && <RightSideBar trendingNews={rightPosts} />}
        </div>
      </main>
    </div>
  );
};

export default NewsArticlePage;

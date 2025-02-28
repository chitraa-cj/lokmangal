import { useLocation, useParams } from "react-router-dom";
import { useNewsPosts } from "../hooks/useApi";
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
    <div className="min-w-full bg-gray-100 px-4 pb-12 pt-4">
      <main className="relative flex items-start justify-center space-x-6">
        <div className="sticky top-4 hidden flex-col items-end lg:flex">
          {leftPosts.length > 0 && <LeftSideBar leftNews={leftPosts} />}
        </div>

        <div className="flex flex-col items-center justify-center space-y-8">
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

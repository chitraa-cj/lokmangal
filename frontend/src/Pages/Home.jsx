import { Link } from "react-router-dom";
import { useNewsPosts } from "../hooks/useApi";
import HeroArticle from "../components/HeroArticle";
import GridItem from "../components/GridItem";
import VideoCard from "../components/VideoCard";
import RightSideBar from "../components/RightSideBar";
import LeftSideBar from "../components/LeftSideBar";

const NewsArticlePage = () => {
  const { data: newsPosts, isLoading, error } = useNewsPosts();

  if (isLoading) {
    return (
      <p className="flex min-h-screen items-center justify-center bg-gray-100">
        Loading...
      </p>
    );
  }

  if (error) {
    return (
      <p className="flex min-h-screen items-center justify-center bg-gray-100">
        Error loading news articles.
      </p>
    );
  }

  // Sort posts based on position
  const sortedPosts = newsPosts.sort(
    (a, b) => (a.position || 0) - (b.position || 0),
  );

  const mainPosts = sortedPosts.filter((post) => post.articleType === "main");
  const leftPosts = sortedPosts.filter((post) => post.articleType === "left");
  const rightPosts = sortedPosts.filter((post) => post.articleType === "right");
  const gridPosts = sortedPosts.filter((post) => post.articleType === "grid");

  return (
    <div className="min-w-full bg-gray-100 px-4 pb-12">
      <main className="relative grid grid-cols-1 gap-x-3 lg:grid-cols-[25%_48%_25%]">
        <div className="hidden flex-col items-end lg:flex">
          {leftPosts.length > 0 && <LeftSideBar news={leftPosts} />}
        </div>

        <div className="flex flex-col items-center justify-center space-y-8 px-6">
          {mainPosts.length > 0 && (
            <HeroArticle
              id={mainPosts[0]._id}
              kicker1={mainPosts[0].category}
              kicker2={mainPosts[0].subCategory}
              heading={mainPosts[0].title}
              imgUrl={mainPosts[0].imgUrl}
              excerpt={mainPosts[0].excerpt}
            />
          )}

          <div className="min-w-3xl max-w-3xl">
            <Link to="/" className="block">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {gridPosts.map((post) => (
                  <GridItem key={post._id} title={post.title} />
                ))}
              </div>
            </Link>
          </div>

          {mainPosts.slice(1).map((post) => (
            <div key={post._id}>
              <HeroArticle
                id={post._id}
                kicker1={post.category}
                kicker2={post.subCategory}
                imgUrl={post.imgUrl}
                heading={post.title}
                excerpt={post.excerpt}
              />
            </div>
          ))}

          <VideoCard />
        </div>

        <div className="hidden flex-col items-start lg:flex">
          {rightPosts.length > 0 && <RightSideBar trendingNews={rightPosts} />}
        </div>
      </main>
    </div>
  );
};

export default NewsArticlePage;

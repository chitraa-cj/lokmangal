import { useNewsPosts } from "../hooks/useApi";
import { useLocation } from "react-router-dom";
import HeroArticle from "../components/HeroArticle";
import Grid from "../components/Grid";
import VideoCard from "../components/VideoCard";
import RightSideBar from "../components/RightSideBar";
import LeftSideBar from "../components/LeftSideBar";

const NewsArticlePage = () => {
  const location = useLocation();
  const newsPosts = location.state?.articles;

  if (!newsPosts) {
    return (
      <p className="flex min-h-screen items-center justify-center bg-gray-100">
        Error loading news articles.
      </p>
    );
  }

  return (
    <div className="min-w-full bg-gray-100 px-4 pb-12">
      <main className="relative grid grid-cols-1 gap-x-3 lg:grid-cols-[25%_45%_25%]">
        <div className="hidden flex-col items-end lg:flex">
          <LeftSideBar />
        </div>

        <div className="flex flex-col items-center justify-center space-y-8 px-6">
          {newsPosts.map((post, index) => (
            <div key={post._id}>
              <HeroArticle
                id={post._id}
                kicker1={post.category}
                kicker2={post.subCategory}
                imgUrl={post.imgUrl}
                heading={post.title}
                excerpt={post.excerpt}
              />
              {(index + 1) % 5 === 0 && <Grid />}
            </div>
          ))}

          <VideoCard />
        </div>

        <div className="hidden flex-col items-start lg:flex">
          <RightSideBar />
        </div>
      </main>
    </div>
  );
};

export default NewsArticlePage;

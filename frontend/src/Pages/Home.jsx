import { useNewsPosts } from "../hooks/useApi";
import { Link } from "react-router-dom";
import HeroArticle from "../components/HeroArticle";
import Grid from "../components/Grid";
import VideoCard from "../components/VideoCard";
import RightSideBar from "../components/RightSideBar";
import LeftSideBar from "../components/LeftSideBar";

const NewsArticlePage = () => {
  const { data: newsPosts, isLoading, error } = useNewsPosts();

  if (isLoading) {
    return (
      <p className="flex min-h-screen items-center justify-center">
        Loading...
      </p>
    );
  }

  if (error) {
    return (
      <p className="flex min-h-screen items-center justify-center">
        Error loading news articles.
      </p>
    );
  }

  return (
    <div className="min-w-full bg-gray-100 px-4 pb-12">
      <main className="relative grid grid-cols-1 gap-x-10 lg:grid-cols-[25%_45%_25%]">
        <div className="hidden flex-col items-end lg:flex">
          <LeftSideBar />
        </div>

        <div className="rounded-sm border border-gray-300 bg-white px-4 shadow-sm">
          {newsPosts.length > 0 && (
            <Link to={`/news/${newsPosts[0]._id}`}>
              <HeroArticle
                kicker1={newsPosts[0].category}
                kicker2={newsPosts[0].subCategory}
                heading={newsPosts[0].title}
                imgUrl={newsPosts[0].imgUrl}
                excerpt={newsPosts[0].excerpt}
              />
            </Link>
          )}
          <Grid redText={"महत्वपूर्ण-2024:"} text={"विशेष कवरेज"} />

          {newsPosts.slice(1).map((post) => (
            <Link to={`/news/${post._id}`} key={post._id}>
              <HeroArticle
                key={post._id}
                kicker1={post.category}
                kicker2={post.subCategory}
                imgUrl={post.imgUrl}
                heading={post.title}
                excerpt={post.excerpt}
              />
            </Link>
          ))}

          {/* <Grid /> */}

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

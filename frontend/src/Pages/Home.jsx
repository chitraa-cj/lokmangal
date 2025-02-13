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
      <p className="min-h-screen flex items-center justify-center">
        Loading...
      </p>
    );
  }

  if (error) {
    return (
      <p className="min-h-screen flex items-center justify-center">
        Error loading news articles.
      </p>
    );
  }

  return (
    <div className="min-w-full px-4 bg-stone-100 pb-12">
      <main className="grid grid-cols-[25%_45%_25%] gap-x-10 relative">
        <div className="flex flex-col items-end">
          <LeftSideBar />
        </div>

        <div className="min-w-3xl bg-white px-4 border border-gray-300 shadow-sm rounded-sm">
          {newsPosts.length > 0 && (
            <Link to={`/news/${newsPosts[0]._id}`}>
              <HeroArticle
                kicker1={newsPosts[0].category}
                kicker2={newsPosts[0].subCategory}
                heading={newsPosts[0].title}
                description={newsPosts[0].content}
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
                heading={post.title}
                description={post.content}
              />
            </Link>
          ))}

          <Grid />

          <VideoCard />
        </div>

        <div className="flex flex-col items-start">
          <RightSideBar />
        </div>
      </main>
    </div>
  );
};

export default NewsArticlePage;

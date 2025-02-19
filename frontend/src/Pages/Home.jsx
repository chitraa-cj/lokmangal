import { useNewsPosts } from "../hooks/useApi";
import HeroArticle from "../components/HeroArticle";
import Grid from "../components/Grid";
import VideoCard from "../components/VideoCard";
import RightSideBar from "../components/RightSideBar";
import LeftSideBar from "../components/LeftSideBar";

const NewsArticlePage = () => {
  const { data: newsPosts, isLoading, error } = useNewsPosts();

  if (isLoading) {
    return (
      <p className="flex min-h-screen items-center justify-center bg-gray-200">
        Loading...
      </p>
    );
  }

  if (error) {
    return (
      <p className="flex min-h-screen items-center justify-center bg-gray-200">
        Error loading news articles.
      </p>
    );
  }

  return (
    <div className="min-w-full bg-gray-200 px-4 pb-12">
      <main className="relative grid grid-cols-1 gap-x-10 lg:grid-cols-[25%_45%_25%]">
        <div className="hidden flex-col items-end lg:flex">
          <LeftSideBar />
        </div>

        <div className="flex flex-col items-center justify-center space-y-10 px-6">
          {newsPosts.length > 0 && (
            <HeroArticle
              id={newsPosts[0]._id}
              kicker1={newsPosts[0].category}
              kicker2={newsPosts[0].subCategory}
              heading={newsPosts[0].title}
              imgUrl={newsPosts[0].imgUrl}
              excerpt={newsPosts[0].excerpt}
            />
          )}
          <Grid redText={"महत्वपूर्ण-2024:"} text={"विशेष कवरेज"} />

          {newsPosts.slice(1).map((post) => (
            <HeroArticle
              id={post._id}
              key={post._id}
              kicker1={post.category}
              kicker2={post.subCategory}
              imgUrl={post.imgUrl}
              heading={post.title}
              excerpt={post.excerpt}
            />
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

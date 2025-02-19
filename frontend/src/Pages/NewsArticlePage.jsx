import { useParams } from "react-router-dom";
import { useNewsPostDetails } from "../hooks/useApi";
import HeroArticle from "../components/HeroArticleDetailed";
import Grid from "../components/Grid";
import VideoCard from "../components/VideoCard";

const NewsArticlePage = () => {
  const { id } = useParams();
  const { data: newsPost, isLoading, error } = useNewsPostDetails(id, false);

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

  // console.log(newsPost);

  return (
    <div className="flex w-full flex-col items-center justify-center bg-gray-100">
      <div className="max-w-3xl">
        {/* Main Content */}
        <main>
          <HeroArticle
            kicker1={newsPost.category}
            kicker2={newsPost.subCategory}
            // kicker3={newsPost.tags.join(", ")}
            imgUrl={newsPost.imgUrl}
            heading={newsPost.title}
            description={newsPost.content}
          />

          <div className="pt-5">
            <Grid redText={"Breaking News:"} text={"Special Coverage"} />
          </div>

          <div className="pb-8 pt-5">
            <VideoCard />
          </div>

          {/* Additional News Content */}
          {/* <HeroArticle
            heading={"Related News"}
            // description={"More updates soon..."}
          /> */}
        </main>
      </div>
    </div>
  );
};

export default NewsArticlePage;

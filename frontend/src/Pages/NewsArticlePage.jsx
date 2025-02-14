import { useParams } from "react-router-dom";
import { useNewsPostDetails } from "../hooks/useApi";
import HeroArticle from "../components/HeroArticle";
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

  console.log(newsPost);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Main Content */}
      <main>
        <HeroArticle
          kicker1={newsPost.category}
          kicker2={newsPost.subCategory}
          // kicker3={newsPost.tags.join(", ")}
          imgUrl={newsPost.imgUrl}
          heading={newsPost.title}
          excerpt={newsPost.excerpt}
          description={newsPost.content}
        />

        <Grid redText={"Breaking News:"} text={"Special Coverage"} />

        <VideoCard />

        {/* Additional News Content */}
        {/* <HeroArticle
          heading={"Related News"}
          // description={"More updates soon..."}
        /> */}
      </main>
    </div>
  );
};

export default NewsArticlePage;

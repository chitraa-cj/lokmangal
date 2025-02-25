import { useParams, useLocation } from "react-router-dom";
import { useNewsPostDetails } from "../hooks/useApi";
import HeroArticle from "../components/HeroArticleDetailed";
import VideoCard from "../components/VideoCard";
import RightSideBar from "../components/RightSideBar";

const NewsArticlePage = () => {
  const { id } = useParams();
  const location = useLocation();

  // Get the article from the location state if available
  const articleFromState = location.state?.article;

  const {
    data: newsPost,
    isLoading,
    error,
  } = useNewsPostDetails(id, articleFromState);

  if (isLoading) {
    return (
      <p className="flex min-h-screen items-center justify-center">
        Loading...
      </p>
    );
  }

  if (error || !newsPost) {
    return (
      <p className="flex min-h-screen items-center justify-center">
        Error loading news article. Please try again later.
      </p>
    );
  }

  // console.log(newsPost);

  return (
    <div className="flex w-full items-start justify-evenly bg-gray-100 pb-12">
      <div className="max-w-3xl">
        {/* Main Content */}
        <main>
          <HeroArticle article={newsPost} />

          <div className="pt-5">
            <VideoCard />
          </div>
        </main>
      </div>
      {/* <RightSideBar /> */}
    </div>
  );
};

export default NewsArticlePage;

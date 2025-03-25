import { useParams, useLocation } from "react-router-dom";
import { useNewsPostDetails } from "../hooks/useApi";
import HeroArticle from "../components/HeroArticleDetailed";
import VideoCard from "../components/VideoCard";
import RightSideBar from "../components/RightSideBar";
import Loader from "../components/Loader";
import Error from "../components/Error";

const NewsArticlePage = () => {
  const { type, id } = useParams();
  const location = useLocation();

  // Get the article from the location state if available
  const articleFromState = location.state?.article;

  const {
    data: newsPost,
    isLoading,
    error,
  } = useNewsPostDetails(type, id, articleFromState);
  // console.log(newsPost);

  if (isLoading) {
    return <Loader />;
  }

  if (error || !newsPost) {
    return <Error />;
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

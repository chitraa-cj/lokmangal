import { useParams, useLocation } from "react-router-dom";
import { useNewsPostDetails, useVideos } from "../hooks/useApi";
import { useEffect } from "react";
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

  const { data: videos, isLoading: isLinkLoading, isError } = useVideos();
  // console.log(newsPost);
  // console.log(videos, isLinkLoading, isError);

  useEffect(() => {
    let timeoutId;

    const trackView = async () => {
      const viewKey = `article_view_${id}`;
      const today = new Date().toDateString();
      const lastViewed = localStorage.getItem(viewKey);

      if (lastViewed !== today) {
        try {
          const response = await fetch(`/api/news/${id}/views`, {
            method: "POST",
          });
          if (response.ok) {
            localStorage.setItem(viewKey, today);
          } else {
            console.error("Failed to track view:", await response.text());
          }
        } catch (err) {
          console.error("View tracking error:", err.message || err);
        }
      }
    };

    if (!isLoading && newsPost) {
      timeoutId = setTimeout(trackView, 5000); // 5 seconds delay
    }

    return () => clearTimeout(timeoutId); // Cleanup on unmount
  }, [id, isLoading, newsPost]);

  if (isLoading) return <Loader />;
  if (error || !newsPost) return <Error />;

  return (
    <div className="flex w-full items-start justify-evenly bg-gray-100 pb-12">
      <div className="max-w-3xl">
        {/* Main Content */}
        <main>
          <HeroArticle article={newsPost} />

          <div className="pt-5">
            {/* Checking if there's a valid video URL */}
            {videos?.length > 0 && <VideoCard link={videos[0]?.url} />}
          </div>
        </main>
      </div>
      {/* <RightSideBar /> */}
    </div>
  );
};

export default NewsArticlePage;

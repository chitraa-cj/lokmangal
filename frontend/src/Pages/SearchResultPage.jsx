import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import HeroArticle from "../components/HeroArticle";
import VideoCard from "../components/VideoCard";
import Weather from "../components/Weather";
import FollowUs from "../components/FollowUs";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { useVideos } from "../hooks/useApi";

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialPage = parseInt(queryParams.get("page")) || 1;
  const searchQuery = queryParams.get("q");

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { data, isLoading: videosLoading, error: videosError } = useVideos();

  useEffect(() => {
    const fetchPosts = async () => {
      if (!searchQuery) {
        setError("Search query is required");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setPosts([]);

      try {
        const response = await axios.get("/api/news/search", {
          params: { q: searchQuery, page },
        });
        const data = response.data;

        setPosts(data.posts || []);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(
          err.response?.data?.message || "Error fetching search results",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [searchQuery, page]);

  useEffect(() => {
    setPage(1); // Reset to page 1 when search query changes
  }, [searchQuery]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("q", searchQuery);
    params.set("page", page);

    const newPath = `/search?${params.toString()}`;
    if (location.pathname + location.search !== newPath) {
      navigate(newPath, { replace: true });
    }
  }, [page, searchQuery, navigate, location]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Error message={error} />;
  if (!posts.length && !isLoading) {
    return (
      <p className="flex min-h-screen items-center justify-center bg-gray-100">
        No news articles found for "{searchQuery}".
      </p>
    );
  }

  return (
    <div className="flex w-full flex-col items-center overflow-x-hidden bg-gray-100 px-3 pb-8 pt-2 sm:px-4 sm:pb-12 sm:pt-4">
      <main className="relative flex w-full max-w-3xl items-start justify-center md:space-x-4 lg:space-x-6">
        <div className="sticky top-4 hidden h-fit w-[300px] flex-col items-end justify-end gap-y-6 lg:flex">
          <FollowUs />
        </div>

        <div className="flex w-full flex-col items-center justify-center space-y-4 sm:space-y-8">
          {posts.map((post) => (
            <div key={post._id}>
              <HeroArticle id={post._id} article={post} />
            </div>
          ))}
          <VideoCard link={data[0]?.url} />
        </div>

        <div className="sticky top-4 hidden w-80 flex-col items-start lg:flex">
          <Weather />
        </div>
        <div className="fixed bottom-10 left-8 hidden lg:block">
          <iframe
            className="h-auto w-48 rounded-lg shadow-lg"
            src={data[1]?.url}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </main>

      {totalPages > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="flex w-20 items-center justify-center rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 disabled:bg-gray-400"
          >
            Previous
          </button>
          <div className="flex flex-wrap justify-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={`w-10 rounded px-3 py-1 ${
                  p === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="flex w-20 items-center justify-center rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      )}

      {totalPages > 0 && (
        <p className="mt-2 text-center text-gray-600">
          Page {page} of {totalPages}
        </p>
      )}
    </div>
  );
};

export default SearchPage;

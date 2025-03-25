import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import HeroArticle from "../components/HeroArticle";
import VideoCard from "../components/VideoCard";
import Weather from "../components/Weather";
import FollowUs from "../components/FollowUs";
import Loader from "../components/Loader";
import Error from "../components/Error";

const CategoryHome = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get page from URL query params, default to 1
  const queryParams = new URLSearchParams(location.search);
  const initialPage = parseInt(queryParams.get("page")) || 1;

  const [categoryPosts, setCategoryPosts] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch posts when category or page changes
  useEffect(() => {
    const fetchCategoryPosts = async () => {
      if (!category) return;

      setIsLoading(true);
      setError(null);
      setCategoryPosts([]); // Reset posts when page or category changes

      try {
        const response = await axios.get(
          `/api/news/category/${encodeURIComponent(category)}?page=${page}`,
        );
        const data = response.data;

        setCategoryPosts(data.posts || []);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(
          err.response?.data?.message || "Error fetching category posts",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryPosts();
  }, [category, page]);

  // Update URL when page changes
  useEffect(() => {
    if (page !== initialPage) {
      navigate(`/category/${encodeURIComponent(category)}?page=${page}`, {
        replace: true,
      });
    }
  }, [page, category, navigate, initialPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Initial loading state
  if (isLoading) {
    return <Loader />;
  }

  // Error state
  if (error) {
    return <Error message={error} />;
  }

  // No posts found
  if (category && !categoryPosts.length && !isLoading) {
    return (
      <p className="flex min-h-screen items-center justify-center bg-gray-100">
        No news articles found for this category.
      </p>
    );
  }

  return (
    <div className="flex min-w-full flex-col items-center justify-center bg-gray-100 px-2 pb-8 pt-2 sm:px-4 sm:pb-12 sm:pt-4">
      <main className="relative flex items-start justify-center md:space-x-4 lg:space-x-6">
        <div className="sticky top-4 hidden flex-col items-end gap-y-6 lg:flex">
          <FollowUs />
        </div>

        <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-8">
          {categoryPosts.length > 0 && (
            <div className="mx-4 space-y-4 sm:space-y-8 md:mx-0">
              {categoryPosts.map((post) => (
                <div key={post._id}>
                  <HeroArticle id={post._id} article={post} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 0 && (
            <div className="mt-4 flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 disabled:bg-gray-400"
              >
                Previous
              </button>
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`rounded px-3 py-1 ${
                        p === page
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
              </div>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 disabled:bg-gray-400"
              >
                Next
              </button>
            </div>
          )}

          {/* Pagination Feedback */}
          {totalPages > 0 && (
            <p className="mt-2 text-gray-600">
              Page {page} of {totalPages}
            </p>
          )}

          <VideoCard />
        </div>

        <div className="sticky top-4 hidden w-80 flex-col items-start lg:flex">
          <Weather />
        </div>
      </main>

      <div className="fixed bottom-8 right-3">
        <iframe
          className="h-40 w-40 rounded-lg shadow-lg"
          src="https://www.youtube.com/embed/CDjD5gQjXQk?autoplay=1&mute=1&loop=1&playlist=CDjD5gQjXQk"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default CategoryHome;

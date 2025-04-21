import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import HeroArticle from "../components/HeroArticle";
import VideoCard from "../components/VideoCard";
import Weather from "../components/Weather";
import FollowUs from "../components/FollowUs";
import Loader from "../components/Loader";
import Error from "../components/Error";

const FilteredResultPage = () => {
  const { category, hashtag, footertag } = useParams(); // Add hashtag and footertag
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialPage = parseInt(queryParams.get("page")) || 1;

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState(""); // Track the type of search

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      setPosts([]);

      let url = "";
      let param = "";

      if (category) {
        setSearchType("category");
        url = `/api/news/category/${encodeURIComponent(category)}`;
        param = category;
      } else if (hashtag) {
        setSearchType("hashtag");
        url = `/api/news/hashtag/${encodeURIComponent(hashtag)}`;
        param = hashtag;
      } else if (footertag) {
        setSearchType("footertag");
        url = `/api/news/footertag/${encodeURIComponent(footertag)}`;
        param = footertag;
      } else {
        setError("Invalid search parameters");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(url, { params: { page } });
        const data = response.data;

        setPosts(data.posts || []);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [category, hashtag, footertag, page]);

  useEffect(() => {
    setPage(1); // Reset to page 1 whenever filter context changes
  }, [category, hashtag, footertag]);

  useEffect(() => {
    let basePath = "";
    const params = new URLSearchParams();

    if (searchType === "category" && category) {
      basePath = `/category/${encodeURIComponent(category)}`;
    } else if (searchType === "hashtag" && hashtag) {
      basePath = `/hashtag/${encodeURIComponent(hashtag)}`;
    } else if (searchType === "footertag" && footertag) {
      basePath = `/footer/${encodeURIComponent(footertag)}`;
    } else {
      console.log("No valid search type for navigation");
      return; // No valid search type, skip navigation
    }

    params.set("page", page); // Always set the page parameter

    const newPath = `${basePath}?${params.toString()}`;

    // console.log("Navigation update:", {
    //   current: location.pathname + location.search,
    //   new: newPath,
    // });

    if (location.pathname + location.search !== newPath) {
      navigate(newPath, { replace: true });
    }
  }, [page, category, hashtag, footertag, searchType, navigate, location]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      // console.log("Page changed to:", newPage);
    } else {
      // console.log("Invalid page change attempted:", newPage);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Error message={error} />;
  if (!posts.length && !isLoading) {
    return (
      <p className="flex min-h-screen items-center justify-center bg-gray-100">
        No news articles found for this {searchType}.
      </p>
    );
  }

  return (
    <div className="flex min-w-full flex-col items-center justify-center bg-gray-100 px-4 pb-8 pt-2 sm:pb-12 sm:pt-4">
      <main className="relative flex items-start justify-center md:space-x-4 lg:space-x-6">
        <div className="sticky top-4 hidden h-fit w-[300px] flex-col items-end justify-end gap-y-6 lg:flex">
          <FollowUs />
        </div>

        <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-8">
          {posts.length > 0 &&
            posts.map((post) => (
              <div key={post._id}>
                <HeroArticle id={post._id} article={post} />
              </div>
            ))}

          <VideoCard />
        </div>

        <div className="sticky top-4 hidden w-80 flex-col items-start lg:flex">
          <Weather />
        </div>
      </main>

      {/* Pagination Controls */}
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

      {/* Pagination Feedback */}
      {totalPages > 0 && (
        <p className="mt-2 text-center text-gray-600">
          Page {page} of {totalPages}
        </p>
      )}

      <div className="fixed bottom-10 left-8 hidden lg:block">
        <iframe
          className="h-auto w-48 rounded-lg shadow-lg"
          // src={data?.videos[1]?.url}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default FilteredResultPage;

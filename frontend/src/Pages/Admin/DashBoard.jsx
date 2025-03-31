import { Edit, Trash } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import {
  useDeleteNewsPostMutation,
  useAdminNewsPosts,
} from "../../hooks/useApi";
import Loader from "../../components/Loader";
import Error from "../../components/Error";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import axios from "axios";

const StatCard = ({ title, value }) => (
  <div className={`rounded-lg bg-white p-6 shadow`}>
    <div className="flex flex-col items-center justify-center">
      <h3 className="mb-2 text-3xl font-bold">{value}</h3>
      <p className="text-gray-600">{title} </p>
    </div>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="mt-4 flex justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:opacity-50"
      >
        Previous
      </button>
      <span className="px-4 py-2">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

const NewsTable = ({ news, onEdit, onDelete }) => {
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  console.log(news);
  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent News</h2>
      </div>
      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3 text-left uppercase">IMAGE</th>
              <th className="px-4 py-3 text-left uppercase">TITLE</th>
              <th className="px-4 py-3 text-left uppercase">Writer</th>
              <th className="px-4 py-3 text-left uppercase">Category</th>
              <th className="px-4 py-3 text-left uppercase">VIEWS</th>
              <th className="px-4 py-3 text-left uppercase">DATE</th>
              <th className="px-4 py-3 text-left uppercase">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {news.map((item) => (
              <tr key={item._id} className="order-b hover:bg-gray-100">
                <td className="px-4 py-3">
                  <Link to={`/${item.articleType}/${item._id}`}>
                    <img
                      src={item.imgUrl}
                      alt={stripHtml(item.title)}
                      className="w-28 rounded object-cover"
                    />
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Link
                    to={`/${item.articleType}/${item._id}`}
                    className="hover:text-blue-800 hover:underline"
                  >
                    <div dangerouslySetInnerHTML={{ __html: item.title }} />
                  </Link>
                </td>
                <td className="px-4 py-3">{item.userName}</td>
                <td className="px-4 py-3 font-semibold uppercase">
                  {item.articleType}
                </td>
                <td className="px-4 py-3">{item.views}</td>
                <td className="px-4 py-3">
                  {new Date(item.createdAt).toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(item);
                      }}
                      className="rounded-full p-2 text-blue-600 hover:bg-blue-100"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item._id);
                      }}
                      className="rounded-full p-2 text-red-600 hover:bg-red-100"
                    >
                      <Trash size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalSearchResults, setTotalSearchResults] = useState(null); // New state for total search results
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const deleteNewsMutation = useDeleteNewsPostMutation();
  const { data: newsData, refetch } = useAdminNewsPosts({ page });

  const fetchSearchResults = async (query, pageNum) => {
    if (!query.trim()) return; // Don't search if query is empty

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/news/search", {
        params: {
          q: query,
          page: pageNum,
          limit: 100,
        },
      });
      setPosts(response.data.posts || []);
      setTotalPages(response.data.totalPages || 0);
      setTotalSearchResults(response.data.totalPosts || 0); // Update total search results
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching search results");
      setPosts([]);
      setTotalSearchResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Set posts directly from newsData when there's no search query
  useEffect(() => {
    if (!searchQuery.trim() && newsData) {
      setPosts(newsData.posts || []); // Assuming newsData now has a 'posts' array
      setTotalPages(Math.ceil(newsData.pagination.totalItems / 100));
      setTotalSearchResults(null); // Reset search results count when no search
    }
  }, [newsData, page, searchQuery]);

  const stats = {
    totalNews: newsData?.pagination?.totalItems || 0,
    activeNews: newsData?.pagination?.totalItems || 0,
    searchResults: totalSearchResults !== null ? totalSearchResults : null,
    writers: 1,
  };

  const handleEdit = (news) => {
    navigate("/admin/add-new", { state: { news } });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await deleteNewsMutation.mutateAsync(id);
        refetch();
        if (searchQuery.trim()) {
          fetchSearchResults(searchQuery, page);
        }
      } catch (error) {
        console.error("Error deleting article:", error);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setPage(1); // Reset to first page on new search
      fetchSearchResults(searchQuery, 1);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    if (searchQuery.trim()) {
      fetchSearchResults(searchQuery, newPage);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Error />;

  return (
    <div className="min-h-screen w-full bg-gray-100 p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <form onSubmit={handleSearch} className="flex items-center py-2 pr-1">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search News Articles"
              className="rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <Search size={16} className="text-gray-600" />
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <StatCard title="Total News" value={stats.totalNews} />
        <StatCard title="Active News" value={stats.activeNews} />
        <StatCard title="Search Results" value={stats.searchResults || 0} />
        <StatCard
          title="Writers"
          value={stats.writers}
          className="bg-blue-50"
        />
        {/* <StatCard
          title="Pending News"
          value={stats.pendingNews}
          key="pendingNews"
        /> */}
        {/* <StatCard
          title="DeActive news"
          value={stats.deActiveNews}
          key="deActiveNews"
        /> */}
      </div>

      <NewsTable
        news={posts || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {totalPages > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default Dashboard;

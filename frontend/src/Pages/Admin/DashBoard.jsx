import { Edit, Trash } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import {
  useDeleteNewsPostMutation,
  useAdminNewsPosts,
} from "../../hooks/useApi";
import Loader from "../../components/Loader";
import Error from "../../components/Error";
import { useState } from "react";

const StatCard = ({ title, value, className = "" }) => (
  <div className={`${className} rounded-lg bg-white p-6 shadow`}>
    <div className="flex flex-col items-center justify-center">
      <h3 className="mb-2 text-3xl font-bold">{value}</h3>
      <p className="text-gray-600">
        <div dangerouslySetInnerHTML={{ __html: title }} />
      </p>
    </div>
  </div>
);

const Pagination = ({ pagination, onPageChange }) => {
  const { currentPage, totalPages } = pagination;

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

  // const navigate = useNavigate();
  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent News</h2>
        {/* <button className="text-blue-600 hover:text-blue-800">View all</button> */}
      </div>
      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3 text-left uppercase">IMAGE</th>
              <th className="px-4 py-3 text-left uppercase">TITLE</th>
              <th className="px-4 py-3 text-left uppercase">Conclusion</th>
              <th className="px-4 py-3 text-left uppercase">type</th>
              {/* <th className="px-4 py-3 text-left uppercase">Category</th> */}
              <th className="px-4 py-3 text-left uppercase">DATE</th>
              {/* <th className="px-4 py-3 text-left uppercase">STATUS</th> */}
              <th className="px-4 py-3 text-left uppercase">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {news.map((item) => (
              <tr
                key={item._id}
                className="order-b hover:bg-gray-100"
                // onClick={() => navigate(`/news/${item._id}`)}
              >
                <td className="px-4 py-3">
                  {/* <Link to={`/news/${item._id}`}> */}
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
                    {/* {item.title} */}
                  </Link>
                </td>
                <td className="px-4 py-3">{item.conclusion}</td>
                <td className="px-4 py-3 font-semibold uppercase">
                  {item.articleType}
                </td>
                {/* <td className="py-3 px-4">{item.category}</td> */}
                {/* <td className="py-3 px-4 max-w-xs truncate">
                {item.description}
              </td> */}
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
                      className="rounded-full p-2 text-blue-600 hover:bg-blue-100 hover:text-blue-800"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item._id);
                      }}
                      className="rounded-full p-2 text-red-600 hover:bg-red-100 hover:text-red-800"
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
  const navigate = useNavigate();
  const deleteNewsMutation = useDeleteNewsPostMutation();

  // Modify the useNewsPosts hook to accept page parameter
  const {
    data: newsData,
    isLoading,
    error,
    refetch,
  } = useAdminNewsPosts({ page });

  // console.log(newsData);

  let transformedNewsData = [];

  if (newsData) {
    transformedNewsData = [
      ...(newsData.breakingNews || []),
      ...(newsData.main || []),
      ...(newsData.left || []),
      ...(newsData.right || []),
      ...(newsData.grid || []),
    ];
  }

  const stats = {
    totalNews: newsData?.pagination?.totalItems || 0,
    // pendingNews: transformedNewsData?.filter((n) => n.status === "pending").length || 0,
    // activeNews: transformedNewsData?.filter((n) => n.status === "active").length || 0,
    activeNews: newsData?.pagination?.totalItems || 0,
    // deActiveNews: transformedNewsData?.filter((n) => n.status === "inactive").length || 0,
    writers: 1,
  };

  const handleEdit = (news) => {
    navigate("/admin/add-new", { state: { news } });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await deleteNewsMutation.mutateAsync(id);
        refetch(); // Refresh the data after deletion
      } catch (error) {
        console.error("Error deleting article:", error);
      }
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (isLoading) return <Loader />;
  if (error) return <Error />;

  return (
    <div className="min-h-screen w-full bg-gray-100 p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="relative">
          <input
            type="search"
            placeholder="Search News Articles"
            className="rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3">
        <StatCard title="Total news" value={stats.totalNews} key="totalNews" />
        {/* <StatCard
          title="Pending News"
          value={stats.pendingNews}
          key="pendingNews"
        /> */}
        <StatCard
          title="Active News"
          value={stats.activeNews}
          key="activeNews"
        />
        {/* <StatCard
          title="DeActive news"
          value={stats.deActiveNews}
          key="deActiveNews"
        /> */}
        <StatCard
          title="Writers"
          value={stats.writers}
          className="bg-blue-50"
          key="writers"
        />
      </div>

      <NewsTable
        news={transformedNewsData || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {newsData?.pagination && (
        <Pagination
          pagination={newsData.pagination}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default Dashboard;

import { Eye, Edit, Trash2 } from "lucide-react";
import {
  useCreateNewsPostMutation,
  useUpdateNewsPostMutation,
  useDeleteNewsPostMutation,
  useNewsPosts,
} from "../../hooks/useApi";

const StatCard = ({ title, value, className = "" }) => (
  <div className={`${className} rounded-lg bg-white p-6 shadow`}>
    <div className="flex flex-col items-center justify-center">
      <h3 className="mb-2 text-3xl font-bold">{value}</h3>
      <p className="text-gray-600">{title}</p>
    </div>
  </div>
);

const NewsTable = ({ news, onUpdate, onDelete }) => (
  <div className="mt-8">
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-xl font-semibold">Recent News</h2>
      {/* <button className="text-blue-600 hover:text-blue-800">View all</button> */}
    </div>
    <div className="overflow-x-auto rounded-lg bg-white shadow">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left">IMAGE</th>
            <th className="px-4 py-3 text-left">TITLE</th>
            <th className="px-4 py-3 text-left">EXCERPT</th>
            {/* <th className="text-left py-3 px-4">CATEGORY</th> */}
            {/* <th className="text-left py-3 px-4">DESCRIPTION</th> */}
            <th className="px-4 py-3 text-left">DATE</th>
            {/* <th className="text-left py-3 px-4">STATUS</th> */}
            <th className="px-4 py-3 text-left">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {news.map((item, index) => (
            <tr key={index} className="border-b hover:bg-gray-100">
              {console.log(item)}
              <td className="px-4 py-3">
                <img
                  src={item.imgUrl}
                  alt={item.title}
                  className="w-28 rounded object-cover"
                />
              </td>
              <td className="px-4 py-3">{item.title}</td>
              <td className="px-4 py-3">{item.excerpt}</td>
              {/* <td className="py-3 px-4">{item.category}</td> */}
              {/* <td className="py-3 px-4 max-w-xs truncate">
                {item.description}
              </td> */}
              <td className="px-4 py-3">
                {new Date(item.createdAt).toLocaleDateString("en-IN")}
              </td>
              <td className="flex gap-2 px-4 py-3">
                <button
                  className="rounded-full p-2 text-blue-600 hover:bg-blue-50 hover:text-blue-800"
                  onClick={() => onUpdate(item)}
                >
                  <Edit size={20} />
                </button>
                <button
                  className="rounded-full p-2 text-red-600 hover:bg-red-50 hover:text-red-800"
                  onClick={() => onDelete(item._id)}
                >
                  <Trash2 size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const Dashboard = () => {
  const { data: newsData, isLoading, error } = useNewsPosts();
  const updateNewsPost = useUpdateNewsPostMutation();
  const deleteNewsPost = useDeleteNewsPostMutation();

  const handleUpdate = (newsItem) => {
    const newTitle = prompt("Enter new title", newsItem.title);
    if (newTitle) {
      updateNewsPost.mutate({ ...newsItem, title: newTitle });
    }
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this news post?")) {
      deleteNewsPost.mutate(id);
    }
  };

  const stats = {
    totalNews: newsData?.length || 0,
    // pendingNews: newsData?.filter((n) => n.status === "pending").length || 0,
    // activeNews: newsData?.filter((n) => n.status === "active").length || 0,
    activeNews: newsData?.length || 0,
    // deActiveNews: newsData?.filter((n) => n.status === "inactive").length || 0,
    writers: 1,
  };

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
        news={newsData || []}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Dashboard;

import { Eye } from "lucide-react";
import {
  useCreateNewsPostMutation,
  useUpdateNewsPostMutation,
  useDeleteNewsPostMutation,
  useNewsPosts,
} from "../../hooks/useApi";

const StatCard = ({ title, value, className = "" }) => (
  <div className={`${className} p-6 bg-white rounded-lg shadow`}>
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-3xl font-bold mb-2">{value}</h3>
      <p className="text-gray-600">{title}</p>
    </div>
  </div>
);

const NewsTable = ({ news }) => (
  <div className="mt-8">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Recent News</h2>
      {/* <button className="text-blue-600 hover:text-blue-800">View all</button> */}
    </div>
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4">TITLE</th>
            <th className="text-left py-3 px-4">IMAGE</th>
            <th className="text-left py-3 px-4">CATEGORY</th>
            <th className="text-left py-3 px-4">DESCRIPTION</th>
            <th className="text-left py-3 px-4">DATE</th>
            <th className="text-left py-3 px-4">STATUS</th>
            <th className="text-left py-3 px-4">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {news.map((item, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">{item.title}</td>
              <td className="py-3 px-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-12 h-8 object-cover rounded"
                />
              </td>
              <td className="py-3 px-4">{item.category}</td>
              <td className="py-3 px-4 max-w-xs truncate">
                {item.description}
              </td>
              <td className="py-3 px-4">
                {new Date(item.date).toLocaleDateString()}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    item.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {item.status}
                </span>
              </td>
              <td className="py-3 px-4">
                <button className="p-2 text-green-600 hover:text-green-800 rounded-full hover:bg-green-50">
                  <Eye size={20} />
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

  const stats = {
    totalNews: newsData?.length || 0,
    pendingNews: newsData?.filter((n) => n.status === "pending").length || 0,
    // activeNews: newsData?.filter((n) => n.status === "active").length || 0,
    activeNews: 9,
    deActiveNews: newsData?.filter((n) => n.status === "inactive").length || 0,
    writers: 1,
  };

  if (isLoading) {
    return (
      <p className="min-h-screen flex items-center justify-center">
        Loading...
      </p>
    );
  }

  if (error) {
    return (
      <p className="min-h-screen flex items-center justify-center">
        Error loading news articles.
      </p>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="relative">
          <input
            type="search"
            placeholder="search"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
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

      <NewsTable news={newsData || []} />
    </div>
  );
};

export default Dashboard;

import { Eye } from "lucide-react";
import {
  useCreateNewsPostMutation,
  useUpdateNewsPostMutation,
  useDeleteNewsPostMutation,
  useNewsPosts,
} from "../../hooks/useApi";
import { act } from "react";

const StatCard = ({ title, value, className = "" }) => (
  <div className={`${className} rounded-lg bg-white p-6 shadow`}>
    <div className="flex flex-col items-center justify-center">
      <h3 className="mb-2 text-3xl font-bold">{value}</h3>
      <p className="text-gray-600">{title}</p>
    </div>
  </div>
);

const NewsTable = ({ news }) => (
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
            {/* <th className="text-left py-3 px-4">ACTION</th> */}
          </tr>
        </thead>
        <tbody>
          {news.map((item, index) => (
            <tr key={index} className="border-b hover:bg-stone-100">
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
              {/* <td className="py-3 px-4">
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
              </td> */}
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
    <div className="min-h-screen w-full bg-stone-100 p-8">
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

      <NewsTable news={newsData || []} />
    </div>
  );
};

export default Dashboard;

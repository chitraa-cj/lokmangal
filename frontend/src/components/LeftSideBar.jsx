import { useNavigate } from "react-router-dom";

const LeftSidebar = ({ leftNews }) => {
  const navigate = useNavigate();

  const onClickNavigate = (article) => {
    navigate(`/${article.type}/${article._id}`, { state: { article } });
  };

  return (
    // <div className="h-fit w-[180px] rounded-lg bg-white shadow-lg">
    <div className="flex h-fit w-[300px] items-end justify-end">
      <div className="max-w-[180px] rounded-lg bg-white shadow-lg">
        <div className="relative">
          <h3 className="inline-block bg-white p-2 text-lg font-bold text-black">
            ताजा खबरें
          </h3>
          <div className="absolute right-0 top-5 h-[4px] w-20 bg-gray-300"></div>
        </div>
        {leftNews.map((article, index) => (
          <div key={index} className="flex flex-col gap-y-2 p-2">
            <h4
              className="cursor-pointer text-sm font-medium text-black"
              onClick={() => onClickNavigate(article)}
            >
              {article.title}
            </h4>
            <span className="text-xs text-gray-500">
              {(() => {
                const createdAt = new Date(article.createdAt);
                const now = new Date();
                const diffInSeconds = Math.floor((now - createdAt) / 1000);
                if (diffInSeconds < 86400) {
                  const hours = Math.floor(diffInSeconds / 3600);
                  const minutes = Math.floor((diffInSeconds % 3600) / 60);
                  if (hours > 0) return `${hours}h ago`;
                  if (minutes > 0) return `${minutes}m ago`;
                  return "Just now";
                }
                return createdAt.toLocaleDateString("en-IN");
              })()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftSidebar;

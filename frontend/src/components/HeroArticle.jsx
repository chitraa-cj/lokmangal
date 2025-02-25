import { Link } from "react-router-dom";
import Share from "../components/Share";

const HeroArticle = ({ article }) => {
  return (
    <div className="w-[434px] rounded-lg bg-white pt-4 shadow-lg">
      <div className="mb-3">
        <Link to={`/news/${article._id}`} className="no-underline">
          <h1 className="px-4 text-xl font-bold">{article.title}</h1>
        </Link>
      </div>

      <div className="mb-2 px-4 text-sky-400">{article.hashtags}</div>

      <Link to={`/news/${article._id}`} className="h-full w-full">
        <img
          src={article.imgUrl}
          alt={article.heading}
          className="object-fit mb-3 h-64 w-[700px] max-w-full bg-gray-300"
        />
      </Link>

      <div className="mb-4 flex max-w-none flex-col">
        <p className="line-clamp-3 overflow-hidden text-ellipsis px-4 text-base text-black">
          {article.conclusion}
        </p>
      </div>

      <div className="flex items-center justify-between border-y-2 p-3">
        <Link to={`/news/${article._id}`} className="no-underline">
          <span className="rounded-sm bg-blue-500 p-2 text-xs text-white hover:bg-blue-700">
            Read More
          </span>
        </Link>

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

      <div className="px-4">
        <Share />
      </div>
    </div>
  );
};

export default HeroArticle;

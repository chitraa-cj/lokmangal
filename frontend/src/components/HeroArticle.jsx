import { useNavigate } from "react-router-dom";
import Share from "../components/Share";

const HeroArticle = ({ article }) => {
  const navigate = useNavigate();

  const onClickNavigate = (article) => {
    navigate(`/news/${article._id}`, { state: { article } });
  };

  return (
    <div className="w-[434px] rounded-lg bg-white pt-4 shadow-lg">
      <div className="mb-3">
        <h1
          className="cursor-pointer px-4 text-xl font-bold"
          onClick={() => {
            onClickNavigate(article);
          }}
        >
          {article.title}
        </h1>
      </div>

      <div className="mb-2 px-4 text-sky-400">{article.hashtags}</div>

      <>
        <img
          src={article.imgUrl}
          alt={article.heading}
          className="object-fit mb-3 h-64 w-[700px] max-w-full cursor-pointer bg-gray-300"
          onClick={() => {
            onClickNavigate(article);
          }}
        />
      </>

      <div className="mb-4 flex max-w-none flex-col">
        <p className="line-clamp-3 overflow-hidden text-ellipsis px-4 text-base text-black">
          {article.conclusion}
        </p>
      </div>

      <div className="flex items-center justify-between border-y-2 p-3">
        <p
          className="cursor-pointer rounded-sm bg-blue-500 p-2 text-center text-xs text-white hover:bg-blue-700"
          onClick={() => {
            onClickNavigate(article);
          }}
        >
          Read More
        </p>

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

import { useNavigate } from "react-router-dom";
import Share from "../components/Share";

const HeroArticle = ({ article }) => {
  const navigate = useNavigate();

  const onClickNavigate = (article) => {
    navigate(`/${article.type}/${article._id}`, { state: { article } });
  };

  return (
    <div className="w-full rounded-lg bg-white pt-4 shadow-lg lg:max-w-[434px]">
      {/*  <div className="w-full rounded-lg bg-white pt-4 shadow-lg"> */}
      <div className="mb-3">
        <h1
          className="cursor-pointer px-2 text-xl font-bold md:px-4"
          onClick={() => {
            onClickNavigate(article);
          }}
        >
          {article.title}
        </h1>
      </div>

      <div className="mb-2 px-2 text-sky-400 md:px-4">
        {article.hashtags.map((tag, index) => (
          <span key={index} className="mr-3">
            {tag}
          </span>
        ))}
      </div>

      {/* <>
        <img
          src={article.imgUrl}
          alt={article.heading}
          // className="mb-3 w-full max-w-[700px] cursor-pointer object-contain"
          className="object-fit mb-3 max-w-full cursor-pointer"
          onClick={() => {
            onClickNavigate(article);
          }}
        />
      </> */}
      <div className="mb-4 flex flex-col">
        <p className="line-clamp-3 overflow-hidden text-ellipsis px-2 text-black md:px-4">
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

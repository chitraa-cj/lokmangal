import { useNavigate } from "react-router-dom";
import Share from "../components/Share";

const HeroArticle = ({ article }) => {
  const navigate = useNavigate();

  const onClickNavigate = (article) => {
    navigate(`/${article.type}/${article._id}`, { state: { article } });
  };

  return (
    <div className="mx-auto w-full rounded-lg bg-white pt-2 shadow-lg sm:max-w-[434px] sm:pt-4">
      <div className="mb-2 sm:mb-3">
        <h1
          className="cursor-pointer px-3 text-base font-bold sm:px-3 sm:text-lg md:px-4 md:text-xl"
          onClick={() => {
            onClickNavigate(article);
          }}
        >
          {article.title}
        </h1>
      </div>

      <div className="mb-2 px-3 text-xs text-sky-400 sm:text-base md:px-4">
        {article.hashtags.map((tag, index) => (
          <span key={index} className="mr-2 sm:mr-3">
            {tag}
          </span>
        ))}
      </div>

      <>
        <img
          src={article.imgUrl}
          alt={article.heading}
          className="mb-3 w-full cursor-pointer object-cover lg:h-80"
          onClick={() => {
            onClickNavigate(article);
          }}
        />
      </>

      <div className="mb-2 flex flex-col sm:mb-4">
        <p className="line-clamp-3 overflow-hidden text-ellipsis px-3 text-xs text-black sm:text-sm md:px-4 md:text-base">
          {article.conclusion}
        </p>
      </div>
      <div className="flex items-center justify-between border-y-2 p-3">
        <p
          className="cursor-pointer rounded-sm bg-blue-500 px-2 py-1 text-center text-xs text-white hover:bg-blue-700 sm:p-2 sm:text-sm"
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

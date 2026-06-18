import { useNavigate } from "react-router-dom";

const BreakingNews = ({ breakingNews }) => {
  const navigate = useNavigate();

  const onClickNavigate = (article) => {
    navigate(`/${article.articleType}/${article._id}`, { state: { article } });
  };

  // console.log(breakingNews);

  return (
    <div className="mb-6 flex w-full min-w-0 max-w-3xl items-center justify-between gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-xs text-white shadow-md sm:space-x-2 sm:text-sm lg:rounded-full lg:px-4">
      <span className="shrink-0 text-[10px] font-bold sm:text-xs md:text-xl">
        BREAKING NEWS
      </span>
      <span
        className="min-w-0 flex-1 cursor-pointer truncate border-l border-red-400 pl-2 text-sm font-semibold sm:pl-4 sm:text-lg"
        onClick={() => onClickNavigate(breakingNews[0])}
      >
        <span dangerouslySetInnerHTML={{ __html: breakingNews[0]?.title }} />
      </span>
    </div>
  );
};

export default BreakingNews;

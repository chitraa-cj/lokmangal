import { useNavigate } from "react-router-dom";

const BreakingNews = ({ breakingNews }) => {
  const navigate = useNavigate();

  const onClickNavigate = (article) => {
    navigate(`/${article.articleType}/${article._id}`, { state: { article } });
  };

  // console.log(breakingNews);

  return (
    <div className="mb-6 flex w-full max-w-3xl items-center justify-between space-x-1 rounded-lg bg-red-600 px-2 py-1.5 text-xs text-white shadow-md sm:space-x-2 sm:text-sm lg:rounded-full lg:px-4">
      <span className="font-bold md:text-xl">BREAKING NEWS</span>
      <span
        className="line-clamp-1 flex-1 cursor-pointer items-center justify-center border-l pl-2 text-lg font-semibold sm:pl-4"
        onClick={() => onClickNavigate(breakingNews[0])}
      >
        <span dangerouslySetInnerHTML={{ __html: breakingNews[0]?.title }} />
      </span>
    </div>
  );
};

export default BreakingNews;

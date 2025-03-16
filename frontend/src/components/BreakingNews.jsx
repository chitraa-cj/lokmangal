import { useNavigate } from "react-router-dom";

const BreakingNews = ({ breakingNews }) => {
  const navigate = useNavigate();

  const onClickNavigate = (article) => {
    navigate(`/${article.type}/${article._id}`, { state: { article } });
  };

  console.log(breakingNews);

  return (
    // <div className="mb-4 flex w-full max-w-2xl items-center justify-between space-x-1 rounded-md bg-red-600 p-2 text-xs text-white shadow-md sm:mb-4 sm:space-x-2 sm:text-sm lg:rounded-full lg:px-4">
    <div className="mb-4 flex w-full max-w-2xl items-center justify-between space-x-1 rounded-lg bg-red-600 p-2 text-xs text-white shadow-md sm:mb-4 sm:space-x-2 sm:text-sm lg:px-4">
      <span className="font-bold">BREAKING NEWS</span>
      <span
        className="flex-1 cursor-pointer items-center justify-center border-l pl-2 text-lg sm:pl-4 lg:truncate"
        onClick={() => onClickNavigate(breakingNews[0])}
      >
        {/* JK: कठुआ जिले के बिलावर इलाके में मिले 3 लापता नागरिकों के शव - सूत्र */}
        {breakingNews[0].title}
      </span>
    </div>
  );
};

export default BreakingNews;

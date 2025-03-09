import { useNavigate } from "react-router-dom";

const GridItem = ({ article }) => {
  const navigate = useNavigate();

  const onClickNavigate = (article) => {
    navigate(`/${article.type}/${article._id}`, { state: { article } });
  };

  return (
    <div className="flex h-auto w-[140px] flex-col items-center space-y-2 rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md sm:w-[160px] md:w-[180px]">
      <img
        src={article.imgUrl}
        alt={article.title}
        onClick={() => onClickNavigate(article)}
        className="h-24 w-full cursor-pointer rounded-t-lg object-cover sm:h-28 md:h-32"
      />
      <div className="flex h-full w-full flex-col items-center p-2">
        <h3
          className="line-clamp-3 cursor-pointer text-center text-xs sm:text-sm md:text-base"
          onClick={() => onClickNavigate(article)}
        >
          {article.title}
        </h3>
      </div>
    </div>
  );
};

export default GridItem;

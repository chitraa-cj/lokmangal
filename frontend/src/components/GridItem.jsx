import { useNavigate } from "react-router-dom";

const GridItem = ({ article }) => {
  const navigate = useNavigate();

  const onClickNavigate = (article) => {
    navigate(`/news/${article._id}`, { state: { article } });
  };

  return (
    <div className="flex h-auto w-[160px] flex-col items-center space-y-2 rounded-lg bg-white shadow-sm">
      <img
        src={article.imgUrl}
        alt={article.title}
        onClick={() => onClickNavigate(article)}
        className="h-28 w-[160px] cursor-pointer rounded-t-lg object-cover"
      />
      <div className="flex h-full flex-col items-center">
        <h3
          className="cursor-pointer break-normal px-2"
          onClick={() => onClickNavigate(article)}
        >
          {article.title}
        </h3>
      </div>
    </div>
  );
};

export default GridItem;

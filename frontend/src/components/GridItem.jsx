import { Link } from "react-router-dom";

const GridItem = ({ article }) => {
  return (
    <div className="flex h-72 w-[160px] flex-col items-center space-y-2 rounded-lg bg-white shadow-sm">
      <Link to={`/news/${article._id}`} className="no-underline">
        <img
          src={article.imgUrl}
          alt={article.title}
          className="h-28 w-[160px] rounded-t-lg object-cover"
        />
      </Link>
      <div className="flex h-full flex-col items-center">
        <Link to={`/news/${article._id}`} className="no-underline">
          <h3 className="break-normal px-2">{article.title}</h3>
        </Link>
      </div>
    </div>
  );
};
export default GridItem;

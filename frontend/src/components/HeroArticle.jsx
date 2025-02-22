import { Link } from "react-router-dom";
import Share from "../components/Share";

const HeroArticle = ({ id, heading, imgUrl, conclusion }) => {
  return (
    <div className="min-w-3xl w-full max-w-3xl rounded-lg bg-white py-4 shadow-lg">
      <div className="mb-3">
        <Link to={`/news/${id}`} className="no-underline">
          <h1 className="px-6 text-xl font-bold">{heading}</h1>
        </Link>
      </div>

      <Link to={`/news/${id}`} className="h-full w-full">
        <img
          src={imgUrl}
          alt={heading}
          className="mb-3 h-96 w-[700px] max-w-full bg-gray-300 object-cover"
        />
      </Link>

      <div className="px-6">
        <Share />
      </div>

      <div className="mb-4 flex max-w-none flex-col">
        <p className="px-6 text-base text-gray-700">{conclusion}</p>
      </div>

      <div className="mb-3 px-6">
        <Link to={`/news/${id}`} className="no-underline">
          <span className="rounded-sm bg-blue-500 px-4 py-2 text-white hover:bg-blue-700">
            Read More
          </span>
        </Link>
      </div>
    </div>
  );
};

export default HeroArticle;

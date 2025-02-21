import { Link } from "react-router-dom";
import Share from "../components/Share";

const HeroArticle = ({ id, heading, imgUrl, excerpt }) => {
  return (
    <div className="min-w-3xl unselectable max-w-3xl rounded-lg bg-white px-6 py-4 shadow-lg">
      <div className="mb-3">
        <Link to={`/news/${id}`} className="no-underline">
          <h1 className="text-xl font-bold">{heading}</h1>
        </Link>
      </div>

      <div className="mb-3 flex items-center justify-center">
        {/* <div className="w-full h-96 bg-gray-100 rounded"></div> */}
        <Link to={`/news/${id}`}>
          <img src={imgUrl} alt={heading} className="w-2xl h-96 rounded" />
        </Link>
      </div>

      {/* Share Buttons */}
      <Share />

      {/* Article Content */}
      <div className="mb-4 flex max-w-none flex-col">
        <p className="text-base text-gray-700">{excerpt}</p>
      </div>

      <div className="mb-3">
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

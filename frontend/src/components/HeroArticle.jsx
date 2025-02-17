import { Link } from "react-router-dom";

const HeroArticle = ({
  id,
  kicker1,
  kicker2,
  kicker3,
  heading,
  imgUrl,
  excerpt,
  description,
}) => {
  return (
    <div className="min-w-3xl unselectable my-2 rounded-sm border border-gray-300 bg-white p-4 px-6 shadow-sm">
      {/* Article Header */}
      <div className="mb-3 pt-2">
        {/* <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span className="text-red-600 cursor-pointer">{kicker1}</span>
          <span>|</span>
          <span className="text-gray-600 cursor-pointer">{kicker2}</span>
          <span>|</span>
          <span className="text-gray-600 cursor-pointer">{kicker3}</span>
        </div> */}
        <Link to={`/news/${id}`} className="no-underline">
          <h1 className="text-xl font-bold">{heading}</h1>
        </Link>
      </div>
      {/* Main Image / Placeholder */}
      <div className="mb-6">
        {/* <div className="w-full h-96 bg-gray-200 rounded"></div> */}
        <Link to={`/news/${id}`}>
          <img src={imgUrl} alt={heading} className="h-96 w-full rounded" />
        </Link>
      </div>
      {/* Article Content */}
      <div className="prose m-4 mt-0 max-w-none">
        <p className="text-base text-gray-700">{excerpt}</p>
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

import { Link } from "react-router-dom";

const HeroArticle = ({
  kicker1 = "Lorem ipsum dolor sit",
  kicker2 = "Lorem, ipsum dolor",
  kicker3 = "Lorem, ipsum dolor",
  heading = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat cum non ab.",
  description = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est nesciunt optio consequuntur in eos, quas ipsa consequatur perferendis dignissimos dolores quae, numquam repellat.",
}) => {
  return (
    <Link to="/article" className="block">
      {/* Article Header */}
      <div className="mb-6">
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span className="text-red-600 cursor-pointer">{kicker1}</span>
          <span>|</span>
          <span className="text-gray-600 cursor-pointer">{kicker2}</span>
          <span>|</span>
          <span className="text-gray-600 cursor-pointer">{kicker3}</span>
        </div>
        <h1 className="text-2xl font-bold mb-4">{heading}</h1>
      </div>
      {/* Main Image / Placeholder */}
      <div className="mb-6">
        <div className="w-full h-96 bg-gray-200 rounded"></div>
      </div>
      {/* Article Content */}
      <div className="prose max-w-none mb-8">
        <p className="mb-4">{description}</p>
      </div>
    </Link>
  );
};
export default HeroArticle;

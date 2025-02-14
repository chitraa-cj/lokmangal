const HeroArticle = ({
  kicker1,
  kicker2,
  kicker3,
  heading,
  imgUrl,
  excerpt,
  description,
}) => {
  return (
    <div className="min-w-3xl mb-2">
      {/* Article Header */}
      <div className="mb-3 pt-2">
        {/* <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span className="text-red-600 cursor-pointer">{kicker1}</span>
          <span>|</span>
          <span className="text-gray-600 cursor-pointer">{kicker2}</span>
          <span>|</span>
          <span className="text-gray-600 cursor-pointer">{kicker3}</span>
        </div> */}
        <h1 className="text-xl font-bold">{heading}</h1>
      </div>
      {/* Main Image / Placeholder */}
      <div className="mb-6">
        {/* <div className="w-full h-96 bg-gray-200 rounded"></div> */}
        <img src={imgUrl} alt={heading} className="h-96 w-full rounded" />
      </div>
      {/* Article Content */}
      <div className="prose m-4 mt-0 max-w-none">
        <p>{excerpt}</p>
      </div>
      {description && (
        <div className="prose m-4 mt-0 max-w-none">
          <p>{description}</p>
        </div>
      )}
    </div>
  );
};
export default HeroArticle;

import Share from "../components/Share";

const HeroArticle = ({
  kicker1,
  kicker2,
  kicker3,
  heading,
  imgUrl,
  description,
}) => {
  return (
    <div className="min-w-3xl unselectable mb-2">
      {/* Article Header */}
      <div className="mb-3 pt-2">
        <h1 className="text-xl font-bold">{heading}</h1>
      </div>

      {/* Main Image / Placeholder */}
      <div className="mb-6">
        <img src={imgUrl} alt={heading} className="h-96 w-full rounded" />
      </div>

      {/* Share Buttons */}
      <Share />

      {/* Article Content */}
      {description && (
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      )}
    </div>
  );
};

export default HeroArticle;

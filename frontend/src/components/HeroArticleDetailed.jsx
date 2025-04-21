import Share from "../components/Share";

const HeroArticle = ({ article }) => {
  return (
    <div className="min-w-3xl unselectable mb-2">
      {/* Article Header */}
      <div className="mb-3 pt-2">
        <h1 className="mx-3 text-xl font-bold md:mx-5 lg:mx-8">
          <div dangerouslySetInnerHTML={{ __html: article.title }} />
        </h1>
      </div>

      {/* Main Image / Placeholder */}
      {/* <div className="flex h-full w-full items-center justify-between"> */}
      <img
        src={article.imgUrl}
        alt={article.title}
        className="mx-auto mb-6 h-96 w-[700px] rounded bg-gray-300 object-cover"
      />
      {/* </div> */}

      {/* Share Buttons */}
      <Share title={article.title} />

      {/* Article Content */}
      <div className="prose mx-3 mt-6 max-w-none text-black md:mx-5 lg:mx-8">
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>
    </div>
  );
};

export default HeroArticle;

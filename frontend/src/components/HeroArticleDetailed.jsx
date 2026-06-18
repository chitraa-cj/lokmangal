// import Share from "../components/Share";

// const HeroArticleDetailed = ({ article }) => {
//   return (
//     <div className="min-w-3xl unselectable mb-2">
//       {/* Article Header */}
//       <div className="mb-3 pt-2">
//         <h1 className="mx-3 text-xl font-bold md:mx-5 lg:mx-8">
//           <div dangerouslySetInnerHTML={{ __html: article.title }} />
//         </h1>
//       </div>

//       {/* Main Image / Placeholder */}
//       {/* <div className="flex h-full w-full items-center justify-between"> */}
//       <img
//         src={article.imgUrl}
//         alt={article.title}
//         className="mx-auto mb-6 h-auto max-h-96 w-[700px] rounded bg-gray-300 object-cover"
//       />
//       {/* </div> */}

//       {/* Share Buttons */}
//       <Share title={article.title} />

//       {/* Article Content */}
//       <div className="prose mx-3 mt-6 max-w-none text-black md:mx-5 lg:mx-8">
//         <div dangerouslySetInnerHTML={{ __html: article.content }} />
//       </div>
//     </div>
//   );
// };

// export default HeroArticleDetailed;

import { Helmet } from "react-helmet-async";
import Share from "../components/Share";

const HeroArticleDetailed = ({ article }) => {
  const sanitizeTitle = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const imageUrl = article.imgUrl;
  const description = article.conclusion || "Read more on The Lok Mangal News";

  return (
    <div className="unselectable mb-2 w-full min-w-0 overflow-hidden">
      <Helmet>
        <title>{sanitizeTitle(article.title)} - The Lok Mangal News</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={sanitizeTitle(article.title)} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={sanitizeTitle(article.title)} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
      </Helmet>

      <div className="mb-3 px-4 pt-2">
        <h1 className="break-words text-xl font-bold">
          <div
            className="[&_*]:max-w-full [&_*]:break-words"
            dangerouslySetInnerHTML={{ __html: article.title }}
          />
        </h1>
      </div>

      <div className="mb-6 px-4">
        <img
          src={article.imgUrl}
          alt={article.title}
          className="mx-auto h-auto max-h-96 w-full rounded bg-gray-300 object-cover"
        />
      </div>

      <Share />

      <div className="prose mx-4 mt-6 max-w-none break-words text-black md:mx-5 lg:mx-8">
        <div
          className="[&_*]:max-w-full [&_img]:h-auto"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </div>
  );
};

export default HeroArticleDetailed;

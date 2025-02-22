import Share from "../components/Share";

const HeroArticle = ({ heading, imgUrl, content }) => {
  return (
    <div className="min-w-3xl unselectable mb-2">
      {/* Article Header */}
      <div className="mb-3 pt-2">
        <h1 className="text-xl font-bold">{heading}</h1>
      </div>

      {/* Main Image / Placeholder */}
      <img
        src={imgUrl}
        alt={heading}
        className="mb-6 h-96 w-[700px] rounded bg-gray-300 object-cover"
      />

      {/* Share Buttons */}
      <Share />

      {/* Article Content */}
      <div className="prose mt-6 max-w-none">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
};

export default HeroArticle;

// import Share from "../components/Share";

// const HeroArticle = ({ heading, imgUrl, content }) => {
//   return (
//     <div className="min-w-3xl unselectable mb-2">
//       {/* Article Header */}
//       <div className="mb-3 pt-2">
//         <h1 className="text-xl font-bold">{heading}</h1>
//       </div>

//       {/* Main Image / Placeholder */}
//       <div className="mb-6 flex aspect-[16/9] w-full items-center justify-center rounded bg-gray-100">
//         <img
//           src={imgUrl}
//           alt={heading}
//           className="h-full w-full rounded object-cover"
//         />
//       </div>

//       {/* Share Buttons */}
//       <Share />

//       {/* Article Content */}
//       {content && (
//         <div className="prose max-w-none">
//           <div dangerouslySetInnerHTML={{ __html: content }} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default HeroArticle;

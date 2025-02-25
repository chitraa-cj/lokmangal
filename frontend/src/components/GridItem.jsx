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

// const GridItem = ({ title, imgUrl }) => {
//   return (
//     <div className="flex w-60 flex-col items-center justify-center space-y-2 bg-white p-3">
//       <img src={imgUrl} alt="" className="h-40 w-full rounded object-cover" />
//       <p className="line-clamp-2 w-full text-center text-sm font-semibold">
//         {title}
//       </p>
//     </div>
//   );
// };
// export default GridItem;

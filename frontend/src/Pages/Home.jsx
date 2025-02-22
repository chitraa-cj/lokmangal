import { Link } from "react-router-dom";
import { useNewsPosts } from "../hooks/useApi";
import HeroArticle from "../components/HeroArticle";
import GridItem from "../components/GridItem";
import VideoCard from "../components/VideoCard";
import RightSideBar from "../components/RightSideBar";
import LeftSideBar from "../components/LeftSideBar";

const NewsArticlePage = () => {
  const { data: newsPosts, isLoading, error } = useNewsPosts();

  if (isLoading) {
    return (
      <p className="flex min-h-screen items-center justify-center bg-gray-100">
        Loading...
      </p>
    );
  }

  if (error) {
    return (
      <p className="flex min-h-screen items-center justify-center bg-gray-100">
        Error loading news articles.
      </p>
    );
  }

  // Sort posts based on position
  const sortedPosts = newsPosts.sort(
    (a, b) => (a.position || 0) - (b.position || 0),
  );

  const mainPosts = sortedPosts.filter((post) => post.articleType === "main");
  const leftPosts = sortedPosts.filter((post) => post.articleType === "left");
  const rightPosts = sortedPosts.filter((post) => post.articleType === "right");
  const gridPosts = sortedPosts.filter((post) => post.articleType === "grid");

  // console.log(mainPosts, leftPosts, rightPosts, gridPosts);

  return (
    <div className="min-w-full bg-gray-100 px-4 pb-12">
      <main className="relative grid grid-cols-1 gap-x-3 lg:grid-cols-[25%_48%_25%]">
        <div className="hidden flex-col items-end lg:flex">
          {leftPosts.length > 0 && <LeftSideBar leftNews={leftPosts} />}
        </div>

        <div className="flex flex-col items-center justify-center space-y-8 px-6">
          {mainPosts.length > 0 && (
            <HeroArticle
              id={mainPosts[0]._id}
              heading={mainPosts[0].title}
              imgUrl={mainPosts[0].imgUrl}
              conclusion={mainPosts[0].conclusion}
            />
          )}

          <div className="min-w-3xl max-w-3xl">
            <Link to="/" className="block">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {gridPosts.map((post) => (
                  <GridItem
                    key={post._id}
                    title={post.title}
                    imgUrl={post.imgUrl}
                    conclusion={post.conclusion}
                  />
                ))}
              </div>
            </Link>
          </div>

          {mainPosts.slice(1).map((post) => (
            <div key={post._id}>
              <HeroArticle
                id={post._id}
                imgUrl={post.imgUrl}
                heading={post.title}
                conclusion={post.conclusion}
              />
            </div>
          ))}

          <VideoCard />
        </div>

        <div className="hidden flex-col items-start lg:flex">
          {rightPosts.length > 0 && <RightSideBar trendingNews={rightPosts} />}
        </div>
      </main>
    </div>
  );
};

export default NewsArticlePage;

// import { Link } from "react-router-dom";
// import { useNewsPosts } from "../hooks/useApi";
// import HeroArticle from "../components/HeroArticle";
// import GridItem from "../components/GridItem";
// // import Grid from "../components/Grid";
// import VideoCard from "../components/VideoCard";
// import RightSideBar from "../components/RightSideBar";
// import LeftSideBar from "../components/LeftSideBar";

// const NewsArticlePage = () => {
//   const { data: newsPosts, isLoading, error } = useNewsPosts();

//   if (isLoading) {
//     return (
//       <p className="flex min-h-screen items-center justify-center bg-gray-100">
//         Loading...
//       </p>
//     );
//   }

//   if (error) {
//     return (
//       <p className="flex min-h-screen items-center justify-center bg-gray-100">
//         Error loading news articles.
//       </p>
//     );
//   }

//   return (
//     <div className="bg-customGray min-w-full px-4 pb-12">
//       <main className="relative grid grid-cols-1 gap-x-3 lg:grid-cols-[25%_48%_25%]">
//         <div className="hidden flex-col items-end lg:flex">
//           <LeftSideBar news={newsPosts} />
//         </div>

//         <div className="flex flex-col items-center justify-center space-y-8 px-6">
//           {newsPosts.length > 0 && (
//             <HeroArticle
//               id={newsPosts[0]._id}
//               kicker1={newsPosts[0].category}
//               kicker2={newsPosts[0].subCategory}
//               heading={newsPosts[0].title}
//               imgUrl={newsPosts[0].imgUrl}
//               excerpt={newsPosts[0].excerpt}
//             />
//           )}

//           <div className="min-w-3xl max-w-3xl">
//             <Link to="/" className="block">
//               <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//                 <GridItem
//                   title={
//                     "कांग्रेस महासचिव प्रियंका गांधी के बाद अब राहुल गांधी का बांकुड़ा दौरा"
//                   }
//                 />
//                 <GridItem
//                   title={
//                     "राजस्थान: BJP का नया प्रदेश अध्यक्ष कौन? सीपी जोशी की जगह"
//                   }
//                 />
//                 <GridItem
//                   title={
//                     "Delhi Elections: एमसीडी टैक्स में बढ़ोतरी पर भाजपा का विरोध"
//                   }
//                 />
//               </div>
//             </Link>
//           </div>

//           {newsPosts.slice(1).map((post, index) => (
//             <div key={post._id}>
//               <HeroArticle
//                 id={post._id}
//                 kicker1={post.category}
//                 kicker2={post.subCategory}
//                 imgUrl={post.imgUrl}
//                 heading={post.title}
//                 excerpt={post.excerpt}
//               />
//               {/* {(index + 1) % 5 === 0 && <Grid />} */}
//             </div>
//           ))}

//           <VideoCard />
//         </div>

//         <div className="hidden flex-col items-start lg:flex">
//           <RightSideBar trendingNews={newsPosts} />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default NewsArticlePage;

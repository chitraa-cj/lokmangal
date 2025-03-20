import { useNavigate } from "react-router-dom";

const GridItem = ({ article }) => {
  const navigate = useNavigate();

  const onClickNavigate = (article) => {
    navigate(`/${article.type}/${article._id}`, { state: { article } });
  };

  return (
    <>
      {/* <div className="flex h-auto w-[140px] flex-col items-center space-y-2 rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md sm:w-[160px] md:w-[180px]">
        <img
          src={article.imgUrl}
          alt={article.title}
          onClick={() => onClickNavigate(article)}
          className="h-24 w-full cursor-pointer rounded-t-lg object-cover sm:h-28 md:h-32"
        />
        <div className="flex h-full w-full flex-col items-center p-2">
          <h3
            className="line-clamp-3 cursor-pointer text-center text-xs sm:text-sm md:text-base"
            onClick={() => onClickNavigate(article)}
          >
            {article.title}
          </h3>
        </div>
     </div> */}
      <div className="media-element">
        <img
          src={article.imgUrl}
          alt={article.title}
          onClick={() => onClickNavigate(article)}
          className="rounded-sm"
        />
        <h3 onClick={() => onClickNavigate(article)} className="title">
          <div dangerouslySetInnerHTML={{ __html: article.title }} />
        </h3>
      </div>
    </>
  );
};

{
  /*
    <div class="media-element">
    <img src="https://images.unsplash.com/photo-1642190672487-22bde32965f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTY0MzM5ODcyOA&ixlib=rb-1.2.1&q=80&w=400" alt="">
    <p class="title">A longer title here</p>
  </div>
  */
}

export default GridItem;

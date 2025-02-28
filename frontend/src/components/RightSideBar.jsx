import { useNavigate } from "react-router-dom";

const RightSideBar = ({ trendingNews }) => {
  const navigate = useNavigate();

  const onClickNavigate = (article) => {
    navigate(`/${article.type}/${article._id}`, { state: { article } });
  };

  return (
    <div className="hidden w-[300px] lg:block">
      <div className="py-2 text-xl font-bold">ट्रेंडिंग</div>

      <div className="flex h-fit flex-col gap-y-4">
        {trendingNews.map((article, index) => (
          <div key={index} className="rounded-lg bg-white p-2 shadow-lg">
            <div className="flex gap-2">
              <div>
                <h4
                  onClick={() => onClickNavigate(article)}
                  className="cursor-pointer text-sm font-medium"
                >
                  {article.title}
                </h4>
                <p className="mt-3 text-xs text-gray-600">
                  {new Date(article.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
              <div className="flex h-full w-full items-start justify-start">
                <img
                  src={article.imgUrl}
                  className="h-[61px] w-[110px] cursor-pointer rounded-sm object-cover"
                  alt={article.title}
                  onClick={() => onClickNavigate(article)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightSideBar;

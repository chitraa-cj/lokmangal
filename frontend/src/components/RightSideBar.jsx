import { Link } from "react-router-dom";

const RightSideBar = ({ trendingNews }) => {
  return (
    <div className="top-4 hidden w-[300px] lg:sticky lg:block">
      <div className="py-2 text-xl font-bold">ट्रेंडिंग</div>

      <div className="flex h-fit flex-col gap-y-4">
        {trendingNews.map((news, index) => (
          <div key={index} className="rounded-lg bg-white p-2 shadow-lg">
            <div className="flex gap-2">
              <div>
                <Link to={`/news/${news._id}`} className="no-underline">
                  <h4 className="text-sm font-medium">{news.title}</h4>
                </Link>
                <p className="mt-3 text-xs text-gray-600">
                  {new Date(news.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
              <Link to={`/news/${news._id}`}>
                <div className="flex h-full w-full items-start justify-start">
                  <img
                    src={news.imgUrl}
                    className="h-[61px] w-[110px] rounded-sm object-cover"
                    alt={news.title}
                  />
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default RightSideBar;

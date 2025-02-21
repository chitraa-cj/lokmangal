const RightSideBar = ({ trendingNews }) => {
  return (
    <div className="top-4 hidden w-80 lg:sticky lg:block">
      <div className="py-2 text-xl font-bold">ट्रेंडिंग</div>

      <div className="h-fit rounded-lg bg-white p-4 shadow-lg">
        {trendingNews.map((news, index) => (
          <div key={index} className="border-b pb-4">
            <div className="flex items-center justify-center gap-2">
              <img src={news.imageUrl} className="w-20" alt={news.title} />
              <div>
                <h4 className="text-sm font-semibold">{news.title}</h4>
                <p className="mt-1 text-xs text-gray-600">{news.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default RightSideBar;

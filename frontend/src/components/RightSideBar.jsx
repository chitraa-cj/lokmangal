const RightSideBar = () => {
  return (
    <div className="lg:fixed lg:right-10 lg:top-1/4 lg:w-72 space-y-4">
      <div className="border-b pb-4">
        <div className="flex gap-2">
          <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0"></div>
          <div>
            <h4 className="text-sm font-semibold">
              IND vs ENG: भारी जीत के बाद फूला-फूला चेहरा बयां करता है बेंगलुरु
              टेस्ट का हाल
            </h4>
            <p className="text-xs text-gray-600 mt-1">4 February 2024</p>
          </div>
        </div>
      </div>
      <div className="border-b pb-4">
        <div className="flex gap-2">
          <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0"></div>
          <div>
            <h4 className="text-sm font-semibold">
              World Latest Cup 2024: विश्व कप की धूम! है क्रिकेट, खुशी अनंत,
              यहां मिलेगी हर खेल की अपडेट
            </h4>
            <p className="text-xs text-gray-600 mt-1">4 February 2024</p>
          </div>
        </div>
      </div>
      <div className="border-b pb-4">
        <div className="flex gap-2">
          <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0"></div>
          <div>
            <h4 className="text-sm font-semibold">
              Priyanka Chopra: भाई की शादी का अल्बम लेकर चली प्रियंका चोपड़ा,
              पैपराजी बोले- 'एक बार मुस्कुरा भी दीजिए'
            </h4>
            <p className="text-xs text-gray-600 mt-1">4 February 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RightSideBar;

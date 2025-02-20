const RightSideBar = () => {
  return (
    <div className="top-4 hidden w-80 lg:sticky lg:block">
      <div className="py-2 text-xl font-bold">ट्रेंडिंग</div>

      <div className="h-fit rounded-sm border border-gray-300 bg-white p-4 shadow-sm">
        <div className="border-b pb-4">
          <div className="flex items-center justify-center gap-2">
            {/* <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0"></div> */}
            <img
              src="https://staticimg.amarujala.com/assets/images/2025/02/13/gorakhpur-suicide_fac1e1e4474747907fe2ffd6bf8e8f58.jpeg?q=65&w=700"
              className="w-20"
              alt=""
            />
            <div>
              <h4 className="text-sm font-semibold">
                UP Suicide: दोपहर 12:01 पर बाहर आई... एक मिनट बाद कमरे में गई,
                12:05 पर पहुंची साथी छात्रा; CCTV में कैद अदिति
              </h4>
              <p className="mt-1 text-xs text-gray-600"> 13 Feb 2025</p>
            </div>
          </div>
        </div>
        <div className="border-b pb-4">
          <div className="flex items-center justify-center gap-2">
            {/* <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0"></div> */}
            <img
              src="https://staticimg.amarujala.com/assets/images/2024/08/21/ryan-ten-doeschate_a9cb1b650960528e052247412fcac21c.jpeg?w=674&dpr=1.0&q=65"
              className="w-20"
              alt=""
            />
            <div>
              <h4 className="text-sm font-semibold">
                IND vs ENG: भारी जीत के बाद फूला-फूला चेहरा बयां करता है
                बेंगलुरु टेस्ट का हाल
              </h4>
              <p className="mt-1 text-xs text-gray-600"> 11 Feb 2025</p>
            </div>
          </div>
        </div>
        <div className="border-b pb-4">
          <div className="flex items-center justify-center gap-2">
            <img
              src="https://staticimg.amarujala.com/assets/images/2025/02/12/bharata-bnama-igalda_8ee44543d7163d08ce47c7b4f84b11a5.jpeg?w=414&dpr=1.0&q=65"
              className="w-20"
              alt=""
            />
            <div>
              <h4 className="text-sm font-semibold">
                World Latest Cup 2024: विश्व कप की धूम! है क्रिकेट, खुशी अनंत,
                यहां मिलेगी हर खेल की अपडेट
              </h4>
              <p className="mt-1 text-xs text-gray-600">08 February 2024</p>
            </div>
          </div>
        </div>
        <div className="border-b pb-4">
          <div className="flex items-center justify-center gap-2">
            <img
              src="data:image/jpeg;base64,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"
              className="w-20"
              alt=""
            />
            <div>
              <h4 className="text-sm font-semibold">
                Priyanka Chopra: भाई की शादी का अल्बम लेकर चली प्रियंका चोपड़ा,
                पैपराजी बोले- 'एक बार मुस्कुरा भी दीजिए'
              </h4>
              <p className="mt-1 text-xs text-gray-600">05 February 2024</p>
            </div>
          </div>
        </div>
        <div className="border-b pb-4">
          <div className="flex items-center justify-center gap-2">
            <img
              src="https://staticimg.amarujala.com/assets/images/2025/02/13/pm-narendra-modi-security-agencies_a50ffb0b49c2fb127d049c6c88e50b6a.jpeg?q=65&w=160&dpr=1.3"
              className="w-20"
              alt=""
            />
            <div>
              <h4 className="text-sm font-semibold">
                अमेरिका में पीएम मोदी: विदेश में कैसे होती है भारत के
                प्रधानमंत्री की सुरक्षा, कौन संभालता है जिम्मेदारी
              </h4>
              <p className="mt-1 text-xs text-gray-600">24 February 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RightSideBar;

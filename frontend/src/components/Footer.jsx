const footer = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      {/* <header className="mb-6"> */}
      {/* <div className="flex items-center justify-between mb-4"> */}
      {/* <h1 className="text-4xl font-bold">लोक मंगल</h1> */}
      {/* </div> */}
      {/* </header> */}

      {/* Latest News Banner */}
      {/* <div className="bg-gray-100 p-4 mb-8 rounded">
        <h2 className="font-semibold mb-2">Latest News in Hindi</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          US Indians Deportation: सी-17 वैन्य विमान में भारतीयों को अमेरिका से
          वापस भेजे जाने की खबर; ट्रंप प्रशासन सख्त; Delhi Elections :
          मुख्यमंत्री आवासीय के दफ्तर में काम करने वाले कर्मचारी से 5 लाख कैश
          बरामद, पुलिस एक्शन में;
        </p>
      </div> */}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Column */}
        <div className="md:col-span-1">
          <h3 className="font-semibold mb-4">News From Indian States</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Madhya Pradesh News
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Uttar Pradesh News
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Rajasthan News
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Haryana News
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Bihar News
              </a>
            </li>
          </ul>
        </div>

        {/* Center Columns */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Lifestyle</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Health News
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Fitness News
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Fashion News
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Spirituality
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Entertainment News</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Bollywood News
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    TV Serials
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Hollywood News
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Movie Reviews
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-1">
          <div className="bg-red-600 p-4 rounded text-white text-center">
            {/* <img
              // src="/api/placeholder/150/50"
              alt="E-Paper"
              className="mx-auto mb-2 w-28 h-28"
            /> */}
            <div className="mx-auto h-36 w-36 bg-gray-200 rounded mb-4"></div>

            <h3 className="font-bold mb-2">Lorem ipsum dolor sit amet.!</h3>
            <button className="bg-white text-red-600 px-4 py-2 rounded font-semibold">
              Read E-Paper
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-wrap gap-2">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                About Us
              </a>
              <span className="text-gray-300">|</span>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Careers
              </a>
              <span className="text-gray-300">|</span>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Contact Us
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Subscribe</h4>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l"
              />
              <button className="bg-red-600 text-white px-6 py-2 rounded-r">
                Subscribe
              </button>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              © 2024-25 Lok Mangal Limited
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default footer;

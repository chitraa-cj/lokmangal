const footer = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
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
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {/* Left Column */}
        <div className="md:col-span-1">
          <h3 className="mb-4 font-semibold">News From Indian States</h3>
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
              <h3 className="mb-4 font-semibold">Lifestyle</h3>
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
              <h3 className="mb-4 font-semibold">Entertainment News</h3>
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
          <div className="rounded bg-red-600 p-4 text-center text-white">
            {/* <img
              // src="/api/placeholder/150/50"
              alt="E-Paper"
              className="mx-auto mb-2 w-28 h-28"
            /> */}
            <div className="mx-auto mb-4 h-36 w-36 rounded bg-gray-100"></div>

            <h3 className="mb-2 font-bold">Lorem ipsum dolor sit amet.!</h3>
            <button className="rounded bg-white px-4 py-2 font-semibold text-red-600">
              Read E-Paper
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 pt-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h4 className="mb-4 font-semibold">Quick Links</h4>
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
            <h4 className="mb-4 font-semibold">Subscribe</h4>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-l border border-gray-300 px-4 py-2"
              />
              <button className="rounded-r bg-red-600 px-6 py-2 text-white">
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

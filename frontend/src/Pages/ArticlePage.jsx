import React from "react";
import { Share2, ThumbsUp, MessageCircle } from "lucide-react";

const NewsPage = () => {
  return (
    <div className="max-w-2xl mx-auto p-4 font-sans">
      {/* Header */}
      <h1 className="text-xl md:text-2xl font-bold mb-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit
      </h1>

      {/* Metadata */}
      <div className="flex items-center text-gray-600 text-sm mb-4">
        <span className="mr-4">Lorem ipsum dolor sit amet</span>
      </div>

      {/* Main Image Placeholder */}
      <div className="mb-6 w-full">
        <div className="w-full h-[400px] bg-gray-200 rounded-lg flex items-center justify-center mb-2">
          <span className="text-gray-500">600 x 400</span>
        </div>
        <div className="text-sm text-gray-600 text-center">
          Lorem ipsum dolor sit amet
        </div>
      </div>

      {/* Share buttons */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <button className="p-2 rounded-full bg-blue-100 hover:bg-blue-200">
          <Share2 className="w-5 h-5 text-blue-600" />
        </button>
        <button className="p-2 rounded-full bg-blue-100 hover:bg-blue-200">
          <MessageCircle className="w-5 h-5 text-blue-600" />
        </button>
        <button className="p-2 rounded-full bg-blue-100 hover:bg-blue-200">
          <ThumbsUp className="w-5 h-5 text-blue-600" />
        </button>
      </div>

      {/* Article Content */}
      <div className="space-y-4 text-gray-800">
        <p className="leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
        <p className="leading-relaxed">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est
          laborum.
        </p>
      </div>

      {/* Trending Videos Section */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">Lorem Ipsum Videos</h2>
        <div className="space-y-4">
          {/* Video Cards */}
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-32 h-20 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-500">120 x 80</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                  </h3>
                  <span className="text-sm text-gray-600">Lorem News</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;

import { Share2, ThumbsUp, MessageCircle } from "lucide-react";

const NewsPage = () => {
  return (
    <div className="mx-auto max-w-2xl p-4 font-sans">
      {/* Header */}
      <h1 className="mb-4 text-xl font-bold md:text-2xl">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit
      </h1>

      {/* Metadata */}
      <div className="mb-4 flex items-center text-sm text-gray-600">
        <span className="mr-4">Lorem ipsum dolor sit amet</span>
      </div>

      {/* Main Image Placeholder */}
      <div className="mb-6 w-full">
        <div className="mb-2 flex h-[400px] w-full items-center justify-center rounded-lg bg-gray-100">
          <span className="text-gray-500">600 x 400</span>
        </div>
        <div className="text-center text-sm text-gray-600">
          Lorem ipsum dolor sit amet
        </div>
      </div>

      {/* Share buttons */}
      <div className="mb-6 flex flex-wrap gap-4">
        <button className="rounded-full bg-blue-100 p-2 hover:bg-blue-200">
          <Share2 className="h-5 w-5 text-blue-600" />
        </button>
        <button className="rounded-full bg-blue-100 p-2 hover:bg-blue-200">
          <MessageCircle className="h-5 w-5 text-blue-600" />
        </button>
        <button className="rounded-full bg-blue-100 p-2 hover:bg-blue-200">
          <ThumbsUp className="h-5 w-5 text-blue-600" />
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
        <h2 className="mb-4 text-lg font-bold">Lorem Ipsum Videos</h2>
        <div className="space-y-4">
          {/* Video Cards */}
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-lg border p-4 transition-shadow hover:shadow-lg"
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex h-20 w-full items-center justify-center rounded bg-gray-100 sm:w-32">
                  <span className="text-gray-500">120 x 80</span>
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 font-medium">
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

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, Search, MapPin, X } from "lucide-react";
import { useState } from "react";

//cspell:disable
// Fetch function for hashtags
const fetchHashtags = async () => {
  const { data } = await axios.get("/api/news/hashtags");
  return data.hashtags; // Return only the hashtags array
};

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState(""); // Added state for search
  const navigate = useNavigate();
  const location = useLocation();

  // Use TanStack Query to fetch hashtags
  const {
    data: hashtags,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["hashtags"], // Unique key for this query
    queryFn: fetchHashtags, // Fetch function
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep data in cache for 10 minutes
    retry: 1, // Retry once on failure
  });

  // console.log(hashtags);

  const handleCategoryClick = (category) => {
    if (category === "होम") {
      navigate("/");
    } else {
      navigate(`/category/${encodeURIComponent(category)}`);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&page=1`, {
        replace: true,
      });
      setSearchQuery(""); // Clear search after submitting
    }
  };

  const fallbackHashtags = [
    "#ब्रेकिंगन्यूज़",
    "#स्थानीयन्यूज़",
    "#टेकट्रेंड्स",
    "#स्वास्थ्यअद्यतन",
    "#खेलहाइलाइट्स",
    "#समुदाय",
    // "#अर्थव्यवस्था",
    // "#संस्कृति",
    // "#शिक्षा",
    // "#यात्रा",
  ];

  // Get current path and determine active category
  const currentPath = location.pathname;
  const categories = [
    "होम",
    "देश",
    "दुनियाँ",
    "प्रदेशक ख़बरें",
    "राजनीति",
    "अपराध",
    "खेल",
    "हमारा शहर",
    "मनोरंजन",
  ];

  const getActiveClass = (category) => {
    const isHome = category === "होम" && currentPath === "/";
    const isCategory =
      category !== "होम" &&
      currentPath === `/category/${encodeURIComponent(category)}`;
    return isHome || isCategory ? "lg:bg-[#e31e25]" : "";
  };

  return (
    <nav className="border-b-2 border-gray-300 shadow-sm">
      <div className="flex items-center justify-center bg-white">
        <div className="py-3">
          <Link to="/">
            <img src="./lokmangallogo_00.png" alt="logo" className="" />
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center bg-gray-800 lg:h-11">
        <div className="relative w-full px-0 text-white xl:max-w-[80vw] 2xl:max-w-[1350px]">
          <div className="flex items-center justify-between overflow-x-auto">
            <div className="absolute left-40 hidden lg:block">
              <Link to="/">
                <img src="./logo.gif" alt="logo" className="w-28" />
              </Link>
            </div>

            <div className="block lg:w-[211px]"></div>

            <div className={`flex items-center justify-center`}>
              <img
                src="./logo.gif"
                alt="logo"
                className="ml-8 w-16 lg:hidden"
              />

              {categories.map((item) => (
                <div
                  key={item}
                  className={`flex cursor-pointer items-center whitespace-nowrap p-2 pb-3 text-lg font-semibold tracking-wide transition-all duration-200 ease-in-out md:pb-2 ${getActiveClass(item)}`}
                  onClick={() => handleCategoryClick(item)}
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="ml-16 flex items-center justify-center md:ml-0">
              {/* Search Box */}
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="rounded-md bg-gray-700 p-2 py-1 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    <Search size={16} className="text-gray-400" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between overflow-x-auto bg-gray-100">
        <div className="mx-auto flex max-w-6xl items-center space-x-4 whitespace-nowrap px-4 py-2 text-sm font-medium">
          {isLoading
            ? // Show loading state or fallback while fetching
              fallbackHashtags.map((topic) => (
                <span
                  key={topic}
                  className="cursor-pointer text-red-600 transition-all"
                  onClick={() =>
                    navigate(`/hashtag/${encodeURIComponent(topic)}`)
                  }
                >
                  {topic}
                </span>
              ))
            : error
              ? // Show fallback on error
                fallbackHashtags.map((topic) => (
                  <span
                    key={topic}
                    className="cursor-pointer text-red-600 transition-all"
                    onClick={() =>
                      navigate(`/hashtag/${encodeURIComponent(topic)}`)
                    }
                  >
                    {topic}
                  </span>
                ))
              : // Show fetched hashtags
                hashtags?.map((topic) => (
                  <span
                    key={topic}
                    className="cursor-pointer text-red-600 transition-all"
                    onClick={() =>
                      navigate(`/hashtag/${encodeURIComponent(topic)}`)
                    }
                  >
                    {topic}
                  </span>
                ))}
        </div>
      </div>
    </nav>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, MapPin, X } from "lucide-react";
import { toast } from "react-toastify";

//cspell:disable

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Added state for search
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get("/api/users/verify");
        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [navigate]);

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

  return (
    <nav className="border-b-2 border-gray-300 shadow-sm">
      <div className="flex items-center justify-center bg-white">
        <div className="py-3">
          <Link to="/">
            <img src="./lokmangallogo_00.png" alt="logo" className="" />
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center bg-gray-800">
        <div className="relative w-full px-0 text-white xl:max-w-[80vw] 2xl:max-w-[1350px]">
          <div className="flex items-center justify-between overflow-x-auto">
            <div className="absolute hidden lg:block">
              <Link to="/">
                {/* <img src="./image.png" alt="logo" className="w-20" /> */}
                <img src="./logo.png" alt="logo" className="w-20" />
                {/* <img src="./lokmangal logo from YouTube channels4_profile.jpg" alt="logo" className="w-20" /> */}
              </Link>
            </div>

            <div className="block lg:w-[211px]"></div>

            <div
              className={`ml-0 flex items-center justify-center`}
              // className={`ml-0 flex items-center justify-center ${isAuthenticated ? "lg:ml-28" : "lg:ml-16"}`}
            >
              {[
                "होम",
                "देश",
                "दुनियाँ",
                "प्रदेशक ख़बरें",
                "राजनीति",
                "अपराध",
                "खेल",
                "हमारा शहर",
                "मनोरंजन",
              ].map((item) => (
                <div
                  key={item}
                  className="flex cursor-pointer items-center whitespace-nowrap p-2 px-3 text-sm font-semibold transition-all duration-200 ease-in-out hover:scale-105 hover:text-blue-300 focus:text-blue-300"
                  onClick={() => handleCategoryClick(item)}
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center">
              {/* Search Box */}
              <form
                onSubmit={handleSearch}
                className="flex items-center py-2 pr-1"
              >
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="rounded-md bg-gray-700 px-2 py-1 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="mx-auto flex max-w-6xl items-center space-x-4 whitespace-nowrap px-4 py-2 text-sm font-semibold">
          {[
            "#ब्रेकिंगन्यूज़",
            "#स्थानीयन्यूज़",
            "#टेकट्रेंड्स",
            "#स्वास्थ्यअद्यतन",
            "#खेलहाइलाइट्स",
            "#समुदाय",
            "#अर्थव्यवस्था",
            "#संस्कृति",
            "#शिक्षा",
            "#यात्रा",
          ].map((topic) => (
            <span
              key={topic}
              className="cursor-pointer text-red-600 transition-all"
              onClick={() =>
                navigate(`/hashtag/${encodeURIComponent(topic.slice(1))}`)
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

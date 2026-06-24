import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavbarLanguage } from "../context/NavbarLanguageContext";
import {
  NAV_CATEGORIES,
  CITY_OPTIONS,
  FALLBACK_HASHTAGS,
  getCategoryLabel,
  getCityLabel,
  getHashtagLabel,
} from "../utils/navConfig";

const fetchHashtags = async () => {
  const { data } = await axios.get("/api/news/hashtags");
  return data.hashtags;
};

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useNavbarLanguage();
  const navbarRef = useRef(null);

  const {
    data: hashtags,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["hashtags"],
    queryFn: fetchHashtags,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 1,
  });

  const handleCategoryClick = (categorySlug) => {
    if (!categorySlug) {
      navigate("/");
    } else {
      navigate(`/category/${encodeURIComponent(categorySlug)}`);
    }
    setIsCityDropdownOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&page=1`, {
        replace: true,
      });
      setSearchQuery("");
    }
  };

  const currentPath = location.pathname;

  const getActiveClass = (category) => {
    const isHome = category.id === "home" && currentPath === "/";
    const isCategory =
      category.categorySlug &&
      currentPath === `/category/${encodeURIComponent(category.categorySlug)}`;
    const isCityCategory =
      category.id === "cities" &&
      CITY_OPTIONS.some(
        (city) =>
          currentPath ===
          `/category/${encodeURIComponent(city.categorySlug)}`,
      );

    return isHome || isCategory || isCityCategory ? "lg:bg-[#e31e25]" : "";
  };

  const hashtagItems =
    !isLoading && !error && hashtags?.length
      ? hashtags.map((slug) => ({
          slug,
          label: getHashtagLabel(slug, language),
        }))
      : FALLBACK_HASHTAGS.map((tag) => ({
          slug: tag.slug,
          label: language === "hi" ? tag.hi : tag.en,
        }));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target) &&
        isCityDropdownOpen
      ) {
        setIsCityDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCityDropdownOpen]);

  const renderCityDropdown = () => (
    <div className="absolute left-0 top-full z-50 mt-1 min-w-[10.5rem] rounded-md border border-gray-600 bg-gray-700 py-1 shadow-lg">
      {CITY_OPTIONS.map((city) => (
        <button
          key={city.categorySlug}
          type="button"
          className="block w-full cursor-pointer whitespace-nowrap px-4 py-2.5 text-left text-sm text-white hover:bg-gray-600"
          onClick={() => handleCategoryClick(city.categorySlug)}
        >
          {getCityLabel(city, language)}
        </button>
      ))}
    </div>
  );

  const renderNavCategory = (category, variant = "desktop") => {
    const itemPadding =
      variant === "mobile"
        ? "px-3 py-2 text-base"
        : "px-2.5 py-2.5 text-base xl:px-3 xl:text-lg";

    if (category.hasDropdown) {
      return (
        <div
          key={category.id}
          className={`relative ${getActiveClass(category)}`}
        >
          <button
            type="button"
            className={`flex w-full cursor-pointer items-center whitespace-nowrap font-semibold tracking-wide transition-all duration-200 ease-in-out ${itemPadding}`}
            onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
          >
            {getCategoryLabel(category, language)}
            {isCityDropdownOpen ? (
              <ChevronUp size={16} className="ml-1" />
            ) : (
              <ChevronDown size={16} className="ml-1" />
            )}
          </button>
          {isCityDropdownOpen && renderCityDropdown()}
        </div>
      );
    }

    return (
      <button
        key={category.id}
        type="button"
        className={`flex cursor-pointer items-center whitespace-nowrap font-semibold tracking-wide transition-all duration-200 ease-in-out ${itemPadding} ${getActiveClass(category)}`}
        onClick={() => handleCategoryClick(category.categorySlug)}
      >
        {getCategoryLabel(category, language)}
      </button>
    );
  };

  return (
    <nav
      ref={navbarRef}
      className="relative z-30 w-full max-w-[100vw] border-b-2 border-gray-300 shadow-sm"
    >
      <div className="relative z-30 flex items-center justify-center overflow-visible bg-gray-800 lg:min-h-12">
        <div className="relative mx-auto w-full overflow-visible px-0 text-white xl:max-w-[80vw] 2xl:max-w-[1350px]">
          {/* Mobile: logo + search on one row, categories scroll separately */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between px-3 py-2">
              <img
                src="/logo.gif"
                alt="Company Logo"
                onClick={() => navigate("/")}
                className="w-14 cursor-pointer"
              />
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-36 rounded-md bg-gray-700 p-2 py-1 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-44"
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
            <div className="overflow-x-auto overflow-y-visible">
              <div className="flex w-max min-w-full items-center px-2 pb-2">
                {NAV_CATEGORIES.map((category) =>
                  renderNavCategory(category, "mobile"),
                )}
              </div>
            </div>
          </div>

          {/* Desktop layout: logo | centered categories | search */}
          <div className="hidden items-center justify-between gap-4 overflow-visible px-4 lg:flex">
            <Link to="/" className="shrink-0">
              <img src="/logo.gif" alt="logo" className="w-24 xl:w-28" />
            </Link>

            <div className="flex flex-1 items-center justify-center overflow-visible">
              {NAV_CATEGORIES.map((category) =>
                renderNavCategory(category, "desktop"),
              )}
            </div>

            <form onSubmit={handleSearch} className="flex shrink-0 items-center">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-40 rounded-md bg-gray-700 p-2 py-1.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 xl:w-48"
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

      <div className="relative z-10 w-full overflow-x-auto bg-gray-100">
        <div className="mx-auto flex w-max min-w-full max-w-6xl items-center space-x-4 whitespace-nowrap px-4 py-2 text-sm font-medium">
          {hashtagItems.map((topic) => (
            <span
              key={topic.slug}
              className="cursor-pointer text-red-600 transition-all"
              onClick={() =>
                navigate(`/hashtag/${encodeURIComponent(topic.slug)}`)
              }
            >
              {topic.label}
            </span>
          ))}
        </div>
      </div>
    </nav>
  );
}

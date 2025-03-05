import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, MapPin, X } from "lucide-react";
import { toast } from "react-toastify";

//cspell:disable

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
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

  const handleCategoryClick = async (category) => {
    try {
      if (category === "होम") {
        navigate("/");
        return;
      }

      // Fetch only the specific category data we need
      const { data } = await axios.get(`/api/news/category/${category}`);

      // Navigate to the category page with the merged data
      navigate(`/category/${category}`, { state: { mainPosts: data } });
      // console.log(mergedPosts);
      // } else {
      //   console.log("No cached data found, fetching from server");
      //   // If no cached data, just use the fetched data
      //   navigate(`/category/${category}`, { state: { articles: data } });
      // }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.warn("No News Posts Found for this Category");
      } else {
        toast.error("An error occurred while fetching news");
      }
    }
  };

  let LoginOrLogout;

  if (isAuthenticated) {
    LoginOrLogout = "Logout";
  } else {
    LoginOrLogout = "login";
  }

  const logoutMutation = useMutation({
    mutationFn: () =>
      axios.post("/api/users/logout", {}, { withCredentials: true }),
    onError: (error) => {
      console.error("An error occurred during logout:", error);
    },
  });

  const handleLogout = () => {
    if (isAuthenticated) {
      logoutMutation.mutate();
      window.location.reload();
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className="border-b-2 border-gray-300 shadow-sm">
      <div className="flex items-center justify-center bg-white px-4">
        <div className="py-3">
          <Link to="/">
            <img src="./lokmangallogo_00.png" alt="logo" className="" />
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center bg-gray-800">
        <div className="relative mx-0 w-full text-white xl:px-56">
          <div className="flex items-center justify-between overflow-x-auto">
            <div className="absolute left-0 top-[-25px] hidden lg:block xl:px-56">
              <Link to="/">
                {/* <img src="./image.png" alt="logo" className="w-20" /> */}
                <img src="./logo.png" alt="logo" className="w-20" />
              </Link>
            </div>
            <div></div>

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
                "वीडियो",
                "मनोरंजन",
              ].map((item) => (
                <div
                  key={item}
                  className="flex cursor-pointer items-center space-x-4 whitespace-nowrap px-4 py-2 text-sm font-semibold"
                  onClick={() => handleCategoryClick(item)}
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center">
              {isAuthenticated && (
                <div
                  key="admin"
                  className="mx-auto flex cursor-pointer items-center whitespace-nowrap p-2 text-sm font-semibold"
                  onClick={() => navigate("/admin")}
                >
                  Admin
                </div>
              )}
              <div
                key="logout"
                className="mx-auto flex cursor-pointer items-center whitespace-nowrap py-2 text-sm font-semibold"
                onClick={handleLogout}
              >
                {isAuthenticated ? "Logout" : "Login"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Topics - Added mobile padding */}
      <div className="flex items-center justify-between overflow-x-auto bg-gray-100">
        <div className="mx-auto flex max-w-6xl items-center space-x-4 whitespace-nowrap px-4 py-2 text-sm font-semibold">
          {[
            "#Delhi Election 2025",
            "#Budget 2025-26",
            "#Mahakumbh Mela Live",
            "#Mahakumbh",
            "#महाकुंभ",
          ].map((topic) => (
            <span
              key={topic}
              className="cursor-pointer text-red-600 transition-all"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </nav>
  );
}

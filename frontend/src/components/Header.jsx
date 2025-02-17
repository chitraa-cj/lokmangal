import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, MapPin, X } from "lucide-react";

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

      const { data } = await axios.get(`/api/news/category/${category}`);
      navigate(`/category/${category}`, { state: { articles: data } });
      // console.log(data[0]);
    } catch (error) {
      console.error("Error fetching articles by category:", error);
    }
  };

  // const handleCategoryClick = async (category) => {
  //   try {
  //     const { data } = await axios.get(`/api/news/category/${category}`);
  //     // Assuming you want to navigate to a new page to display the articles
  //     navigate(`/category/${category}`, { state: { articles: data } });
  //   } catch (error) {
  //     console.error("Error fetching articles by category:", error);
  //   }
  // };

  let LoginOrLogout;

  if (isAuthenticated) {
    LoginOrLogout = "Logout";
  } else {
    LoginOrLogout = "login";
  }

  const logoutMutation = useMutation({
    mutationFn: () =>
      axios.post("/api/users/logout", {}, { withCredentials: true }),
    onSuccess: () => {
      navigate("/");
    },
    onError: (error) => {
      console.error("An error occurred during logout:", error);
    },
  });

  const handleLogout = () => {
    if (isAuthenticated) {
      logoutMutation.mutate();
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className="border-b shadow-sm">
      <div className="flex items-center justify-center bg-white px-4">
        <div className="py-3">
          <Link to="/">
            <img src="./image.png" alt="logo" className="h-20 w-20" />
          </Link>
        </div>
      </div>

      <div className="bg-gray-800">
        <div className="mx-auto max-w-6xl text-white">
          <div className="relative flex items-center justify-between">
            <button
              className="p-4 text-white md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div
              className={`${
                menuOpen ? "block" : "hidden"
              } absolute left-0 top-full z-10 w-full bg-gray-800 md:static md:block md:w-auto md:bg-transparent`}
            >
              <ul className="items-center md:flex">
                {[
                  "होम",
                  "देश",
                  "दुनिया",
                  "प्रदेशक खबरे",
                  "राजनीति",
                  "अप्राध",
                  "खेल",
                  "हमारा शहर",
                  "वीडियो",
                  "मनोरंजन",
                ].map((item) => (
                  <li
                    key={item}
                    className="w-full cursor-pointer border-b p-4 font-semibold uppercase hover:bg-yellow-500 md:w-auto md:border-none"
                    onClick={() => handleCategoryClick(item)}
                  >
                    {item}
                  </li>
                ))}
                {isAuthenticated && (
                  <li
                    key="admin"
                    className="w-full cursor-pointer border-b p-4 font-semibold uppercase hover:bg-yellow-500 md:w-auto md:border-none"
                    onClick={() => navigate("/admin")}
                  >
                    ADMIN
                  </li>
                )}
                <li
                  key="logout"
                  className="w-full cursor-pointer border-b p-4 font-semibold uppercase hover:bg-yellow-500 md:w-auto md:border-none"
                  onClick={handleLogout}
                >
                  {isAuthenticated ? "Logout" : "Login"}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Topics - Added mobile padding */}
      <div className="flex items-center justify-center overflow-x-auto bg-gray-100">
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

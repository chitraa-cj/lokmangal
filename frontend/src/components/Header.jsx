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

        if (data.isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [navigate]);

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
      {/* Logo Section - No changes needed */}
      <div className="bg-white flex items-center justify-center px-4">
        <div className="py-3">
          <Link to="/">
            {/* <h1 className="text-2xl md:text-5xl font-bold">लोक मंगल</h1> */}
            <img src="./image.png" alt="logo" className="w-20 h-20" />
          </Link>
        </div>
      </div>

      {/* Main Navigation - Updated structure */}
      <div className="bg-gray-800">
        <div className="max-w-6xl mx-auto text-white">
          <div className="flex items-center justify-between relative">
            {" "}
            {/* Added relative positioning */}
            {/* Mobile Menu Button */}
            <button
              className="p-4 text-white md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            {/* Mobile Search/Location - Moved before nav items */}
            <div className="flex items-center md:hidden">
              {/* <button className="p-4">
                <MapPin size={20} />
              </button> */}
              <button className="p-4">
                <Search size={20} />
              </button>
            </div>
            {/* Navigation Items - Updated positioning */}
            <div
              className={`${
                menuOpen ? "block" : "hidden"
              } md:block absolute top-full left-0 w-full bg-gray-800 z-10 md:static md:w-auto md:bg-transparent`}
            >
              <ul className="md:flex items-center">
                {/* "Home",
                  "Country",
                  "City and state",
                  "Election",
                  "Word search",
                  "Entertainment",
                  "More...", */}
                {/* "घर", */}
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
                    className="p-4 uppercase cursor-pointer hover:bg-yellow-500 font-semibold w-full md:w-auto border-b md:border-none"
                  >
                    {item}
                  </li>
                ))}
                {isAuthenticated && (
                  <li
                    key="admin"
                    className="p-4 uppercase cursor-pointer hover:bg-yellow-500 font-semibold w-full md:w-auto border-b md:border-none"
                    onClick={() => navigate("/admin")}
                  >
                    ADMIN
                  </li>
                )}
                <li
                  key={logoutMutation}
                  className="p-4 uppercase cursor-pointer hover:bg-yellow-500 font-semibold w-full md:w-auto border-b md:border-none"
                  onClick={handleLogout}
                >
                  {LoginOrLogout}
                </li>
              </ul>
            </div>
            {/* Desktop Search/Location */}
            <div className="hidden md:flex items-center">
              <button className="p-4">
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Topics - Added mobile padding */}
      <div className="bg-gray-100 overflow-x-auto flex items-center justify-center">
        <div className="px-4 py-2 text-sm flex items-center space-x-4 max-w-6xl mx-auto font-semibold whitespace-nowrap">
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

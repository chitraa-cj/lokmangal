import { useLocation, useNavigate } from "react-router-dom";
import {
  FileText,
  ScrollText,
  ListCheckIcon,
  LogOut,
  User,
  ReceiptText,
  ReceiptIndianRupeeIcon,
  ListCollapse,
} from "lucide-react";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userName = localStorage.getItem("username");

  const isActive = (path) => location.pathname === path;

  const navItems = [
    // { path: "/", label: "Invoice", icon: FileText },

    { path: "/", label: "Release Order", icon: ReceiptText },

    {
      path: "/invoice",
      label: "GST Invoice",
      icon: ReceiptIndianRupeeIcon,
    },

    // { path: "/invoice-list", label: "Invoices List", icon: ScrollText },

    {
      path: "/release-order-list",
      label: "Release Order List",
      icon: ListCheckIcon,
    },

    {
      path: "/gst-invoice-list",
      label: "GST Invoice List",
      icon: ListCollapse,
    },
    { path: "/merged", label: "Merged", icon: FileText },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
      });

      if (response.ok) {
        navigate("/login");
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  return (
    <nav className="bg-white border-b noPrint">
      <div className="max-w-8xl mx-auto px-16">
        <div className="flex items-center justify-between h-26 px-4 py-2">
          <div
            className="w-48 flex-shrink-0 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src="./logo.png"
              alt="Business Culture"
              className="h-auto w-auto"
            />
          </div>

          {/* Navigation Section - Centered */}
          <div className="hidden md:flex justify-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`
                flex items-center px-4 py-2 text-sm font-medium rounded-md
                transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400
                ${
                  isActive(item.path)
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 focus:outline-none"
                }
              `}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* User Section - Fixed width */}
          <div className="w-48 flex justify-end">
            {userName && (
              <div className="flex items-center">
                <div className="flex items-center space-x-2 focus:outline-none bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                  <User className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-semibold uppercase text-blue-700">
                    {/* {userName} */}
                    Test
                  </span>
                </div>
                <div className="h-6 w-px bg-gray-200 mx-2"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;

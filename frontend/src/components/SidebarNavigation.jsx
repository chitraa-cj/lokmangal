import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  Hash,
  UserPlus,
  Users,
  User,
  LogOut,
  Home,
  MonitorPlay,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  // Retrieve username from localStorage when the component mounts
  useEffect(() => {
    const storedUsername = localStorage.getItem("userName");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const navItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/admin",
    },
    {
      title: "Add New Post",
      icon: <Newspaper size={20} />,
      path: "/admin/add-new",
    },
    {
      title: "Manage Video Links",
      icon: <MonitorPlay size={20} />,
      path: "/admin/video",
    },
    {
      title: "Manage Writers",
      icon: <UserPlus size={20} />,
      path: "/admin/writers",
    },
    // {
    //   title: "Writers",
    //   icon: <Users size={20} />,
    //   path: "/admin/writers",
    // },
    {
      title: "Go To News",
      icon: <Home size={20} />,
      path: "/",
    },
  ];

  const logoutMutation = useMutation({
    mutationFn: () =>
      axios.post("/api/users/logout", {}, { withCredentials: true }),
    onSuccess: () => {
      localStorage.removeItem("userName"); // Remove username from localStorage on logout
      navigate("/");
    },
    onError: (error) => {
      console.error("An error occurred during logout:", error);
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="sticky top-0 flex h-screen w-64 flex-col border-r bg-white">
      {/* Logo */}
      <div className="flex items-center justify-center p-4">
        <Link to="/admin">
          {/* <img src="/image.png" alt="logo" className="h-20 w-20" /> */}
          <img src="/logo.gif" alt="logo" className="h-40" />
        </Link>
      </div>

      {/* User Info */}
      <div className="flex items-center justify-center gap-3 px-6 py-3 text-gray-700">
        <User size={24} className="text-blue-500" />
        <span className="font-semibold uppercase">{username || "Admin"}</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 ${
              location.pathname === item.path ? "bg-blue-100 text-blue-600" : ""
            }`}
          >
            {item.icon}
            <span className="whitespace-nowrap uppercase">{item.title}</span>
          </Link>
        ))}
      </nav>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="m-4 flex items-center gap-3 rounded px-6 py-3 text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
      >
        <LogOut size={20} />
        <span className="font-semibold text-red-600">Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;

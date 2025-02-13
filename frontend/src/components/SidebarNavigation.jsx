import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  UserPlus,
  Users,
  User,
  LogOut,
  Home,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/admin",
    },
    {
      title: "Add New",
      icon: <Newspaper size={20} />,
      path: "/admin/add-new",
    },
    {
      title: "Go To News",
      icon: <Home size={20} />,
      path: "/",
    },
    // {
    //   title: "Add writer",
    //   icon: <UserPlus size={20} />,
    //   path: "/admin/add-writer",
    // },
    // {
    //   title: "Writers",
    //   icon: <Users size={20} />,
    //   path: "/admin/writers",
    // },
    // {
    //   title: "Profile",
    //   icon: <User size={20} />,
    //   path: "/admin/profile",
    // },
  ];

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
    logoutMutation.mutate();
  };

  return (
    <div className="w-64 sticky top-0 h-screen bg-white border-r flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-center p-4">
        {/* <h1 className="text-2xl font-bold text-red-500">NEWS PORTAL</h1> */}
        <img src="./image.png" alt="logo" className="w-20 h-20" />
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center font-semibold gap-3 px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
              location.pathname === item.path ? "bg-blue-100 text-blue-600" : ""
            }`}
          >
            {item.icon}
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors m-4 rounded"
      >
        <LogOut size={20} />
        <span className="text-red-600 font-semibold">Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;

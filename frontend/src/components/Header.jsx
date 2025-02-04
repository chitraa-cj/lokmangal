import { useState } from "react";
import { Menu, Search, MapPin } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="border-b shadow-sm">
      <div className="bg-white flex items-center justify-center">
        <div className="max-w-6xl p-4">
          <h1 className="text-3xl font-bold">लोक मंगल</h1>
        </div>
      </div>
      <div className="bg-gray-800">
        <div className="max-w-6xl mx-auto text-white flex items-center p-4 ">
          <button
            className="text-white md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu size={24} />
          </button>
          <ul className={`md:flex space-x-4 ${menuOpen ? "block" : "hidden"}`}>
            <li className="uppercase cursor-pointer hover:scale-105 hover:text-red-600 transition-all">
              home
            </li>
            <li className="uppercase cursor-pointer hover:scale-105 hover:text-red-600 transition-all">
              Country
            </li>
            <li className="uppercase cursor-pointer hover:scale-105 hover:text-red-600 transition-all">
              City and state
            </li>
            <li className="uppercase cursor-pointer hover:scale-105 hover:text-red-600 transition-all">
              Election
            </li>
            <li className="uppercase cursor-pointer hover:scale-105 hover:text-red-600 transition-all">
              Word search
            </li>
            <li className="uppercase cursor-pointer hover:scale-105 hover:text-red-600 transition-all">
              Entertainment
            </li>
            <li className="uppercase cursor-pointer hover:scale-105 hover:text-red-600 transition-all">
              More...
            </li>
          </ul>
          <div className="ml-auto flex space-x-4">
            <button className="flex items-center justify-center">
              <MapPin size={24} />{" "}
              <span className="hidden md:inline">My city</span>
            </button>
            <button>
              <Search size={24} />
            </button>
          </div>
        </div>
      </div>
      <div className="bg-gray-100">
        <div className="px-4 py-2 text-sm flex space-x-4 max-w-6xl mx-auto font-semibold">
          <span className="cursor-pointer"># Delhi Election 2025</span>
          <span className="cursor-pointer">Budget 2025-26</span>
          <span className="cursor-pointer">Mahakumbh Mela Live</span>
          <span className="cursor-pointer">Mahakumbh</span>
          <span className="cursor-pointer">Brand Studio</span>
        </div>
      </div>
    </nav>
  );
}

// // import { useLocation, useNavigate } from "react-router-dom";
// // import {
// //   FileText,
// //   ScrollText,
// //   ListCheckIcon,
// //   LogOut,
// //   User,
// //   ReceiptText,
// //   ReceiptIndianRupeeIcon,
// //   ListCollapse,
// // } from "lucide-react";

// // const Header = () => {
// //   const location = useLocation();
// //   const navigate = useNavigate();
// //   const userName = localStorage.getItem("username");

// //   const isActive = (path) => location.pathname === path;

// //   const navItems = [
// //     // { path: "/", label: "Invoice", icon: FileText },

// //     { path: "/", label: "Release Order", icon: ReceiptText },

// //     {
// //       path: "/invoice",
// //       label: "GST Invoice",
// //       icon: ReceiptIndianRupeeIcon,
// //     },

// //     // { path: "/invoice-list", label: "Invoices List", icon: ScrollText },

// //     {
// //       path: "/release-order-list",
// //       label: "Release Order List",
// //       icon: ListCheckIcon,
// //     },

// //     {
// //       path: "/gst-invoice-list",
// //       label: "GST Invoice List",
// //       icon: ListCollapse,
// //     },
// //     { path: "/merged", label: "Merged", icon: FileText },
// //   ];

// //   const handleLogout = async () => {
// //     try {
// //       const response = await fetch("/api/users/logout", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         credentials: "include", // Include cookies for authentication
// //       });

// //       if (response.ok) {
// //         navigate("/login");
// //       } else {
// //         console.error("Failed to log out");
// //       }
// //     } catch (error) {
// //       console.error("An error occurred during logout:", error);
// //     }
// //   };

// //   return (
// //     <nav className="bg-white border-b noPrint">
// //       <div className="max-w-8xl mx-auto px-16">
// //         <div className="flex items-center justify-between h-26 px-4 py-2">
// //           <div
// //             className="w-48 flex-shrink-0 cursor-pointer"
// //             onClick={() => navigate("/")}
// //           >
// //             <img
// //               src="./logo.png"
// //               alt="Business Culture"
// //               className="h-auto w-auto"
// //             />
// //           </div>

// //           {/* Navigation Section - Centered */}
// //           <div className="hidden md:flex justify-center space-x-2">
// //             {navItems.map((item) => {
// //               const Icon = item.icon;
// //               return (
// //                 <button
// //                   key={item.path}
// //                   onClick={() => navigate(item.path)}
// //                   className={`
// //                 flex items-center px-4 py-2 text-sm font-medium rounded-md
// //                 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400
// //                 ${
// //                   isActive(item.path)
// //                     ? "bg-blue-600 text-white shadow-sm"
// //                     : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 focus:outline-none"
// //                 }
// //               `}
// //                 >
// //                   <Icon className="w-4 h-4 mr-2" />
// //                   {item.label}
// //                 </button>
// //               );
// //             })}
// //           </div>

// //           {/* User Section - Fixed width */}
// //           <div className="w-48 flex justify-end">
// //             {userName && (
// //               <div className="flex items-center">
// //                 <div className="flex items-center space-x-2 focus:outline-none bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
// //                   <User className="w-4 h-4 text-blue-500" />
// //                   <span className="text-sm font-semibold uppercase text-blue-700">
// //                     {/* {userName} */}
// //                     Test
// //                   </span>
// //                 </div>
// //                 <div className="h-6 w-px bg-gray-200 mx-2"></div>
// //                 <button
// //                   onClick={handleLogout}
// //                   className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-600"
// //                 >
// //                   <LogOut className="w-4 h-4" />
// //                   <span className="text-sm font-medium">Logout</span>
// //                 </button>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </nav>
// //   );
// // };

// // export default Header;

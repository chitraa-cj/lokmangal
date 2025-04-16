// import { Outlet, useLocation } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import Sidebar from "./components/SidebarNavigation";

// const App = () => {
//   const location = useLocation();

//   const showHeaderFooter = location.pathname !== "/login";
//   const isAdminRoute = location.pathname.startsWith("/admin");

//   if (isAdminRoute) {
//     return (
//       <div className="relative flex">
//         {showHeaderFooter && (isAdminRoute ? <Sidebar /> : <Header />)}

//         <Outlet />
//         {showHeaderFooter && !isAdminRoute && <Footer />}
//         <ToastContainer />
//       </div>
//     );
//   } else {
//     return (
//       <>
//         {showHeaderFooter && (isAdminRoute ? <Sidebar /> : <Header />)}

//         <Outlet />
//         {showHeaderFooter && !isAdminRoute && <Footer />}
//         <ToastContainer />
//       </>
//     );
//   }
// };

// export default App;

import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/SidebarNavigation";
import { useEffect } from "react";

const App = () => {
  const location = useLocation();

  // Reset scroll position to top on route change
  useEffect(() => {
    window.scrollTo(0, 0); // Instant reset to top, no animation
  }, [location.pathname]); // Run on every route change

  const showHeaderFooter = location.pathname !== "/login";
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <div className="relative flex">
        {showHeaderFooter && (isAdminRoute ? <Sidebar /> : <Header />)}

        <Outlet />
        {showHeaderFooter && !isAdminRoute && <Footer />}
        <ToastContainer />
      </div>
    );
  } else {
    return (
      <>
        {showHeaderFooter && (isAdminRoute ? <Sidebar /> : <Header />)}

        <Outlet />
        {showHeaderFooter && !isAdminRoute && <Footer />}
        <ToastContainer />
      </>
    );
  }
};

export default App;

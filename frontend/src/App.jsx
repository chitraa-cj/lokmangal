import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  const location = useLocation();

  const showHeaderFooter = location.pathname !== "/login";

  return (
    <>
      {showHeaderFooter && <Header />}
      <Outlet />
      {showHeaderFooter && <Footer />}
      <ToastContainer />
    </>
  );
};

export default App;

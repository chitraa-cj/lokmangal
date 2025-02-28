import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./assets/index.css";

// import PrivateRoute from "./Utils/PrivateRoute.jsx";
import AdminRoute from "./Utils/AdminRoute.jsx";

import App from "./App.jsx";

import LoginPage from "./Pages/LoginPage.jsx";
import ErrorPage from "./Pages/ErrorPage.jsx";

import Home from "./Pages/Home.jsx";
import NewsArticlePage from "./Pages/NewsArticlePage.jsx";

import AdminHome from "./Pages/Admin/DashBoard.jsx";
import AddNewPage from "./Pages/Admin/AddNewPage.jsx";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<ErrorPage />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Home />} />
      <Route path="/category/:category" element={<Home />} />
      {/* <Route path="/category/:category" element={<CategoryHome />} /> */}
      <Route path="/:type/:id" element={<NewsArticlePage />} />

      {/*Admin Routes */}
      <Route element={<AdminRoute />} errorElement={<ErrorPage />}>
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/add-new" element={<AddNewPage />} />
      </Route>
    </Route>,
  ),
);

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>,
);

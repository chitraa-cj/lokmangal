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

import PrivateRoute from "./Utils/PrivateRoute.jsx";

import App from "./App.jsx";

import LoginPage from "./Pages/LoginPage.jsx";
import ErrorPage from "./Pages/ErrorPage.jsx";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<ErrorPage />}>
      <Route path="/login" element={<LoginPage />} />

      {/* Private Routes */}
      <Route element={<PrivateRoute />} errorElement={<ErrorPage />}></Route>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

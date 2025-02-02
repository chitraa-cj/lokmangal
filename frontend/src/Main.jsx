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

// import InvoicePage from "./Pages/Invoice/InvoicePage.jsx";
import ReleaseOrderPage from "./Pages/Invoice/ReleaseOrderPage.jsx";
import GSTInvoicePage from "./Pages/Invoice/GSTInvoicePage.jsx";

// import InvoiceListPage from "./Pages/List/InvoiceListPage.jsx";
import ReleaseOrderListPage from "./Pages/List/ReleaseOrderListPage.jsx";
import GSTInvoiceListPage from "./Pages/List/GSTInvoiceListPage.jsx";

// import InvoiceDetailsPage from "./Pages/Details/InvoiceDetailsPage.jsx";
import ReleaseOrderDetailsPage from "./Pages/Details/ReleaseOrderDetailsPage.jsx";
import GSTInvoiceDetailsPage from "./Pages/Details/GSTInvoiceDetailsPage.jsx";

import Merged from "./Pages/Merged_Invoice/Merged.jsx";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<ErrorPage />}>
      <Route path="/login" element={<LoginPage />} />

      {/* Private Routes */}
      <Route element={<PrivateRoute />} errorElement={<ErrorPage />}>
        {/* Invoice Routes */}
        {/* <Route index path="/" element={<InvoicePage />} /> */}
        <Route path="/" element={<ReleaseOrderPage />} />
        <Route index path="/invoice" element={<GSTInvoicePage />} />
        <Route path="/merged" element={<Merged />} />

        {/* List Routes */}
        {/* <Route path="/invoice-list" element={<InvoiceListPage />} /> */}
        <Route path="/release-order-list" element={<ReleaseOrderListPage />} />
        <Route path="/gst-invoice-list" element={<GSTInvoiceListPage />} />

        {/* Details Routes */}
        {/* <Route index path="/invoice/:id" element={<InvoiceDetailsPage />} /> */}
        <Route
          index
          path="/release-order/:id"
          element={<ReleaseOrderDetailsPage />}
        />
        <Route path="/gst-invoice/:id" element={<GSTInvoiceDetailsPage />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

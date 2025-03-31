import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Loader from "../components/Loader";

const AdminRoute = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-verify"],
    queryFn: () => axios.get("/api/users/verify-admin").then((res) => res.data),
    retry: false,
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <Loader text="Checking admin access..." />;
  }

  const isAdmin = data?.isAuthenticated && data?.user?.isAdmin;

  if (isAdmin) {
    localStorage.setItem("userName", data?.user?.name);
  }

  return isAdmin ? (
    <Outlet />
  ) : data?.isAuthenticated ? (
    <Navigate to="/" />
  ) : (
    <Navigate to="/login" />
  );
};

export default AdminRoute;

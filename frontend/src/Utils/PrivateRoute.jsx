import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loader from "../components/Loader";

const fetchAuthStatus = async () => {
  const response = await axios.get("/api/users/verify");
  return response?.data;
};

const PrivateRoute = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["authStatus"],
    queryFn: fetchAuthStatus,
    retry: false,
  });

  if (isLoading) {
    return <Loader text="Checking admin access..." />;
  }

  if (data?.isAuthenticated) {
    localStorage.setItem("userName", data.user.username);
  }

  if (isError || !data?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // if (data?.isAuthenticated && data.user?.isAdmin) {
  //   return <Navigate to="/admin" replace />;
  // }

  return <Outlet />;
};

export default PrivateRoute;

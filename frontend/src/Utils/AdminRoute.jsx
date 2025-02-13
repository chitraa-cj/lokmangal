import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const AdminRoute = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-verify"],
    queryFn: () => axios.get("/api/users/verify-admin").then((res) => res.data),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-200">
        Checking admin access...
      </div>
    );
  }

  const isAdmin = data?.isAuthenticated && data?.user?.isAdmin;

  if (isAdmin) {
    localStorage.setItem("userName", data.user.username);
  }

  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;

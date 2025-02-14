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
      <div className="flex min-h-screen w-full items-center justify-center bg-stone-200 text-3xl font-semibold">
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

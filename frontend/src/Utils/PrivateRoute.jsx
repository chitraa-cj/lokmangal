import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch("/api/users/verify", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        // console.log(response);
        // Verify the response has the expected structure and valid data
        if (response.ok && data.isAuthenticated) {
          setIsAuthenticated(true);
          setIsAdmin(data.user.isAdmin);
          localStorage.setItem("userName", data.user.username); // Store username in localStorage
        } else {
          console.warn("Invalid authentication response:", response);
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (error) {
        // console.error("Authentication verification failed:", error);
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();

    return () => {
      setIsAuthenticated(null);
      setIsAdmin(false);
      setIsLoading(true);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-200 p-4">
        Loading...
      </div>
    );
  }

  // Redirect admin users to admin dashboard
  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // Regular users can access private routes
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

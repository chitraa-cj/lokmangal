import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Add state to track authentication status
  const navigate = useNavigate();
  const usernameRef = useRef();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      usernameRef?.current?.focus();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get("/api/users/verify");

        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          navigate("/"); // Redirect if authenticated
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // If still loading authentication check, return null to avoid rendering login page
  if (isAuthenticated === null) {
    return null; // Prevent rendering the login page while checking
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error("Username and password are required");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post("/api/users/login", {
        username,
        password,
      });

      if (data.isAuthenticated) {
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error("Invalid login credentials");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An unexpected error occurred during login"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <h2 className="mb-3 text-center text-3xl font-extrabold text-gray-900">
          Sign In
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <input
              type="text"
              id="username"
              required
              ref={usernameRef}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none block w-full px-3 py-2 border rounded-md"
              placeholder="Username"
              aria-label="Username"
              autoComplete="username"
            />
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none block w-full px-3 py-2 border rounded-md"
              placeholder="Password"
              aria-label="Password"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 focus:outline-none bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
            aria-busy={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

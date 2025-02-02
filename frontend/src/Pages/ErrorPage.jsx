import { useRouteError } from "react-router-dom";
import { AlertTriangle, FileQuestion } from "lucide-react";

const ErrorPage = () => {
  const error = useRouteError();

  // Check if it's a 404 error
  const isNotFound =
    error?.status === 404 ||
    error?.message?.includes("404") ||
    error?.message?.includes("not found");

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 text-center">
          <div className="w-full flex justify-center mb-8">
            <div
              className={`p-4 rounded-full ${
                isNotFound ? "bg-blue-100" : "bg-red-100"
              }`}
            >
              {isNotFound ? (
                <FileQuestion className="w-12 h-12 text-blue-600" />
              ) : (
                <AlertTriangle className="w-12 h-12 text-red-600" />
              )}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isNotFound ? "Page Not Found" : "Oops! Something went wrong"}
          </h1>
          <div className="mb-8">
            <p className="text-gray-600 mb-4">
              {isNotFound
                ? "Looks like you've wandered into uncharted territory. This page doesn't exist."
                : "We're sorry for the inconvenience. The error has been logged and we'll look into it."}
            </p>

            {!isNotFound && error?.message && (
              <div className="p-4 bg-gray-100 rounded-lg text-left">
                <p className="text-sm font-mono text-gray-700 break-words">
                  {error.message}
                </p>
              </div>
            )}
          </div>

          {isNotFound && (
            <div className="space-y-4">
              <button
                onClick={() => (window.location.href = "/")}
                className={`w-full px-4 py-2 ${
                  isNotFound
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "border border-gray-300 hover:border-gray-400"
                } rounded-lg transition-colors`}
              >
                Return to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ErrorPage;

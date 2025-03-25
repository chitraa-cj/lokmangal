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
      <div className="flex min-h-screen min-w-full items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-6 text-center">
          <div className="mb-8 flex w-full justify-center">
            <div
              className={`rounded-full p-4 ${
                isNotFound ? "bg-blue-100" : "bg-red-100"
              }`}
            >
              {isNotFound ? (
                <FileQuestion className="h-12 w-12 text-blue-600" />
              ) : (
                <AlertTriangle className="h-12 w-12 text-red-600" />
              )}
            </div>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            {isNotFound ? "Page Not Found" : "Oops! Something went wrong"}
          </h1>
          <div className="mb-8">
            <p className="mb-4 text-gray-600">
              {isNotFound
                ? "Looks like you've wandered into uncharted territory. This page doesn't exist."
                : "We're sorry for the inconvenience. The error has been logged and we'll look into it."}
            </p>

            {!isNotFound && error?.message && (
              <div className="rounded-lg bg-gray-100 p-4 text-left">
                <p className="break-words font-mono text-sm text-gray-700">
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
                    ? "bg-blue-600 text-white hover:bg-blue-700"
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

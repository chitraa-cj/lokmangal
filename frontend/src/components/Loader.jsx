const Loader = ({ text = "Loading..." }) => {
  return (
    <p className="flex min-h-screen w-full items-center justify-center bg-gray-100 text-2xl">
      <svg
        className="mr-3 h-10 w-10 animate-spin text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      {text}
    </p>
  );
};
export default Loader;

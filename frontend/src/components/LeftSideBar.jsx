const LeftSideBar = () => {
  return (
    <div className="fixed left-40 top-1/4 w-40 hidden lg:block">
      <div className="text-center border-b border-gray-200 pb-4 mb-4">
        <h3 className="text-sm font-semibold mb-2">ताजा खबरें</h3>
        <p className="text-xs text-gray-600 mb-2"></p>
      </div>

      <div className="mb-4">
        <div className="bg-gray-100 w-32 h-32 mb-4 mx-auto"></div>{" "}
        <div className="flex justify-center gap-2 mb-2">
          <div className="w-24 h-8 bg-gray-200"></div>{" "}
          <div className="w-24 h-8 bg-gray-200"></div>{" "}
        </div>
      </div>
    </div>
  );
};
export default LeftSideBar;

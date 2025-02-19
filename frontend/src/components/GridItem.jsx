const GridItem = ({
  // title = "Lorem ipsum",
  title = "Lorem ipsum dolor sit amet consectetur",
  // description = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos asperiores!",
  imgUrl,
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 bg-white p-3">
      {/* <div className="w-full h-40 bg-gray-100 rounded"></div> */}
      <img src={imgUrl} alt="" className="h-40 w-56 rounded" />
      <h3 className="text-sm font-semibold">{title}</h3>
      {/* <p className="text-sm">{description}</p> */}
    </div>
  );
};
export default GridItem;

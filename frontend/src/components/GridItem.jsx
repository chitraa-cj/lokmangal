const GridItem = ({
  // title = "Lorem ipsum",
  title = "Lorem ipsum dolor sit amet",
  description,
  // = "Lorem ipsum dolor sit amet",
}) => {
  return (
    <div className="space-y-2">
      <div className="w-full h-40 bg-gray-200 rounded"></div>
      <h3 className="font-semibold text-sm">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
};
export default GridItem;

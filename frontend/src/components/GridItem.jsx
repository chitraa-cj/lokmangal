const GridItem = ({
  // title = "Lorem ipsum",
  title = "Lorem ipsum dolor sit amet consectetur",
  description = "सेड डू इयुसमॉड टेम्पोर इंसीडिडंट यूट लेबोर एट डोलोर मैग्ना अलिका",
  imgUrl = "https://picsum.photos/700/384",
}) => {
  return (
    <div className="flex h-72 w-40 flex-col items-center space-y-2 rounded-lg bg-white shadow-lg">
      <img
        src={imgUrl}
        alt=""
        className="h-28 w-full rounded-t-lg object-cover"
      />
      <div className="flex h-full flex-col items-center justify-around">
        <h3 className="break-normal px-2 text-sm font-semibold">{title}</h3>
        <p className="break-normal px-2 text-sm">{description}</p>
      </div>
    </div>
  );
};
export default GridItem;

// const GridItem = ({ title, imgUrl }) => {
//   return (
//     <div className="flex w-60 flex-col items-center justify-center space-y-2 bg-white p-3">
//       <img src={imgUrl} alt="" className="h-40 w-full rounded object-cover" />
//       <p className="line-clamp-2 w-full text-center text-sm font-semibold">
//         {title}
//       </p>
//     </div>
//   );
// };
// export default GridItem;

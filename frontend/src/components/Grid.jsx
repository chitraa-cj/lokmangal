import { Link } from "react-router-dom";
import GridItem from "./GridItem";

const Grid = () => {
  return (
    <div className="min-w-3xl max-w-3xl">
      <Link to="/" className="block">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <GridItem
            title={
              "कांग्रेस महासचिव प्रियंका गांधी के बाद अब राहुल गांधी का बांकुड़ा दौरा"
            }
          />
          <GridItem
            title={"राजस्थान: BJP का नया प्रदेश अध्यक्ष कौन? सीपी जोशी की जगह"}
          />
          <GridItem
            title={
              "Delhi Elections: एमसीडी टैक्स में बढ़ोतरी पर भाजपा का विरोध"
            }
          />
        </div>
      </Link>
    </div>
  );
};
export default Grid;

// import { Link } from "react-router-dom";
// import GridItem from "./GridItem";

// const Grid = () => {
//   return (
//     <div className="w-[420px]">
//       <Link to="/" className="block">
//         <div className="scrollbar-hide overflow-x-auto whitespace-nowrap">
//           <div className="flex gap-4">
//             <GridItem
//               title={
//                 "कांग्रेस महासचिव प्रियंका गांधी के बाद अब राहुल गांधी का बांकुड़ा दौरा"
//               }
//               imgUrl={"https://picsum.photos/700/384"}
//             />
//             <GridItem
//               title={
//                 "राजस्थान: BJP का नया प्रदेश अध्यक्ष कौन? सीपी जोशी की जगह"
//               }
//               imgUrl={"https://picsum.photos/700/384"}
//             />
//             <GridItem
//               title={
//                 "Delhi Elections: एमसीडी टैक्स में बढ़ोतरी पर भाजपा का विरोध"
//               }
//               imgUrl={"https://picsum.photos/700/384"}
//             />
//             <GridItem
//               title={"अयोध्या में राम मंदिर निर्माण को लेकर उत्साह"}
//               imgUrl={"https://picsum.photos/700/384"}
//             />
//             <GridItem
//               title={
//                 "भारत बनाम इंग्लैंड टेस्ट सीरीज: रोहित शर्मा की कप्तानी पर सवाल"
//               }
//               imgUrl={"https://picsum.photos/700/384"}
//             />
//           </div>
//         </div>
//       </Link>
//     </div>
//   );
// };
// export default Grid;

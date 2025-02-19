import GridItem from "./GridItem";

const Grid3 = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <GridItem
        title={
          "कांग्रेस महासचिव प्रियंका गांधी के बाद अब राहुल गांधी का बांकुड़ा दौरा"
        }
        imgUrl={"https://picsum.photos/700/384"}
      />
      <GridItem
        title={"राजस्थान: BJP का नया प्रदेश अध्यक्ष कौन? सीपी जोशी की जगह"}
        imgUrl={"https://picsum.photos/700/384"}
      />
      <GridItem
        title={"Delhi Elections: एमसीडी टैक्स में बढ़ोतरी पर भाजपा का विरोध"}
        imgUrl={"https://picsum.photos/700/384"}
      />
    </div>
  );
};
export default Grid3;

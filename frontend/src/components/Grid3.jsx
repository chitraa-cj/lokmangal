import GridItem from "./GridItem";

const Grid3 = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <GridItem
        title={
          "कांग्रेस महासचिव प्रियंका गांधी के बाद अब राहुल गांधी का बांकुड़ा दौरा"
        }
      />
      <GridItem
        title={"राजस्थान: BJP का नया प्रदेश अध्यक्ष कौन? सीपी जोशी की जगह"}
      />
      <GridItem
        title={"Delhi Elections: एमसीडी टैक्स में बढ़ोतरी पर भाजपा का विरोध"}
      />
    </div>
  );
};
export default Grid3;

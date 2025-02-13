import GridItem from "./GridItem";

const Grid3 = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <GridItem
        title={
          "कांग्रेस महासचिव प्रियंका गांधी के बाद अब राहुल गांधी का बांकुड़ा दौरा"
        }
        imgUrl={
          "https://staticimg.amarujala.com/assets/images/2025/01/30/kagarasa-nata-rahal-gathha_47c8cbf6dc70e9cdcc3d4ba6bb167039.png?w=414&dpr=1.0&q=65"
        }
      />
      <GridItem
        title={"राजस्थान: BJP का नया प्रदेश अध्यक्ष कौन? सीपी जोशी की जगह"}
        imgUrl={
          "https://th-i.thgim.com/public/incoming/p8kku/article68448964.ece/alternates/LANDSCAPE_1200/thumbnail_bhajan_madan.jpg"
        }
      />
      <GridItem
        title={"Delhi Elections: एमसीडी टैक्स में बढ़ोतरी पर भाजपा का विरोध"}
        imgUrl={
          "https://feeds.abplive.com/onecms/images/uploaded-images/2023/12/09/15a69c44eecdbe4056ff85d514fc25d61702092080812645_original.jpg?impolicy=abp_cdn&imwidth=1200&height=675"
        }
      />
    </div>
  );
};
export default Grid3;

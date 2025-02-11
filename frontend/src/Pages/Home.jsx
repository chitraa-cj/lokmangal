import HeroArticle from "../components/HeroArticle";
import Grid from "../components/Grid";
import VideoCard from "../components/VideoCard";
import RightSideBar from "../components/RightSideBar";
import LeftSideBar from "../components/LeftSideBar";

const NewsArticlePage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Left Sidebar */}
      {/* <LeftSideBar /> */}

      {/* Main Content */}
      <main className="">
        <HeroArticle
          kicker1={"US Indians Deportation"}
          kicker2={"National News"}
          kicker3={"Business deportation updates"}
          heading={
            "सी-17 वैन्य विमान में भारतीयों को अमेरिका से वापस भेजे जाने की खबर ट्रंप प्रशासन सख्त"
          }
          description={
            "अमेरिका में अवैध स्थानीयकरण पर सख्ती बढ़ती जा रही है। मैक्सिको की सीमा पर अवैध रूप से घुसने की कोशिश के  सिलसिले में हिरासत में लिए गए भारतीयों को सी-17 वैन्य विमान में भारत वापस भेजे जाने की खबर है। ट्रंप प्रशासन सख्त कार्रवाई कर रहा है।"
          }
        />

        <Grid redText={"महत्वपूर्ण-2024:"} text={"विशेष कवरेज"} />

        <HeroArticle />

        <HeroArticle />

        <Grid />

        <HeroArticle />

        <HeroArticle />

        <Grid />

        {/* Video Section */}
        <VideoCard />

        {/* Right Sidebar News */}
        {/* <RightSideBar /> */}
      </main>
    </div>
  );
};

export default NewsArticlePage;

const LeftSidebar = () => {
  const newsList = [
    {
      title: "US:",
      description:
        "ट्रंप ने स्टील-एल्यूमिनियम पर 25% टैरिफ लगाया, व्हाइट हाउस ने कहा- मौजूदा खामियों को दूर करना मकसद",
      time: "10 min ago",
    },
    {
      title: "Titanic:",
      description:
        "लापता टाइटन पनडुब्बी को लेकर US कोस्ट गार्ड ने जारी की ऑडियो रिकॉर्डिंग; टाइटैनिक का मलबा देखने गई थी",
      time: "1 hr ago",
    },
    {
      title: "India's Got Latent Controversy:",
      description: "समय रैना ने विवाद पर नहीं मांगी माफी, कही ये बात",
      time: "1 hr ago",
    },
    {
      title: "US:",
      description:
        "अमेरिका में फिर विमान हादसा; इस बार नौसेना का विमान दुर्घटनाग्रस्त, दोनों पायलट बच गए",
      time: "1 hr ago",
    },
  ];

  return (
    <div className="w-72 h-fit p-4 bg-white border border-gray-300 shadow-sm rounded-sm">
      <h3 className="text-lg font-bold border-b pb-2 mb-3">ताजा खबरें</h3>
      {newsList.map((news, index) => (
        <div key={index} className="mb-4">
          <h4 className="font-semibold text-red-600">{news.title}</h4>
          <p className="text-sm text-gray-700">{news.description}</p>
          <span className="text-xs text-gray-500">{news.time}</span>
        </div>
      ))}
    </div>
  );
};

export default LeftSidebar;

// import React from "react";
// import { Share2, Bookmark, MoreVertical } from "lucide-react";

// const NewsArticlePage = () => {
//   return (
//     <div className="min-h-screen max-w-4xl mx-auto px-4 py-8">
//       {/* Left Sidebar - Download Section */}
//       <div className="fixed left-4 top-1/4 w-32 p-4 hidden lg:block">
//         <h3 className="text-sm font-semibold mb-4">ताजा खबरें</h3>
//         <div className="space-y-4">
//           <div className="flex flex-col items-center">
//             <img
//               src="/api/placeholder/120/120"
//               alt="QR Code"
//               className="mb-2"
//             />
//             <div className="flex gap-2 mb-2">
//               <img
//                 src="/api/placeholder/24/24"
//                 alt="Play Store"
//                 className="w-6"
//               />
//               <img
//                 src="/api/placeholder/24/24"
//                 alt="App Store"
//                 className="w-6"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <main className="lg:ml-36">
//         {/* Article Header */}
//         <div className="mb-6">
//           <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
//             <a href="#" className="text-red-600">
//               US Indians Deportation
//             </a>
//             <span>|</span>
//             <span>National News</span>
//             <span>|</span>
//             <span>Business deportation updates</span>
//           </div>
//           <h1 className="text-2xl font-bold mb-4">
//             सी-17 वैन्य विमान में भारतीयों को अमेरिका से वापस भेजे जाने की खबर;
//             ट्रंप प्रशासन सख्त
//           </h1>
//         </div>

//         {/* Article Actions */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-4">
//             <button className="flex items-center gap-1">
//               <Share2 className="w-5 h-5" />
//             </button>
//             <button className="flex items-center gap-1">
//               <Bookmark className="w-5 h-5" />
//             </button>
//             <button className="flex items-center gap-1">
//               <MoreVertical className="w-5 h-5" />
//             </button>
//           </div>
//           <span className="text-sm text-gray-600">4h ago</span>
//         </div>

//         {/* Main Image */}
//         <div className="mb-6">
//           <img
//             src="/api/placeholder/800/400"
//             alt="News Cover"
//             className="w-full rounded-lg"
//           />
//         </div>

//         {/* Article Content */}
//         <div className="prose max-w-none">
//           <p className="mb-4">
//             अमेरिका में अवैध रूप से घुसने की कोशिश के सिलसिले में हिरासत में लिए
//             गए कुछ भारतीयों को सी-17 विमान से भारत वापस भेजे जाने की खबर है।
//             ट्रंप प्रशासन सख्त कार्रवाई कर रहा है।
//           </p>
//         </div>

//         {/* Related Stories Section */}
//         <div className="mt-8">
//           <h2 className="text-xl font-bold mb-4">
//             महत्वपूर्ण-2024: विशेष कवरेज
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {[1, 2, 3].map((item) => (
//               <div
//                 key={item}
//                 className="rounded-lg overflow-hidden border border-gray-200"
//               >
//                 <img
//                   src="/api/placeholder/400/200"
//                   alt={`Related Story ${item}`}
//                   className="w-full"
//                 />
//                 <div className="p-3">
//                   <h3 className="font-semibold text-sm mb-2">
//                     Breaking News Title
//                   </h3>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Video Section */}
//         <div className="mt-8">
//           <h2 className="text-xl font-bold mb-4">लेटेस्ट वीडियो</h2>
//           <div className="aspect-w-16 aspect-h-9 mb-4">
//             <img
//               src="/api/placeholder/800/450"
//               alt="Video Thumbnail"
//               className="w-full rounded-lg"
//             />
//           </div>
//           <h3 className="font-semibold">
//             Delhi Election 2024: सत्ता का किला में दिल्ली में क्या खूब रहेगा,
//             क्या खराब रहेगा?
//           </h3>
//         </div>

//         {/* Right Sidebar News */}
//         <div className="lg:fixed lg:right-4 lg:top-1/4 lg:w-72 mt-8 lg:mt-0">
//           <div className="space-y-4">
//             <div className="border-b pb-4">
//               <div className="flex items-center gap-2 mb-2">
//                 <img
//                   src="/api/placeholder/80/80"
//                   alt="News Thumbnail"
//                   className="w-20 h-20 object-cover rounded"
//                 />
//                 <h4 className="text-sm font-semibold">
//                   IPL के लिए BCCI द्वारा जारी प्लेऑफ स्टैंडिंग
//                 </h4>
//               </div>
//               <span className="text-xs text-gray-600">4 hours ago</span>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default NewsArticlePage;

import React from "react";
import { Share2, Bookmark, MoreVertical } from "lucide-react";

const NewsArticlePage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Left Sidebar */}
      <div className="fixed left-20 top-1/4 w-40 hidden lg:block">
        <div className="text-center border-b border-gray-200 pb-4 mb-4">
          <h3 className="text-sm font-semibold mb-2">ताजा खबरें</h3>
          <p className="text-xs text-gray-600 mb-2">
            {/* अपने स्मार्टफोन में पाएं न्यूज़ अपडेट्स */}
          </p>
        </div>

        {/* App Download Section */}
        <div className="mb-4">
          <div className="bg-gray-100 w-32 h-32 mb-4 mx-auto"></div>{" "}
          {/* QR Code placeholder */}
          <div className="flex justify-center gap-2 mb-2">
            <div className="w-24 h-8 bg-gray-200"></div>{" "}
            {/* Play Store button */}
            <div className="w-24 h-8 bg-gray-200"></div>{" "}
            {/* App Store button */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="">
        {/* Article Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <a href="#" className="text-red-600">
              US Indians Deportation
            </a>
            <span>|</span>
            <a href="#" className="text-gray-600">
              National News
            </a>
            <span>|</span>
            <a href="#" className="text-gray-600">
              Business deportation updates
            </a>
          </div>
          <h1 className="text-2xl font-bold mb-4">
            सी-17 वैन्य विमान में भारतीयों को अमेरिका से वापस भेजे जाने की खबर;
            ट्रंप प्रशासन सख्त
          </h1>
        </div>
        {/* Main Image / Placeholder */}
        <div className="mb-6">
          <div className="w-full h-96 bg-gray-200 rounded"></div>
        </div>
        {/* Article Content */}
        <div className="prose max-w-none mb-8">
          <p className="mb-4">
            अमेरिका में अवैध स्थानीयकरण पर सख्ती बढ़ती जा रही है। मैक्सिको की
            सीमा पर अवैध रूप से घुसने की कोशिश के सिलसिले में हिरासत में लिए गए
            भारतीयों को सी-17 वैन्य विमान में भारत वापस भेजे जाने की खबर है।
            ट्रंप प्रशासन सख्त कार्रवाई कर रहा है।
          </p>
        </div>
        {/* Important Coverage Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            महत्वपूर्ण-2024: विशेष कवरेज
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="w-full h-40 bg-gray-200 rounded"></div>
              <h3 className="font-semibold text-sm">
                कांग्रेस महासचिव प्रियंका गांधी के बाद अब राहुल गांधी का
                बांकुड़ा दौरा
              </h3>
            </div>
            <div className="space-y-2">
              <div className="w-full h-40 bg-gray-200 rounded"></div>
              <h3 className="font-semibold text-sm">
                राजस्थान: BJP का नया प्रदेश अध्यक्ष कौन? सीपी जोशी की जगह
              </h3>
            </div>
            <div className="space-y-2">
              <div className="w-full h-40 bg-gray-200 rounded"></div>
              <h3 className="font-semibold text-sm">
                Delhi Elections: एमसीडी टैक्स में बढ़ोतरी पर भाजपा का विरोध
              </h3>
            </div>
          </div>
        </div>
        {/* Video Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">लेटेस्ट वीडियो</h2>
          <div className="w-full h-72 bg-gray-200 rounded mb-4"></div>
          <h3 className="font-semibold">
            Delhi Election 2024: सत्ता का किला में दिल्ली में क्या खूब रहेगा,
            क्या खराब रहेगा?
          </h3>
        </div>
        {/* Right Sidebar News */}
        <div className="lg:fixed lg:-right-10 lg:top-1/4 lg:w-72 space-y-4">
          <div className="border-b pb-4">
            <div className="flex gap-2">
              <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0"></div>
              <div>
                <h4 className="text-sm font-semibold">
                  IND vs ENG: भारी जीत के बाद फूला-फूला चेहरा बयां करता है
                  बेंगलुरु टेस्ट का हाल
                </h4>
                <p className="text-xs text-gray-600 mt-1">4 February 2024</p>
              </div>
            </div>
          </div>
          <div className="border-b pb-4">
            <div className="flex gap-2">
              <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0"></div>
              <div>
                <h4 className="text-sm font-semibold">
                  World Latest Cup 2024: विश्व कप की धूम! है क्रिकेट, खुशी अनंत,
                  यहां मिलेगी हर खेल की अपडेट
                </h4>
                <p className="text-xs text-gray-600 mt-1">4 February 2024</p>
              </div>
            </div>
          </div>
          <div className="border-b pb-4">
            <div className="flex gap-2">
              <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0"></div>
              <div>
                <h4 className="text-sm font-semibold">
                  Priyanka Chopra: भाई की शादी का अल्बम लेकर चली प्रियंका
                  चोपड़ा, पैपराजी बोले- 'एक बार मुस्कुरा भी दीजिए'
                </h4>
                <p className="text-xs text-gray-600 mt-1">4 February 2024</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewsArticlePage;

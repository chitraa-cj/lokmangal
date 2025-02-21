import { Facebook, Instagram, Send, Share2 } from "lucide-react";

const Share = ({ heading, description }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: heading,
          text: description?.replace(/<[^>]*>/g, ""),
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareToInstagram = () => {
    alert("Instagram does not support direct web sharing. Share manually.");
  };

  const shareToWhatsApp = () => {
    const text = `${heading}\n${window.location.href}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const shareToTwitter = () => {
    const text = `${heading}\n`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareToTelegram = () => {
    const text = `${heading}\n`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  return (
    <div className="mb-4 flex items-center gap-3">
      <button
        onClick={shareToFacebook}
        className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-1 text-white hover:bg-blue-700"
      >
        <Facebook className="h-4 w-4" />
        {/* <span className="text-sm font-medium">Facebook</span> */}
      </button>

      <button
        onClick={shareToInstagram}
        className="flex items-center gap-2 rounded-full bg-pink-500 px-4 py-1 text-white hover:opacity-80"
      >
        <Instagram className="h-4 w-4" />
        {/* <span className="text-sm font-medium">Instagram</span> */}
      </button>

      <button
        onClick={shareToWhatsApp}
        className="flex items-center gap-2 rounded-full bg-green-500 px-4 py-1 text-white hover:bg-green-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={16}
          height={16}
          color={"#fff"}
          fill={"none"}
        >
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.3789 2.27907 14.6926 2.78382 15.8877C3.06278 16.5481 3.20226 16.8784 3.21953 17.128C3.2368 17.3776 3.16334 17.6521 3.01642 18.2012L2 22L5.79877 20.9836C6.34788 20.8367 6.62244 20.7632 6.87202 20.7805C7.12161 20.7977 7.45185 20.9372 8.11235 21.2162C9.30745 21.7209 10.6211 22 12 22Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M8.58815 12.3773L9.45909 11.2956C9.82616 10.8397 10.2799 10.4153 10.3155 9.80826C10.3244 9.65494 10.2166 8.96657 10.0008 7.58986C9.91601 7.04881 9.41086 7 8.97332 7C8.40314 7 8.11805 7 7.83495 7.12931C7.47714 7.29275 7.10979 7.75231 7.02917 8.13733C6.96539 8.44196 7.01279 8.65187 7.10759 9.07169C7.51023 10.8548 8.45481 12.6158 9.91948 14.0805C11.3842 15.5452 13.1452 16.4898 14.9283 16.8924C15.3481 16.9872 15.558 17.0346 15.8627 16.9708C16.2477 16.8902 16.7072 16.5229 16.8707 16.165C17 15.8819 17 15.5969 17 15.0267C17 14.5891 16.9512 14.084 16.4101 13.9992C15.0334 13.7834 14.3451 13.6756 14.1917 13.6845C13.5847 13.7201 13.1603 14.1738 12.7044 14.5409L11.6227 15.4118"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        {/* <span className="text-sm font-medium">WhatsApp</span> */}
      </button>

      <button
        onClick={shareToTwitter}
        className="flex items-center gap-2 rounded-full bg-black px-4 py-1 text-white hover:bg-gray-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={16}
          height={16}
          color={"#fff"}
          fill={"none"}
        >
          <path
            d="M3 21L10.5484 13.4516M21 3L13.4516 10.5484M13.4516 10.5484L8 3H3L10.5484 13.4516M13.4516 10.5484L21 21H16L10.5484 13.4516"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {/* <span className="text-sm font-medium">Twitter</span> */}
      </button>

      <button
        onClick={handleShare}
        className="flex items-center gap-2 rounded-full border border-gray-500 bg-white px-3 py-1 hover:bg-gray-100"
      >
        <Share2 className="h-4 w-4" />
        {/* <span className="text-sm font-medium text-gray-600">Share</span> */}
      </button>
    </div>
  );
};

export default Share;

// import { Facebook, Twitter, Send, Share2 } from "lucide-react";

// const Share = () => {
//   const handleShare = async () => {
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: heading,
//           text: description?.replace(/<[^>]*>/g, ""),
//           url: window.location.href,
//         });
//       } catch (error) {
//         console.error("Error sharing:", error);
//       }
//     }
//   };

//   const shareToFacebook = () => {
//     const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
//     window.open(url, "_blank", "width=600,height=400");
//   };

//   const shareToTwitter = () => {
//     const text = `${heading}\n`;
//     const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
//     window.open(url, "_blank", "width=600,height=400");
//   };

//   const shareToTelegram = () => {
//     const text = `${heading}\n`;
//     const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
//     window.open(url, "_blank", "width=600,height=400");
//   };

//   return (
//     <div className="mb-4 flex items-center gap-3">
//       <button
//         onClick={shareToFacebook}
//         className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-1 text-white hover:bg-blue-700"
//       >
//         <Facebook className="h-4 w-4" />
//         {/* <span className="text-sm font-medium">Facebook</span> */}
//       </button>
//       <button
//         onClick={shareToTwitter}
//         className="flex items-center gap-2 rounded-full bg-black px-4 py-1 text-white hover:bg-gray-600"
//       >
//         {/* <Twitter className="h-4 w-4" /> */}
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           x="0px"
//           y="0px"
//           width="16"
//           height="16"
//           viewBox="0 0 50 50"
//         >
//           <path
//             stroke="#fff"
//             d="M 5.9199219 6 L 20.582031 27.375 L 6.2304688 44 L 9.4101562 44 L 21.986328 29.421875 L 31.986328 44 L 44 44 L 28.681641 21.669922 L 42.199219 6 L 39.029297 6 L 27.275391 19.617188 L 17.933594 6 L 5.9199219 6 z M 9.7167969 8 L 16.880859 8 L 40.203125 42 L 33.039062 42 L 9.7167969 8 z"
//           ></path>
//         </svg>
//         {/* <span className="text-sm font-medium">Twitter</span> */}
//       </button>
//       <button
//         onClick={shareToTelegram}
//         className="flex items-center gap-2 rounded-full bg-blue-500 px-4 py-1 text-white hover:bg-blue-600"
//       >
//         <Send className="h-4 w-4" />
//         {/* <span className="text-sm font-medium">Telegram</span> */}
//       </button>
//       <button
//         onClick={handleShare}
//         className="flex items-center gap-2 rounded-full border border-gray-500 bg-white px-3 py-1 hover:bg-gray-100"
//       >
//         <Share2 className="h-4 w-4" />
//         {/* <span className="text-sm font-medium text-gray-600">Share</span> */}
//       </button>
//     </div>
//   );
// };
// export default Share;

import { Send } from "lucide-react";

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
    <div className="flex h-12 items-center justify-between">
      <div className="">
        <button onClick={shareToFacebook} className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            viewBox="0 0 16 16"
            width={20}
            height={20}
            id="facebook"
          >
            <path
              fill="#1976D2"
              d="M14 0H2C.897 0 0 .897 0 2v12c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V2c0-1.103-.897-2-2-2z"
            ></path>
            <path
              fill="#FAFAFA"
              fillRule="evenodd"
              d="M13.5 8H11V6c0-.552.448-.5 1-.5h1V3h-2a3 3 0 0 0-3 3v2H6v2.5h2V16h3v-5.5h1.5l1-2.5z"
              clipRule="evenodd"
            ></path>
          </svg>
          {/* <span className="text-sm font-medium">Facebook</span> */}
        </button>
      </div>

      <div>
        <button onClick={shareToInstagram} className="flex items-center">
          <img
            src="https://static.cdninstagram.com/rsrc.php/v4/yV/r/ftfgD2tsNT7.png"
            alt="Instagram Logo"
            className="h-6 w-6"
          />
          {/* <span className="text-sm font-medium">Instagram</span> */}
        </button>
      </div>

      <div>
        <button onClick={shareToWhatsApp} className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#fff"
            aria-label="WhatsApp"
            viewBox="0 0 512 512"
            width={22}
            height={22}
            id="whatsapp"
          >
            <rect width="512" height="512" fill="#45d354" rx="15%"></rect>
            <path d="M308 273c-3-2-6-3-9 1l-12 16c-3 2-5 3-9 1-15-8-36-17-54-47-1-4 1-6 3-8l9-14c2-2 1-4 0-6l-12-29c-3-8-6-7-9-7h-8c-2 0-6 1-10 5-22 22-13 53 3 73 3 4 23 40 66 59 32 14 39 12 48 10 11-1 22-10 27-19 1-3 6-16 2-18"></path>
            <path d="M264 384c-41 0-72-22-72-22l-49 13 12-48s-20-31-20-70c0-72 59-132 132-132 68 0 126 53 126 127 0 72-58 131-129 132m-159 29l83-23a158 158 0 0 0 230-140c0-86-68-155-154-155a158 158 0 0 0-137 236"></path>
          </svg>
          {/* <span className="text-sm font-medium">WhatsApp</span> */}
        </button>
      </div>

      <div>
        <button onClick={shareToTwitter} className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 512 512"
            id="twitter"
          >
            <g clipPath="url(#clip0_84_15697)">
              <rect width="512" height="512" fill="#000" rx="60"></rect>
              <path
                fill="#fff"
                d="M355.904 100H408.832L293.2 232.16L429.232 412H322.72L239.296 302.928L143.84 412H90.8805L214.56 270.64L84.0645 100H193.28L268.688 199.696L355.904 100ZM337.328 380.32H366.656L177.344 130.016H145.872L337.328 380.32Z"
              ></path>
            </g>
            <defs>
              <clipPath id="clip0_84_15697">
                <rect width="512" height="512" fill="#fff"></rect>
              </clipPath>
            </defs>
          </svg>
          {/* <span className="text-sm font-medium">Twitter</span> */}
        </button>
      </div>

      <div>
        <button onClick={handleShare} className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            id="share"
          >
            <path fill="none" d="M0 0h24v24H0V0z"></path>
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"></path>
          </svg>
          {/* <span className="text-sm font-medium text-gray-600">Share</span> */}
        </button>
      </div>
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

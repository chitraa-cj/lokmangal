import { Facebook, Twitter, Send, Share2 } from "lucide-react";

const HeroArticle = ({
  kicker1,
  kicker2,
  kicker3,
  heading,
  imgUrl,
  description,
}) => {
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
    <div className="min-w-3xl unselectable mb-2">
      {/* Article Header */}
      <div className="mb-3 pt-2">
        <h1 className="text-xl font-bold">{heading}</h1>
      </div>

      {/* Main Image / Placeholder */}
      <div className="mb-6">
        <img src={imgUrl} alt={heading} className="h-96 w-full rounded" />
      </div>

      {/* Share Buttons */}
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 rounded-full border border-gray-500 bg-white px-3 py-1 hover:bg-gray-100"
        >
          <Share2 className="h-4 w-4" />
          <span className="text-sm font-medium text-gray-600">Share</span>
        </button>
        <button
          onClick={shareToFacebook}
          className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-1 text-white hover:bg-blue-700"
        >
          <Facebook className="h-4 w-4" />
          <span className="text-sm font-medium">Facebook</span>
        </button>
        <button
          onClick={shareToTwitter}
          className="flex items-center gap-2 rounded-full bg-black px-4 py-1 text-white hover:bg-gray-600"
        >
          {/* <Twitter className="h-4 w-4" /> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="20"
            height="20"
            viewBox="0 0 50 50"
          >
            <path
              stroke="#fff"
              d="M 5.9199219 6 L 20.582031 27.375 L 6.2304688 44 L 9.4101562 44 L 21.986328 29.421875 L 31.986328 44 L 44 44 L 28.681641 21.669922 L 42.199219 6 L 39.029297 6 L 27.275391 19.617188 L 17.933594 6 L 5.9199219 6 z M 9.7167969 8 L 16.880859 8 L 40.203125 42 L 33.039062 42 L 9.7167969 8 z"
            ></path>
          </svg>
          <span className="text-sm font-medium">Twitter</span>
        </button>
        <button
          onClick={shareToTelegram}
          className="flex items-center gap-2 rounded-full bg-blue-500 px-4 py-1 text-white hover:bg-blue-600"
        >
          <Send className="h-4 w-4" />
          <span className="text-sm font-medium">Telegram</span>
        </button>
      </div>

      {/* Article Content */}
      {description && (
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      )}
    </div>
  );
};

export default HeroArticle;

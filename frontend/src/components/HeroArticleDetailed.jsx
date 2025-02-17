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
          className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 hover:bg-gray-100"
        >
          <span className="text-sm font-medium text-gray-600">Share</span>
        </button>
        <button
          onClick={shareToFacebook}
          className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-1 text-white hover:bg-blue-700"
        >
          <span className="text-sm font-medium">Facebook</span>
        </button>
        <button
          onClick={shareToTwitter}
          className="flex items-center gap-2 rounded-full bg-blue-400 px-4 py-1 text-white hover:bg-blue-500"
        >
          <span className="text-sm font-medium">Twitter</span>
        </button>
        <button
          onClick={shareToTelegram}
          className="flex items-center gap-2 rounded-full bg-blue-500 px-4 py-1 text-white hover:bg-blue-600"
        >
          <span className="text-sm font-medium">Telegram</span>
        </button>
      </div>

      {/* Article Content */}
      {description && (
        <div className="prose m-4 mt-0 max-w-none">
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      )}
    </div>
  );
};

export default HeroArticle;

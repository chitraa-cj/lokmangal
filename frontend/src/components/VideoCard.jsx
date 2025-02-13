const VideoCard = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">लेटेस्ट वीडियो</h2>
      {/* <div className="w-full h-72 bg-gray-200 rounded mb-4"></div>
      <h3 className="font-semibold">
        Delhi Election 2024: सत्ता का किला में दिल्ली में क्या खूब रहेगा, क्या
        खराब रहेगा?
      </h3> */}
      <iframe
        // width="560"
        className="w-full h-72 rounded"
        src="https://www.youtube.com/embed/CDjD5gQjXQk?si=9oLqbmoIyEGdw3Xd"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    </div>
  );
};
export default VideoCard;

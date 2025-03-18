const VideoCard = () => {
  return (
    <div className="w-full max-w-3xl px-4">
      <h2 className="mb-4 text-xl font-bold">लेटेस्ट वीडियो</h2>
      {/* <div className="w-full h-72 bg-gray-100 rounded mb-4"></div>
      <h3 className="font-semibold">
        Delhi Election 2024: सत्ता का किला में दिल्ली में क्या खूब रहेगा, क्या
        खराब रहेगा?
      </h3> */}
      <iframe
        className="h-64 w-full rounded-lg bg-white shadow-lg"
        src="https://www.youtube.com/embed/CDjD5gQjXQk?si=9oLqbmoIyEGdw3Xd"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      ></iframe>
    </div>
  );
};
export default VideoCard;

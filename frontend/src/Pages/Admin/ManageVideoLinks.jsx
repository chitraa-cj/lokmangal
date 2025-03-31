import { useState, useEffect } from "react";
import axios from "axios";

const ManageVideoLinks = () => {
  const [mainId, setMainId] = useState("");
  const [iframeId, setIframeId] = useState("");
  const [message, setMessage] = useState("");
  const [savedVideos, setSavedVideos] = useState({ main: null, iframe: null });

  // Fetch existing videos
  const fetchVideos = async () => {
    try {
      const response = await axios.get("/api/videos");
      const videos = response.data.reduce((acc, video) => {
        acc[video.type] = video;
        return acc;
      }, {});
      setSavedVideos(videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleSubmit = async (type, input) => {
    if (!input.trim()) {
      setMessage("Please enter a video ID or URL");
      return;
    }

    try {
      const response = await axios.post(
        "/api/videos",
        { type, videoId: input },
        {
          headers: {
            "Content-Type": "application/json",
            // Add your auth token header if needed
          },
        },
      );
      setMessage(
        `Successfully ${response.status === 201 ? "added" : "updated"} ${type} video`,
      );
      if (type === "main") setMainId("");
      if (type === "iframe") setIframeId("");
      setSavedVideos((prev) => ({
        ...prev,
        [type]: response.data,
      }));
    } catch (error) {
      setMessage(error.response?.data?.message || "Error adding video");
    }
  };

  const handleDelete = async (type) => {
    try {
      await axios.delete(`/api/videos/${type}`, {
        headers: {
          // Add your auth token header if needed
        },
      });
      setMessage(`Successfully deleted ${type} video`);
      setSavedVideos((prev) => ({
        ...prev,
        [type]: null,
      }));
    } catch (error) {
      setMessage(error.response?.data?.message || "Error deleting video");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 py-8">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Main Video Section */}
            <div className="rounded-md border border-gray-200 p-4">
              <label
                htmlFor="mainId"
                className="mb-2 block text-lg font-medium text-gray-700"
              >
                Main Video
              </label>
              <div className="flex flex-col gap-4 sm:flex-row">
                <input
                  type="text"
                  id="mainId"
                  value={mainId}
                  onChange={(e) => setMainId(e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter YouTube URL or Video ID"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSubmit("main", mainId)}
                    className="rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleDelete("main")}
                    className="rounded-md bg-red-600 px-6 py-2 text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {savedVideos.main && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium text-gray-600">
                    Current Video Preview:
                  </p>
                  <div className="aspect-video w-full overflow-hidden rounded-md">
                    <iframe
                      src={savedVideos.main.url}
                      title="Main Video Preview"
                      className="h-full w-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>

            {/* Iframe Video Section */}
            <div className="rounded-md border border-gray-200 p-4">
              <label
                htmlFor="iframeId"
                className="mb-2 block text-lg font-medium text-gray-700"
              >
                PopUp Video
              </label>
              <div className="flex flex-col gap-4 sm:flex-row">
                <input
                  type="text"
                  id="iframeId"
                  value={iframeId}
                  onChange={(e) => setIframeId(e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter YouTube URL or Video ID"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSubmit("iframe", iframeId)}
                    className="rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleDelete("iframe")}
                    className="rounded-md bg-red-600 px-6 py-2 text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {savedVideos.iframe && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium text-gray-600">
                    Current Video Preview:
                  </p>
                  <div className="aspect-video w-full overflow-hidden rounded-md">
                    <iframe
                      src={savedVideos.iframe.url}
                      title="Iframe Video Preview"
                      className="h-full w-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`mt-6 rounded-md p-4 text-center ${
                message.includes("Error")
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageVideoLinks;

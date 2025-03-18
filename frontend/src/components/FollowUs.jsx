import { Link } from "react-router-dom";

const FollowUs = () => {
  const shareToFacebook = () => {
    window.location.href = "https://www.facebook.com/lokmangalnews/";
  };

  const shareToInstagram = () => {
    window.location.href = "https://www.instagram.com/lokmangalnews/";
  };

  return (
    <div className="h-fit w-[180px] space-y-3 rounded-xl bg-white p-3 text-center shadow-lg">
      {/* Logo Section */}
      <div className="py-2">
        <Link to="/">
          <img
            src="./lokmangallogo_00.png"
            alt="Lok Mangal Logo"
            // className="mx-auto h-12 w-auto"
          />
        </Link>
      </div>

      {/* Tagline Section */}
      <p className="text-sm font-medium tracking-wide">
        <span className="text-red-600">• निष्पक्ष </span>
        <span className="text-blue-600">• निर्भीक </span>
        <span className="text-gray-800">• निरंतर</span>
      </p>

      {/* Social Media Section */}
      <div className="space-y-4">
        {/* Social Media Icons */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="flex h-20 w-20 items-center justify-center">
              <img src="/instagramQR.png" alt="instagramQR" />
            </div>
            <button
              onClick={shareToFacebook}
              className="group flex items-center rounded-full px-4 py-2 transition-colors hover:bg-blue-100 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlSpace="preserve"
                viewBox="0 0 16 16"
                width={24}
                height={24}
                id="facebook"
                className="mr-2 transition-transform group-hover:scale-110"
              >
                <path
                  fill="#1976D2"
                  d="M14 0H2C.897 0 0 .897 0 2v12c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V2c0-1.103-.897-2-2-2z"
                />
                <path
                  fill="#FAFAFA"
                  fillRule="evenodd"
                  d="M13.5 8H11V6c0-.552.448-.5 1-.5h1V3h-2a3 3 0 0 0-3 3v2H6v2.5h2V16h3v-5.5h1.5l1-2.5z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-[#1976D2]">Facebook</span>
            </button>
          </div>

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="flex h-20 w-20 items-center justify-center">
              <img src="/instagramQR.png" alt="instagramQR" />
            </div>
            <button
              onClick={shareToInstagram}
              className="group flex items-center rounded-full px-4 py-2 transition-colors hover:bg-pink-100 focus:outline-none"
            >
              <img
                src="https://static.cdninstagram.com/rsrc.php/v4/yV/r/ftfgD2tsNT7.png"
                alt="Instagram Logo"
                className="mr-2 h-7 w-7 group-hover:scale-110"
              />
              <span className="text-pink-400">Instagram</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main QR Code Section */}
      {/* <div className="flex justify-center">
        <img
          src="/path-to-your-qr-code.png"
          alt="QR Code"
          className="h-28 w-28 rounded-lg shadow-md"
        />
      </div> */}
    </div>
  );
};

export default FollowUs;

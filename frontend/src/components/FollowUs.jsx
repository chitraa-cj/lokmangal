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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 102 102"
                id="instagram"
                className="mr-2 transition-transform group-hover:scale-110"
              >
                <defs>
                  <radialGradient
                    id="a"
                    cx="6.601"
                    cy="99.766"
                    r="129.502"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset=".09" stopColor="#fa8f21" />
                    <stop offset=".78" stopColor="#d82d7e" />
                  </radialGradient>
                  <radialGradient
                    id="b"
                    cx="70.652"
                    cy="96.49"
                    r="113.963"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset=".64" stopColor="#8c3aaa" stopOpacity="0" />
                    <stop offset="1" stopColor="#8c3aaa" />
                  </radialGradient>
                </defs>
                <path
                  fill="url(#a)"
                  d="M25.865,101.639A34.341,34.341,0,0,1,14.312,99.5a19.329,19.329,0,0,1-7.154-4.653A19.181,19.181,0,0,1,2.5,87.694,34.341,34.341,0,0,1,.364,76.142C.061,69.584,0,67.617,0,51s.067-18.577.361-25.14A34.534,34.534,0,0,1,2.5,14.312,19.4,19.4,0,0,1,7.154,7.154,19.206,19.206,0,0,1,14.309,2.5,34.341,34.341,0,0,1,25.862.361C32.422.061,34.392,0,51,0s18.577.067,25.14.361A34.534,34.534,0,0,1,87.691,2.5a19.254,19.254,0,0,1,7.154,4.653A19.267,19.267,0,0,1,99.5,14.309a34.341,34.341,0,0,1,2.14,11.553c.3,6.563.361,8.528.361,25.14s-.061,18.577-.361,25.14A34.5,34.5,0,0,1,99.5,87.694,20.6,20.6,0,0,1,87.691,99.5a34.342,34.342,0,0,1-11.553,2.14c-6.557.3-8.528.361-25.14.361s-18.577-.058-25.134-.361"
                />
                <path
                  fill="url(#b)"
                  d="M25.865,101.639A34.341,34.341,0,0,1,14.312,99.5a19.329,19.329,0,0,1-7.154-4.653A19.181,19.181,0,0,1,2.5,87.694,34.341,34.341,0,0,1,.364,76.142C.061,69.584,0,67.617,0,51s.067-18.577.361-25.14A34.534,34.534,0,0,1,2.5,14.312,19.4,19.4,0,0,1,7.154,7.154,19.206,19.206,0,0,1,14.309,2.5,34.341,34.341,0,0,1,25.862.361C32.422.061,34.392,0,51,0s18.577.067,25.14.361A34.534,34.534,0,0,1,87.691,2.5a19.254,19.254,0,0,1,7.154,4.653A19.267,19.267,0,0,1,99.5,14.309a34.341,34.341,0,0,1,2.14,11.553c.3,6.563.361,8.528.361,25.14s-.061,18.577-.361,25.14A34.5,34.5,0,0,1,99.5,87.694,20.6,20.6,0,0,1,87.691,99.5a34.342,34.342,0,0,1-11.553,2.14c-6.557.3-8.528.361-25.14.361s-18.577-.058-25.134-.361"
                />
                <path
                  fill="#fff"
                  d="M461.114,477.413a12.631,12.631,0,1,1,12.629,12.632,12.631,12.631,0,0,1-12.629-12.632m-6.829,0a19.458,19.458,0,1,0,19.458-19.458,19.457,19.457,0,0,0-19.458,19.458m35.139-20.229a4.547,4.547,0,1,0,4.549-4.545h0a4.549,4.549,0,0,0-4.547,4.545m-30.99,51.074a20.943,20.943,0,0,1-7.037-1.3,12.547,12.547,0,0,1-7.193-7.19,20.923,20.923,0,0,1-1.3-7.037c-.184-3.994-.22-5.194-.22-15.313s.04-11.316.22-15.314a21.082,21.082,0,0,1,1.3-7.037,12.54,12.54,0,0,1,7.193-7.193,20.924,20.924,0,0,1,7.037-1.3c3.994-.184,5.194-.22,15.309-.22s11.316.039,15.314.221a21.082,21.082,0,0,1,7.037,1.3,12.541,12.541,0,0,1,7.193,7.193,20.926,20.926,0,0,1,1.3,7.037c.184,4,.22,5.194.22,15.314s-.037,11.316-.22,15.314a21.023,21.023,0,0,1-1.3,7.037,12.547,12.547,0,0,1-7.193,7.19,20.925,20.925,0,0,1-7.037,1.3c-3.994.184-5.194.22-15.314.22s-11.316-.037-15.309-.22m-.314-68.509a27.786,27.786,0,0,0-9.2,1.76,19.373,19.373,0,0,0-11.083,11.083,27.794,27.794,0,0,0-1.76,9.2c-.187,4.04-.229,5.332-.229,15.623s.043,11.582.229,15.623a27.793,27.793,0,0,0,1.76,9.2,19.374,19.374,0,0,0,11.083,11.083,27.813,27.813,0,0,0,9.2,1.76c4.042.184,5.332.229,15.623.229s11.582-.043,15.623-.229a27.8,27.8,0,0,0,9.2-1.76,19.374,19.374,0,0,0,11.083-11.083,27.716,27.716,0,0,0,1.76-9.2c.184-4.043.226-5.332.226-15.623s-.043-11.582-.226-15.623a27.786,27.786,0,0,0-1.76-9.2,19.379,19.379,0,0,0-11.08-11.083,27.748,27.748,0,0,0-9.2-1.76c-4.041-.185-5.332-.229-15.621-.229s-11.583.043-15.626.229"
                  transform="translate(-422.637 -426.196)"
                />
              </svg>
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

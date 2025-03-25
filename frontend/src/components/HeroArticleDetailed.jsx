const HeroArticle = ({ article }) => {
  return (
    <div className="min-w-3xl unselectable mb-2">
      {/* Article Header */}
      <div className="mb-3 pt-2">
        <h1 className="mx-[34px] text-xl font-bold">
          <div dangerouslySetInnerHTML={{ __html: article.title }} />
        </h1>
      </div>

      {/* Main Image / Placeholder */}
      {/* <div className="flex h-full w-full items-center justify-between"> */}
      <img
        src={article.imgUrl}
        alt={article.title}
        className="mx-auto mb-6 h-96 w-[700px] rounded bg-gray-300 object-cover"
      />
      {/* </div> */}

      {/* Share Buttons */}
      <Share />

      {/* Article Content */}
      <div className="prose mx-[34px] mt-6 max-w-none text-black">
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>
    </div>
  );
};

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

  return (
    <div className="ml-[34px] flex h-12 items-center justify-start gap-x-4">
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 102 102"
            id="instagram"
          >
            <defs>
              <radialGradient
                id="a"
                cx="6.601"
                cy="99.766"
                r="129.502"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset=".09" stopColor="#fa8f21"></stop>
                <stop offset=".78" stopColor="#d82d7e"></stop>
              </radialGradient>
              <radialGradient
                id="b"
                cx="70.652"
                cy="96.49"
                r="113.963"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset=".64" stopColor="#8c3aaa" stopOpacity="0"></stop>
                <stop offset="1" stopColor="#8c3aaa"></stop>
              </radialGradient>
            </defs>
            <path
              fill="url(#a)"
              d="M25.865,101.639A34.341,34.341,0,0,1,14.312,99.5a19.329,19.329,0,0,1-7.154-4.653A19.181,19.181,0,0,1,2.5,87.694,34.341,34.341,0,0,1,.364,76.142C.061,69.584,0,67.617,0,51s.067-18.577.361-25.14A34.534,34.534,0,0,1,2.5,14.312,19.4,19.4,0,0,1,7.154,7.154,19.206,19.206,0,0,1,14.309,2.5,34.341,34.341,0,0,1,25.862.361C32.422.061,34.392,0,51,0s18.577.067,25.14.361A34.534,34.534,0,0,1,87.691,2.5a19.254,19.254,0,0,1,7.154,4.653A19.267,19.267,0,0,1,99.5,14.309a34.341,34.341,0,0,1,2.14,11.553c.3,6.563.361,8.528.361,25.14s-.061,18.577-.361,25.14A34.5,34.5,0,0,1,99.5,87.694,20.6,20.6,0,0,1,87.691,99.5a34.342,34.342,0,0,1-11.553,2.14c-6.557.3-8.528.361-25.14.361s-18.577-.058-25.134-.361"
            ></path>
            <path
              fill="url(#b)"
              d="M25.865,101.639A34.341,34.341,0,0,1,14.312,99.5a19.329,19.329,0,0,1-7.154-4.653A19.181,19.181,0,0,1,2.5,87.694,34.341,34.341,0,0,1,.364,76.142C.061,69.584,0,67.617,0,51s.067-18.577.361-25.14A34.534,34.534,0,0,1,2.5,14.312,19.4,19.4,0,0,1,7.154,7.154,19.206,19.206,0,0,1,14.309,2.5,34.341,34.341,0,0,1,25.862.361C32.422.061,34.392,0,51,0s18.577.067,25.14.361A34.534,34.534,0,0,1,87.691,2.5a19.254,19.254,0,0,1,7.154,4.653A19.267,19.267,0,0,1,99.5,14.309a34.341,34.341,0,0,1,2.14,11.553c.3,6.563.361,8.528.361,25.14s-.061,18.577-.361,25.14A34.5,34.5,0,0,1,99.5,87.694,20.6,20.6,0,0,1,87.691,99.5a34.342,34.342,0,0,1-11.553,2.14c-6.557.3-8.528.361-25.14.361s-18.577-.058-25.134-.361"
            ></path>
            <path
              fill="#fff"
              d="M461.114,477.413a12.631,12.631,0,1,1,12.629,12.632,12.631,12.631,0,0,1-12.629-12.632m-6.829,0a19.458,19.458,0,1,0,19.458-19.458,19.457,19.457,0,0,0-19.458,19.458m35.139-20.229a4.547,4.547,0,1,0,4.549-4.545h0a4.549,4.549,0,0,0-4.547,4.545m-30.99,51.074a20.943,20.943,0,0,1-7.037-1.3,12.547,12.547,0,0,1-7.193-7.19,20.923,20.923,0,0,1-1.3-7.037c-.184-3.994-.22-5.194-.22-15.313s.04-11.316.22-15.314a21.082,21.082,0,0,1,1.3-7.037,12.54,12.54,0,0,1,7.193-7.193,20.924,20.924,0,0,1,7.037-1.3c3.994-.184,5.194-.22,15.309-.22s11.316.039,15.314.221a21.082,21.082,0,0,1,7.037,1.3,12.541,12.541,0,0,1,7.193,7.193,20.926,20.926,0,0,1,1.3,7.037c.184,4,.22,5.194.22,15.314s-.037,11.316-.22,15.314a21.023,21.023,0,0,1-1.3,7.037,12.547,12.547,0,0,1-7.193,7.19,20.925,20.925,0,0,1-7.037,1.3c-3.994.184-5.194.22-15.314.22s-11.316-.037-15.309-.22m-.314-68.509a27.786,27.786,0,0,0-9.2,1.76,19.373,19.373,0,0,0-11.083,11.083,27.794,27.794,0,0,0-1.76,9.2c-.187,4.04-.229,5.332-.229,15.623s.043,11.582.229,15.623a27.793,27.793,0,0,0,1.76,9.2,19.374,19.374,0,0,0,11.083,11.083,27.813,27.813,0,0,0,9.2,1.76c4.042.184,5.332.229,15.623.229s11.582-.043,15.623-.229a27.8,27.8,0,0,0,9.2-1.76,19.374,19.374,0,0,0,11.083-11.083,27.716,27.716,0,0,0,1.76-9.2c.184-4.043.226-5.332.226-15.623s-.043-11.582-.226-15.623a27.786,27.786,0,0,0-1.76-9.2,19.379,19.379,0,0,0-11.08-11.083,27.748,27.748,0,0,0-9.2-1.76c-4.041-.185-5.332-.229-15.621-.229s-11.583.043-15.626.229"
              transform="translate(-422.637 -426.196)"
            ></path>
          </svg>
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

export default HeroArticle;

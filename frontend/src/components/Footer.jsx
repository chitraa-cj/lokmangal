const Footer = () => {
  const newsCategories = [
    {
      title: "States News",
      links: [
        "Madhya Pradesh News",
        "Uttar Pradesh News",
        "Rajasthan News",
        "Haryana News",
      ],
    },
    {
      title: "Lifestyle",
      links: ["Health News", "Fitness News", "Fashion News", "Spirituality"],
    },
    {
      title: "Entertainment News",
      links: [
        "Bollywood News",
        "TV Serials",
        "Hollywood News",
        "Movie Reviews",
      ],
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <div className="flex w-full flex-col items-start justify-center bg-gray-800 px-4 py-8 text-white lg:items-center">
      <div className="ml-7 flex w-full flex-col items-start justify-evenly md:ml-0 md:flex-row md:items-center">
        {newsCategories.map((category, index) => (
          <div key={`category-${index}`} className="md:col-span-1 md:ml-10">
            <h3 className="mb-3 mt-4 text-lg font-semibold">
              {category.title}
            </h3>
            <ul className="space-y-2">
              {category.links.map((link, i) => (
                <li key={`link-${index}-${i}`}>
                  <a
                    href="#"
                    className="text-center text-gray-400 hover:text-gray-100"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <footer className="mt-12 w-full border-t border-gray-200 px-2 pt-8 lg:px-28">
        <div className="flex flex-col items-center justify-between lg:flex-row">
          <div>
            {/* <h4 className="font-semibold lg:mb-4">Quick Links</h4> */}
            <div className="flex flex-wrap gap-2">
              {["About Us", "Careers", "Contact Us"].map((link, index) => (
                <span
                  key={`quickLink-${index}`}
                  className="my-2 flex items-center lg:my-0"
                >
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-gray-100"
                  >
                    {link}
                  </a>
                  {index < 2 && <span className="mx-1 text-gray-300">|</span>}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">
              © {currentYear}-25 Lok Mangal Limited
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;

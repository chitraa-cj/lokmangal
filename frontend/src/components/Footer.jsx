const Footer = () => {
  const newsCategories = [
    {
      title: "News From Indian States",
      links: [
        "Madhya Pradesh News",
        "Uttar Pradesh News",
        "Rajasthan News",
        "Haryana News",
        "Bihar News",
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
    <div className="flex w-full flex-col items-center justify-center bg-gray-800 px-4 py-8 text-white">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        {newsCategories.map((category, index) => (
          <div key={`category-${index}`} className="md:col-span-1">
            <h3 className="mb-4 font-semibold">{category.title}</h3>
            <ul className="space-y-2">
              {category.links.map((link, i) => (
                <li key={`link-${index}-${i}`}>
                  <a href="#" className="text-gray-400 hover:text-gray-100">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <footer className="mt-12 border-t border-gray-200 pt-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <h4 className="mb-4 font-semibold">Quick Links</h4>
            <div className="flex flex-wrap gap-2">
              {["About Us", "Careers", "Contact Us"].map((link, index) => (
                <span key={`quicklink-${index}`} className="flex items-center">
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
          <div>
            <h4 className="mb-4 font-semibold">Subscribe</h4>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-l border border-gray-300 px-4 py-2"
              />
              <button className="rounded-r bg-red-600 px-6 py-2 text-white">
                Subscribe
              </button>
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

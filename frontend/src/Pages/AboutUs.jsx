const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0">
          <img
            src="https://picsum.photos/1920/1080?random=1"
            alt="Newsroom"
            className="h-full w-full object-cover opacity-30"
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            About Lokmangal News
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg md:text-xl">
            A rising digital news platform delivering real, impactful journalism
            from the heart of India.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
            <p className="mt-4 leading-relaxed text-gray-600">
              Lokmangal News is a rising digital news platform based in
              Jabalpur, Madhya Pradesh, with a branch office in Mumbai,
              Maharashtra. Established three years ago, we are powered by a
              passionate team of new-age journalists, writers, and editors who
              are committed to delivering real, impactful journalism that
              reflects the truth.
            </p>
            <p className="mt-4 leading-relaxed text-gray-600">
              With our roots in central India and eyes on the nation, Lokmangal
              News is dedicated to fearless reporting, honest storytelling, and
              being a trusted voice for the people.
            </p>
          </div>
          <div>
            <img
              src="https://picsum.photos/600/400?random=2"
              alt="Team at work"
              className="w-full rounded-lg object-cover shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Coverage Section */}
      <section className="bg-gray-100 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">What We Cover</h2>
          <p className="mx-auto mt-4 max-w-3xl text-gray-600">
            We cover all types of news across India, ranging from politics,
            social issues, and current affairs to entertainment, sports,
            business, and more. Our platform is structured into well-organized
            categories, making it easy for readers to access news that matters
            to them.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {["Politics", "Entertainment", "Sports", "Business"].map(
              (category) => (
                <div
                  key={category}
                  className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-xl"
                >
                  <img
                    src={`https://picsum.photos/300/200?random=${category.charCodeAt(0)}`}
                    alt={category}
                    className="mb-4 h-40 w-full rounded-md object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900">
                    {category}
                  </h3>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Multimedia Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div>
            <img
              src="https://picsum.photos/600/400?random=3"
              alt="YouTube Channel"
              className="w-full rounded-lg object-cover shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Our Multimedia Presence
            </h2>
            <p className="mt-4 leading-relaxed text-gray-600">
              In addition to our website, Lokmangal News has an active YouTube
              channel, where we present visual news stories, interviews, ground
              reports, and breaking updates in real-time—ensuring our audience
              stays informed through engaging multimedia content.
            </p>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
            >
              Visit Our YouTube Channel
            </a>
          </div>
        </div>
      </section>

      {/* Footer Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 text-center text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Join Our Journey</h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg">
            Stay informed with Lokmangal News. Explore our stories, watch our
            reports, and be part of a community that values truth and
            transparency.
          </p>
          <a
            href="/news"
            className="mt-8 inline-block rounded-md bg-white px-8 py-3 font-semibold text-blue-600 transition-colors hover:bg-gray-100"
          >
            Explore News
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

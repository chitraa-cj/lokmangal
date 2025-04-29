const Careers = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-blue-700 text-white">
        <div className="absolute inset-0">
          <img
            src="https://picsum.photos/1920/1080?random=4"
            alt="Newsroom"
            className="h-full w-full object-cover opacity-30"
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Careers at Lokmangal News
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg md:text-xl">
            Join our team and shape the future of digital journalism in India.
          </p>
        </div>
      </section>

      {/* About Careers Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Who We Are</h2>
            <p className="mt-4 leading-relaxed text-gray-600">
              Lokmangal News is one of India’s emerging digital news platforms,
              headquartered in Jabalpur, Madhya Pradesh, with a growing presence
              in Mumbai, Maharashtra. Our commitment to truthful journalism,
              innovative storytelling, and audience-centric content sets us
              apart in today’s fast-paced media landscape.
            </p>
            <p className="mt-4 leading-relaxed text-gray-600">
              At Lokmangal News, we believe that authenticity, integrity, and
              passion for reality-driven journalism are the core strengths of
              our team. Our growing digital network—including a category-rich
              news portal and an active YouTube channel—offers dynamic
              opportunities for individuals who are ready to shape the future of
              news.
            </p>
          </div>
          <div>
            <img
              src="https://picsum.photos/600/400?random=5"
              alt="Team Collaboration"
              className="w-full rounded-lg object-cover shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Opportunities Section */}
      <section className="bg-gray-100 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Opportunities with Us
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-gray-600">
            Whether it's ground reporting, digital content creation, editorial
            writing, social media, or video production, we are constantly
            looking for motivated, self-driven professionals who want to make an
            impact. We offer an energetic work environment where collaboration,
            creativity, and personal growth are valued.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Ground Reporting",
              "Digital Content Creation",
              "Video Production",
            ].map((role) => (
              <div
                key={role}
                className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-xl"
              >
                <img
                  src={`https://picsum.photos/300/200?random=${role.charCodeAt(0)}`}
                  alt={role}
                  className="mb-4 h-40 w-full rounded-md object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900">{role}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Join Our Team</h2>
          <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-gray-600">
            If you are looking to take your career forward in a fast-growing
            media house that values truth and innovation, we’d love to hear from
            you.
          </p>
          <p className="mt-6 text-lg font-semibold text-gray-900">
            To join our team, send your resume to:
          </p>
          <a
            href="mailto:careers@lokmangalnews.com"
            className="mt-4 inline-block text-xl text-blue-600 transition-colors hover:text-blue-800"
          >
            📧 careers@lokmangalnews.com
          </a>
          <div className="mt-8">
            <img
              src="https://picsum.photos/600/400?random=6"
              alt="Work Environment"
              className="mx-auto w-full max-w-2xl rounded-lg object-cover shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Footer Call to Action */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-700 py-16 text-center text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Be Part of Our Mission</h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg">
            Join Lokmangal News and contribute to authentic, impactful
            journalism that reaches millions across India.
          </p>
          <a
            href="mailto:careers@lokmangalnews.com"
            className="mt-8 inline-block rounded-md bg-white px-8 py-3 font-semibold text-indigo-600 transition-colors hover:bg-gray-100"
          >
            Apply Now
          </a>
        </div>
      </section>
    </div>
  );
};

export default Careers;

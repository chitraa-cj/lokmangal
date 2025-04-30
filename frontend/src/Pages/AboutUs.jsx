import { Youtube, Newspaper, Users, Video } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 to-rose-700 text-white">
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
            <h2 className="text-3xl font-bold text-gray-900">Know Us</h2>
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
          <div className="flex items-center justify-center">
            <Users className="h-24 w-24 text-red-600" />
          </div>
        </div>
      </section>

      {/* Coverage Section */}
      {/* Uncomment and modify if needed */}
      {/* <section className="bg-gray-100 py-16">
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
            {[
              { category: "Politics", icon: <Newspaper className="h-12 w-12 text-red-600" /> },
              { category: "Entertainment", icon: <Video className="h-12 w-12 text-red-600" /> },
              { category: "Sports", icon: <Video className="h-12 w-12 text-red-600" /> },
              { category: "Business", icon: <Newspaper className="h-12 w-12 text-red-600" /> },
            ].map(({ category, icon }) => (
              <div
                key={category}
                className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-xl"
              >
                <div className="mb-4 flex justify-center">{icon}</div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {category}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Multimedia Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="flex items-center justify-center">
            <Youtube className="h-24 w-24 text-red-600" />
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
              href="https://www.youtube.com/@TheLokMangalNews"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-md bg-red-600 px-6 py-3 text-white transition-colors hover:bg-red-700"
            >
              Visit Our YouTube Channel
            </a>
          </div>
        </div>
      </section>

      {/* Footer Call to Action */}
      <section className="bg-gradient-to-r from-red-600 to-rose-700 py-16 text-center text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Join Our Journey</h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg">
            Stay informed with Lokmangal News. Explore our stories, watch our
            reports, and be part of a community that values truth and
            transparency.
          </p>
          <a
            href="https://chat.whatsapp.com/LKUIQmrovb7HOcXIMipENc"
            className="mt-8 inline-block rounded-md bg-white px-8 py-3 font-semibold text-red-600 transition-colors hover:bg-gray-100"
            target="_blank"
          >
            Explore Our Community
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    "Mobile Number": "",
    Message: "",
    Timestamp: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.Name || formData.Name.length < 3) {
      newErrors.Name = "Name must be at least 3 characters";
    } else if (formData.Name.length > 50) {
      newErrors.Name = "Name must not exceed 50 characters";
    }

    if (!formData.Email) {
      newErrors.Email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      newErrors.Email = "Invalid email address";
    }

    if (!formData["Mobile Number"]) {
      newErrors["Mobile Number"] = "Mobile number is required";
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData["Mobile Number"])) {
      newErrors["Mobile Number"] = "Invalid mobile number format";
    }

    if (!formData.Message || formData.Message.length < 5) {
      newErrors.Message = "Message must be at least 5 characters";
    } else if (formData.Message.length > 500) {
      newErrors.Message = "Message must not exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const dataToSubmit = {
        ...formData,
        Timestamp: new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
      };

      const submitFormData = new FormData();
      Object.entries(dataToSubmit).forEach(([key, value]) => {
        submitFormData.append(key, value);
      });

      const scriptURL = "YOUR_SCRIPT_URL_HERE"; // Replace with your Google Apps Script URL

      await fetch(scriptURL, { method: "POST", body: submitFormData });
      toast.success("Form submitted successfully!");
      setFormData({
        Name: "",
        Email: "",
        "Mobile Number": "",
        Message: "",
        Timestamp: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("Failed to send enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const getInputStatus = (field) => {
    return errors[field]
      ? "border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:ring-blue-500";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-700 to-indigo-600 text-white">
        <div className="absolute inset-0">
          <img
            src="https://picsum.photos/1920/1080?random=7"
            alt="Contact Background"
            className="h-full w-full object-cover opacity-30"
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Contact Lokmangal News
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg md:text-xl">
            Reach out to our team at our headquarters or corporate office.
          </p>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Our Offices
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Headquarters */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="text-2xl font-semibold text-gray-900">
              Headquarters
            </h3>
            <p className="mt-4 h-40 leading-relaxed text-gray-600">
              1 58, Vijay Nagar,
              <br />
              Shatabdipuram Phase 1,
              <br />
              Jabalpur, New Adaresh Colony,
              <br />
              Madhya Pradesh 482002
            </p>
            <img
              src="https://picsum.photos/600/400?random=8"
              alt="Headquarters"
              className="mt-3 w-full rounded-lg object-cover shadow-lg"
            />
          </div>

          {/* Corporate Office */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="text-2xl font-semibold text-gray-900">
              Corporate Office
            </h3>
            <p className="mt-4 h-40 leading-relaxed text-gray-600">
              Vedant Kumar
              <br />
              PR & Entertainment Head
              <br />
              301b 3rd Floor, Royal Plaza,
              <br />
              Above TAP Restobar, Link Road,
              <br />
              Near Infiniti Mall, Andheri West,
              <br />
              Mumbai, Maharashtra
            </p>
            <img
              src="https://picsum.photos/600/400?random=9"
              alt="Corporate Office"
              className="mt-3 w-full rounded-lg object-cover shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div
          id="contact-form"
          className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-md"
        >
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Get in Touch
          </h2>
          <p className="mt-4 text-center text-gray-600">
            Send us a message, and our team will get back to you soon.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="Name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                name="Name"
                id="Name"
                value={formData.Name}
                onChange={handleChange}
                placeholder="Your Name"
                className={`mt-1 w-full rounded border p-2 focus:outline-none focus:ring-2 ${getInputStatus("Name")}`}
              />
              {errors.Name && (
                <p className="mt-1 text-sm text-red-500">{errors.Name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="Email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                name="Email"
                id="Email"
                value={formData.Email}
                onChange={handleChange}
                placeholder="Your Email"
                className={`mt-1 w-full rounded border p-2 focus:outline-none focus:ring-2 ${getInputStatus("Email")}`}
              />
              {errors.Email && (
                <p className="mt-1 text-sm text-red-500">{errors.Email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="Mobile Number"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile Number
              </label>
              <input
                type="tel"
                name="Mobile Number"
                id="Mobile Number"
                value={formData["Mobile Number"]}
                onChange={handleChange}
                placeholder="Your Mobile Number"
                className={`mt-1 w-full rounded border p-2 focus:outline-none focus:ring-2 ${getInputStatus("Mobile Number")}`}
              />
              {errors["Mobile Number"] && (
                <p className="mt-1 text-sm text-red-500">
                  {errors["Mobile Number"]}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="Message"
                className="block text-sm font-medium text-gray-700"
              >
                Message
              </label>
              <textarea
                name="Message"
                id="Message"
                value={formData.Message}
                onChange={handleChange}
                placeholder="Your Message"
                rows="4"
                className={`mt-1 w-full rounded border p-2 focus:outline-none focus:ring-2 ${getInputStatus("Message")}`}
              ></textarea>
              {errors.Message && (
                <p className="mt-1 text-sm text-red-500">{errors.Message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full rounded bg-blue-600 px-4 py-2 text-white ${
                isSubmitting
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </section>

      {/* Footer Call to Action */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-600 py-16 text-center text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Stay Connected</h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg">
            Follow Lokmangal News for the latest updates and join our mission to
            deliver truthful journalism across India.
          </p>
          <a
            href="/news"
            className="mt-8 inline-block rounded-md bg-white px-8 py-3 font-semibold text-blue-700 transition-colors hover:bg-gray-100"
          >
            Explore News
          </a>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;

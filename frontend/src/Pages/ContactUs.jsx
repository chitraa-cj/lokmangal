import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MapPin, Send } from "lucide-react";

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
      : "border-gray-300 focus:ring-red-500";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 to-rose-700 text-white">
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
            <h3 className="flex items-center text-2xl font-semibold text-gray-900">
              <MapPin className="mr-2 h-6 w-6 text-red-600" />
              Headquarters
            </h3>
            <p className="my-4 max-w-72 leading-relaxed text-gray-600">
              1 58, Vijay Nagar, Shatabdipuram Phase 1, Jabalpur, New Adaresh
              Colony, Madhya Pradesh 482002
            </p>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1125.8948021854605!2d79.91331059944437!3d23.17697881060062!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3981b1cc1904c211%3A0x115334dc8f180683!2sThe%20LokMangal%20News!5e1!3m2!1sen!2sin!4v1746006160591!5m2!1sen!2sin"
              width="100%"
              height="450"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Corporate Office */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="flex items-center text-2xl font-semibold text-gray-900">
              <MapPin className="mr-2 h-6 w-6 text-red-600" />
              Corporate Office
            </h3>
            <p className="my-4 max-w-[450px] leading-relaxed text-gray-600">
              Vedant Kumar PR & Entertainment Head 301b 3rd Floor, Royal Plaza,
              Above TAP Restobar, Link Road, Near Infiniti Mall, Andheri West,
              Mumbai, Maharashtra
            </p>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4628.151517382092!2d72.82865197592984!3d19.13971284996787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b63ce0d2ed63%3A0x65d2d93ef25b54d!2sCluster_mumbai%20Suburban_692%20Royal%20Plaza%2C%20New%20Link%20Rd%2C%20Phase%20D%2C%20Shastri%20Nagar%2C%20Andheri%20West%2C%20Mumbai%2C%20Maharashtra%20400053!5e1!3m2!1sen!2sin!4v1746011017864!5m2!1sen!2sin"
              width="100%"
              height="450"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
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
              className={`flex w-full items-center justify-center rounded bg-red-600 px-4 py-2 text-white ${
                isSubmitting
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-red-700"
              }`}
            >
              <Send className="mr-2 h-5 w-5" />
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </section>

      {/* Footer Call to Action */}
      <section className="bg-gradient-to-r from-red-600 to-rose-700 py-16 text-center text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Stay Connected</h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg">
            Follow Lokmangal News for the latest updates and join our mission to
            deliver truthful journalism across India.
          </p>
          <Link
            to="/"
            className="mt-8 inline-block rounded-md bg-white px-8 py-3 font-semibold text-red-600 transition-colors hover:bg-gray-100"
          >
            Explore News
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;

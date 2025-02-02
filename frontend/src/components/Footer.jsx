import React from "react";
import {
  Mail,
  Phone,
  Facebook,
  Link2,
  Instagram,
  Heart,
  Map,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto noPrint">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Business Culture
            </h3>
            <p className="mb-4 text-sm sm:text-base">
              At Business Culture, we build lasting relationships with our
              customers, understanding their needs, exceeding expectations, and
              delivering personalized service.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h4 className="text-lg font-semibold text-white mb-4">Links</h4>
            <div className="flex flex-col items-center sm:items-start">
              <a
                target="_blank"
                href="https://www.facebook.com/businesscultureadagency"
                className="text-gray-400 hover:text-white transition-colors mb-3"
              >
                <div className="flex items-center">
                  <Facebook className="w-5 h-5 mr-3" />
                  Facebook
                </div>
              </a>
              <a
                target="_blank"
                href="https://www.instagram.com/businesscultureagency/"
                className="text-gray-400 hover:text-white transition-colors mb-3"
              >
                <div className="flex items-center">
                  <Instagram className="w-5 h-5 mr-3" />
                  Instagram
                </div>
              </a>
              <a
                target="_blank"
                href="https://businessculture.co.in/"
                className="text-gray-400 hover:text-white transition-colors mb-3"
              >
                <div className="flex items-center">
                  <Link2 className="w-5 h-5 mr-3" />
                  Website
                </div>
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="text-center sm:text-left">
            <h4 className="text-lg font-semibold text-white mb-4">
              Contact Us
            </h4>
            <div className="space-y-3 flex flex-col items-center sm:items-start">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <a
                  target="_blank"
                  href="mailto:deepakdd123@gmail.com"
                  className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                >
                  deepakdd123@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <a
                  target="_blank"
                  href="tel:+919602523456"
                  className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                >
                  9602523456
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <a
                  target="_blank"
                  href="tel:+919827007227"
                  className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                >
                  9827007227
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <a
                  target="_blank"
                  href="tel:0761-2627285"
                  className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                >
                  0761-2627285
                </a>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="text-center sm:text-left">
            <h2 className="text-lg font-semibold text-white mb-4">
              Our Locations
            </h2>
            <a
              target="_blank"
              href="https://maps.app.goo.gl/fFa6XUQaFUEHwV858"
              className="group flex flex-col items-center sm:items-start"
            >
              <Map className="mb-3 text-gray-400 group-hover:text-white transition-colors" />
              <span className="text-sm sm:text-base text-gray-400 group-hover:text-white transition-colors flex items-center">
                <span>
                  Regd. Office: 1563, 2nd Floor, Vidya Height, Dr. Barat Road,
                  Russel Chowk, Jabalpur (M.P.) 482002
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-center sm:text-left">
            <div className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-0">
              <span>
                © {currentYear} Business Culture. All rights reserved.
              </span>
            </div>
            <div className="flex items-center justify-center text-xs sm:text-sm text-gray-400">
              <span className="flex items-center">
                Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> by
                Business Culture Team
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

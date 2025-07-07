import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from "react-icons/fi";
import { FaInfoCircle } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [notification, setNotification] = useState("");

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const socialLinks = [
    {
      name: "GitHub",
      icon: <FiGithub />,
      url: "https://github.com",
    },
    {
      name: "Twitter",
      icon: <FiTwitter />,
      url: "https://twitter.com",
    },
    {
      name: "LinkedIn",
      icon: <FiLinkedin />,
      url: "https://linkedin.com",
    },
    {
      name: "Email",
      icon: <FiMail />,
      url: "mailto:aniket.jadhav20703@gmail.com",
    },
  ];

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const iconVariants = {
    hover: {
      y: -3,
      scale: 1.1,
      color: "#818cf8",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10,
      },
    },
    tap: { scale: 0.9 },
  };

  return (
    <>
      {/* Toast Notification (centered under navbar) */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-[4.5rem] left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-full shadow-lg text-sm flex items-center gap-2 animate-fade-in-out">
              <FaInfoCircle className="text-white" />
              {notification}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.footer
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={footerVariants}
        className="mt-20 px-4 sm:px-6 lg:px-8 py-10 bg-transparent text-white"
      >
        <div className="max-w-7xl mx-auto text-center">
          {/* Social Icons */}
          <div className="flex justify-center space-x-6 mb-6">
            {socialLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={iconVariants}
                whileHover="hover"
                whileTap="tap"
                className="text-slate-400 hover:text-indigo-400 text-xl transition"
                aria-label={link.name}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>

          {/* Copyright + Links */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-slate-400">
            <span>© {currentYear} AI Code Assistant. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <div className="flex space-x-4">
              <button
                onClick={() => showToast("Privacy Policy will be added soon.")}
                className="hover:text-indigo-400 transition text-slate-400"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => showToast("Terms of Service will be added soon.")}
                className="hover:text-indigo-400 transition text-slate-400"
              >
                Terms of Service
              </button>
              <a
                href="mailto:aniket.jadhav20703@gmail.com"
                className="hover:text-indigo-400 transition"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </motion.footer>
    </>
  );
};

export default Footer;

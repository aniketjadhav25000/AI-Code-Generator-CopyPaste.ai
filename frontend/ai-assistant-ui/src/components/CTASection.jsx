import React from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/generate');
  };

  return (
    <section className="relative mt-10 px-4 sm:px-10 sm:pb-10 bg-transparent">
      <motion.div
        className="max-w-5xl mx-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm text-white shadow-lg p-8 sm:p-14 text-center transition duration-300"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Rocket className="mx-auto mb-4 text-cyan-400 w-10 h-10 animate-bounce" />
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Ready to{' '}
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Code Smarter
          </span>
          ?
        </h2>
        <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base mb-8">
          Let AI take care of the boilerplate. Focus on logic, not syntax. No sign-up needed to start generating code instantly.
        </p>
        <button
          onClick={handleClick}
          className="px-8 py-3 text-base sm:text-lg font-semibold rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition transform hover:scale-105 shadow-lg"
        >
          🚀 Start Generating Code
        </button>
      </motion.div>
    </section>
  );
};

export default CTASection;

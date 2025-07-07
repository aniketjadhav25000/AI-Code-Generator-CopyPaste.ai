import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Brain,
  Code2,
  ShieldCheck,
  Activity,
  MonitorSmartphone,
} from 'lucide-react';

const features = [
  {
    icon: <Sparkles className="w-9 h-9 sm:w-10 sm:h-10 text-cyan-400" />,
    title: 'Instant Code Magic',
    desc: 'Generate complete code blocks in seconds with AI precision.',
  },
  {
    icon: <Brain className="w-9 h-9 sm:w-10 sm:h-10 text-purple-400" />,
    title: 'Smart AI Suggestions',
    desc: 'Receive intelligent, context-aware enhancements for your code.',
  },
  {
    icon: <Code2 className="w-9 h-9 sm:w-10 sm:h-10 text-indigo-400" />,
    title: 'Multi-Language Support',
    desc: 'Write in Python, JavaScript, SQL, React, Node, and more.',
  },
  {
    icon: <ShieldCheck className="w-9 h-9 sm:w-10 sm:h-10 text-pink-400" />,
    title: 'Private & Secure',
    desc: 'No code is saved. Your sessions are completely secure and isolated.',
  },
  {
    icon: <Activity className="w-9 h-9 sm:w-10 sm:h-10 text-blue-400" />,
    title: 'Optimized for Speed',
    desc: 'Lightning-fast generation and response time at your fingertips.',
  },
  {
    icon: <MonitorSmartphone className="w-9 h-9 sm:w-10 sm:h-10 text-teal-400" />,
    title: 'Fully Responsive',
    desc: 'Works perfectly on mobile, tablet, and desktop without compromise.',
  },
];

const FeaturesSection = () => {
  return (
    <section className="relative mt-10 px-4 sm:px-8 py-10 sm:py-28 bg-transparent backdrop-blur-md">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5 sm:mb-6 leading-snug"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Discover What <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">CopyPaste.ai</span> Can Do
        </motion.h2>

        <p className="text-slate-300 text-sm sm:text-base max-w-md sm:max-w-2xl mx-auto mb-12 sm:mb-14 leading-relaxed">
          From intelligent code generation to security and speed, we’ve got everything developers need — beautifully wrapped in an AI-powered experience.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">

          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="group bg-white/5 border border-white/10 backdrop-blur-lg rounded-xl p-5 sm:p-6 shadow-xl hover:shadow-purple-600/40 hover:border-purple-400/40 transition-all duration-300 hover:-translate-y-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              <div className="mb-3 sm:mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">{feature.title}</h3>
              <p className="text-slate-300 text-xs sm:text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

import React, { useState, useEffect, useRef } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

import CountingAnimation from './CountingAnimation';
import aiAnimation from '../../assets/ai-animation.json';
import exampleLottie from '../../assets/example-lottie.json';
import ParticlesBackground from '../ParticlesBackground';

const HeroSection = () => {
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [showExamples, setShowExamples] = useState(false);
  const [activeSnippet, setActiveSnippet] = useState(0);
  const [direction, setDirection] = useState(1);
  const exampleRef = useRef(null);

  const navigate = useNavigate();

  const texts = ['Python', 'React', 'APIs', 'Java', 'SQL', 'HTML/CSS'];

  const snippets = [
    {
      language: 'React',
      code: `const Button = () => (
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
    Click Me
  </button>
);`,
      color: 'bg-blue-500',
      textColor: 'text-blue-400'
    },
    {
      language: 'Python',
      code: `def greet(name):
  return f"Hello, {name}!"

print(greet("Developer"))`,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-400'
    },
    {
      language: 'SQL',
      code: `SELECT username, total FROM users
JOIN orders ON users.id = orders.user_id
WHERE users.active = 1
ORDER BY orders.created_at DESC
LIMIT 10;`,
      color: 'bg-purple-500',
      textColor: 'text-purple-400'
    },
    {
      language: 'Node.js',
      code: `const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.listen(3000, () => console.log('Server running'));`,
      color: 'bg-green-500',
      textColor: 'text-green-400'
    },
  ];

  // Typing animation
  useEffect(() => {
    let ticker;
    const i = loopNum % texts.length;
    const fullText = texts[i];

    if (!isDeleting && typedText === fullText) {
      ticker = setTimeout(() => setIsDeleting(true), 1600);
    } else if (isDeleting && typedText === '') {
      ticker = setTimeout(() => {
        setIsDeleting(false);
        setLoopNum(prev => prev + 1);
      }, 300);
    } else {
      ticker = setTimeout(() => {
        const updatedText = isDeleting
          ? fullText.substring(0, typedText.length - 1)
          : fullText.substring(0, typedText.length + 1);
        setTypedText(updatedText);
      }, isDeleting ? 40 : 80);
    }

    return () => clearTimeout(ticker);
  }, [typedText, isDeleting, loopNum]);

  // Auto-scroll carousel
  useEffect(() => {
    if (!showExamples) return;
    const interval = setInterval(() => {
      setDirection(1);
      setActiveSnippet(prev => (prev + 1) % snippets.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [showExamples]);

  const scrollToExamples = () => {
    setShowExamples(true);
    setTimeout(() => {
      if (exampleRef.current) {
        exampleRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleGenerateClick = () => {
    navigate('/generate');
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveSnippet(prev => (prev - 1 + snippets.length) % snippets.length);
  };

  const handleNext = () => {
    setDirection(1);
    setActiveSnippet(prev => (prev + 1) % snippets.length);
  };

  return (
    
    <section className="relative text-white overflow-hidden px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-0">
        {/* Left Side */}
        <div className="w-full lg:w-1/2 text-center lg:text-left space-y-4 order-2 lg:order-1 font-poppins">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Build Faster With <br />
            <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
              CopyPaste.ai
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-300 max-w-xl mx-auto lg:mx-0">
            Your intelligent assistant that writes{' '}
            <br />
            <span className="text-blue-400 font-semibold">{typedText}</span>
            <span className="ml-1 inline-block w-2 h-6 bg-blue-400 animate-blink rounded-sm"></span>{' '}
            <br />
            code instantly.
          </p>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
            <button
              onClick={scrollToExamples}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold text-sm sm:text-base shadow-lg transition transform hover:-translate-y-1 hover:shadow-xl"
            >
              View Examples
            </button>
            <button
              onClick={handleGenerateClick}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg text-white font-semibold text-sm sm:text-base shadow-lg transition transform hover:-translate-y-1 hover:shadow-xl"
            >
              Generate Code Free
            </button>
          </div>

          <div className="flex justify-center lg:justify-start gap-y-6 gap-x-8 pt-8 flex-wrap">
            <div className="text-center">
              <CountingAnimation target="10K+" duration={1000} />
              <div className="text-sm text-slate-400">Developers</div>
            </div>
            <div className="text-center">
              <CountingAnimation target="25+" duration={1000} />
              <div className="text-sm text-slate-400">Languages</div>
            </div>
            <div className="text-center">
              <CountingAnimation target="1M+" duration={1000} />
              <div className="text-sm text-slate-400">Lines Generated</div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-1/2 flex justify-center order-1 lg:order-2">
          <Player
            autoplay
            loop
            src={aiAnimation}
            className="w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px]"
          />
        </div>
      </div>

      {/* Examples Section */}
      {showExamples && (
        <div
          ref={exampleRef}
          className="max-w-6xl mx-auto mt-12 flex flex-col md:flex-row gap-10 items-center justify-center animate-fade-in px-4"
        >
          <div className="w-full md:w-1/2 flex justify-center">
            <Player
              autoplay
              loop
              src={exampleLottie}
              className="w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] md:w-[380px] md:h-[380px]"
            />
          </div>

          <div className="w-full md:w-1/2 h-[300px] relative">
            <div className="absolute inset-0 flex items-center justify-between z-10">
              <button
                onClick={handlePrev}
                className="ml-2 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700/90 text-white shadow-lg hover:scale-110 transition"
              >
                ←
              </button>
              <button
                onClick={handleNext}
                className="mr-2 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700/90 text-white shadow-lg hover:scale-110 transition"
              >
                →
              </button>
            </div>

            <div className="relative h-full overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeSnippet}
                  custom={direction}
                  initial={{
                    x: direction > 0 ? '100%' : '-100%',
                    opacity: 0,
                    filter: 'blur(4px)'
                  }}
                  animate={{
                    x: 0,
                    opacity: 1,
                    filter: 'blur(0)',
                    transition: {
                      duration: 0.6,
                      ease: 'easeOut'
                    }
                  }}
                  exit={{
                    x: direction > 0 ? '-100%' : '100%',
                    opacity: 0,
                    filter: 'blur(4px)',
                    transition: {
                      duration: 0.6,
                      ease: 'easeIn'
                    }
                  }}
                  className={`absolute w-full h-full bg-[#0f172a] border ${snippets[activeSnippet].color.replace('bg', 'border')} rounded-xl p-6 shadow-2xl`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className={`${snippets[activeSnippet].textColor} font-semibold`}>
                      {snippets[activeSnippet].language}
                    </h3>
                    <div className="flex space-x-1">
                      {snippets.map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeSnippet ? snippets[activeSnippet].color : 'bg-slate-600'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <pre className="text-slate-200 text-sm whitespace-pre-wrap font-mono">
                    {snippets[activeSnippet].code}
                  </pre>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      <style jsx="true">{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }

        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;

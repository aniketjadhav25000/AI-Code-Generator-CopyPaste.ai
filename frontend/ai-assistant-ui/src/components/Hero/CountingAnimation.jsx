// src/components/CountingAnimation.jsx (adjust path as per your project)
import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const CountingAnimation = ({ target, duration = 1000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true, // Animation will only play once when it comes into view
    threshold: 0.5,     // Trigger when 50% of the component is visible
  });

  useEffect(() => {
    if (!inView) {
      return;
    }

    const start = 0;
    // Parse the target number, handling 'K', 'M', '+'
    const end = parseFloat(target.replace(/[KM\+]/g, ''));
    let startTime = null;

    const animateCount = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsedTime = currentTime - startTime;

      // Calculate raw progress (0 to 1)
      const rawProgress = Math.min(elapsedTime / duration, 1);

      // Apply a cubic ease-out function for faster start and slower end
      const easedProgress = 1 - Math.pow(1 - rawProgress, 3);

      const animatedCount = Math.floor(easedProgress * (end - start) + start);
      setCount(animatedCount);

      if (rawProgress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setCount(end); // Ensure the final number is exactly the target
      }
    };

    requestAnimationFrame(animateCount);

  }, [target, duration, inView]);

  const formatNumber = (num) => {
    // Determine the correct suffix based on the original target string
    if (target.includes('K')) return `${num}K+`;
    if (target.includes('M')) return `${num}M+`;
    // For targets like "25+", ensure the "+" is added if it's part of the original target
    if (target.includes('+') && !target.includes('K') && !target.includes('M')) return `${num}+`;
    return `${num}${suffix}`;
  };

  return (
    <div ref={ref} className="text-3xl font-bold text-cyan-400">
      {formatNumber(count)}
    </div>
  );
};

export default CountingAnimation;
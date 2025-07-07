  import React from 'react';

  const ParticlesBackground = () => (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] opacity-100" />
      <div className="absolute inset-0">
        {Array.from({ length: 80 }).map((_, i) => {
          const size = Math.random() * 3 + 1;
          const duration = Math.random() * 15 + 10;
          const delay = Math.random() * 15;
          const left = Math.random() * 100;
          const opacity = Math.random() * 0.2 + 0.05;
          return (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-particle"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                bottom: `-${size}px`,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
                opacity: opacity,
              }}
            />
          );
        })}
      </div>
    </div>
  );

  export default ParticlesBackground;
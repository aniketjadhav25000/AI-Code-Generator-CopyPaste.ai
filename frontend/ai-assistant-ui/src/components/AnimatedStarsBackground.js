import React from 'react';

const AnimatedStarsBackground = () => (
  <div className="fixed inset-0 -z-10">
    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-indigo-900 to-black relative overflow-hidden">
      <div className="absolute inset-0">
        <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <g fill="white" fillOpacity="0.2">
            {Array.from({ length: 150 }).map((_, i) => {
              const x = Math.random() * 100;
              const y = Math.random() * 100;
              const r = Math.random() * 1.5 + 0.2;
              const duration = Math.random() * 10 + 5;
              const delay = Math.random() * 10;
              return (
                <circle
                  key={i}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r={r}
                  className="animate-twinkle"
                  style={{
                    animationDuration: `${duration}s`,
                    animationDelay: `${delay}s`
                  }}
                />
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  </div>
);

export default AnimatedStarsBackground;

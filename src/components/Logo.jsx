import React from 'react';

/**
 * Text Cleanup Studio Brand Logo
 * 
 * Distinctive modern emblem: 
 * Clean geometric squircle with stylized alignment bars & transformation sparkle.
 */
export default function Logo({ size = 40, className = '' }) {
  return (
    <div 
      className={`relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 text-white shadow-sm ring-1 ring-blue-600/20 shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-3/5 h-3/5 text-white drop-shadow-xs"
      >
        {/* Top Text Line (being transformed) */}
        <path
          d="M6 9H17"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        
        {/* Middle Text Line */}
        <path
          d="M6 16H26"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeOpacity="0.95"
        />

        {/* Bottom Text Line */}
        <path
          d="M6 23H20"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeOpacity="0.85"
        />

        {/* 4-Point Radiant Clean Sparkle / Wand Star */}
        <path
          d="M23 5C23 7.8 20.8 10 18 10C20.8 10 23 12.2 23 15C23 12.2 25.2 10 28 10C25.2 10 23 7.8 23 5Z"
          fill="#38BDF8"
        />
        <circle cx="23" cy="10" r="1.2" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

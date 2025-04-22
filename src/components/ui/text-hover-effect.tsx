"use client";
import React, { useRef, useState } from "react";

export const TextHoverEffect = ({ text }: { text: string }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
    }
  };

  const gradientId = `textGradient-${text.replace(/\s+/g, '')}`;
  const maskId = `textMask-${text.replace(/\s+/g, '')}`;
  const glowId = `glow-${text.replace(/\s+/g, '')}`;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex items-center justify-center w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid meet">
        <defs>
          {/* Base gradient for normal state */}
          <linearGradient id={`${gradientId}-base`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>

          {/* Hover effect gradient */}
          <radialGradient
            id={gradientId}
            cx={`${mousePosition.x}%`}
            cy={`${mousePosition.y}%`}
            r="80%"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#F0F9FF" />
            <stop offset="25%" stopColor="#BAE6FD" />
            <stop offset="50%" stopColor="#7DD3FC" />
            <stop offset="75%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </radialGradient>

          {/* Glow effect */}
          <filter id={glowId}>
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <mask id={maskId}>
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {isHovered && (
              <circle
                cx={`${mousePosition.x}%`}
                cy={`${mousePosition.y}%`}
                r="40%"
                fill="black"
              />
            )}
          </mask>
        </defs>

        {/* Glow effect base */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="text-6xl sm:text-8xl font-bold"
          fill="rgba(59, 130, 246, 0.2)"
          filter={`url(#${glowId})`}
          stroke="rgba(59, 130, 246, 0.1)"
          strokeWidth="8"
        >
          {text}
        </text>

        {/* Base text with gradient */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="text-6xl sm:text-8xl font-bold"
          fill={`url(#${gradientId}-base)`}
          stroke="#1E40AF"
          strokeWidth="2"
        >
          {text}
        </text>

        {/* Interactive hover effect */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="text-6xl sm:text-8xl font-bold"
          fill={isHovered ? `url(#${gradientId})` : "transparent"}
          stroke={isHovered ? "#fff" : "transparent"}
          strokeWidth="1"
          mask={`url(#${maskId})`}
        >
          {text}
        </text>

        {/* Outline enhancement */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="text-6xl sm:text-8xl font-bold"
          fill="transparent"
          stroke="#1E40AF"
          strokeWidth="0.5"
        >
          {text}
        </text>
      </svg>
    </div>
  );
};

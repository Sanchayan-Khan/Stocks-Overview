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

  // Define a unique ID for each gradient to avoid conflicts when multiple instances are used
  const gradientId = `textGradient-${text.replace(/\s+/g, '')}`;
  const maskId = `textMask-${text.replace(/\s+/g, '')}`;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex items-center justify-center w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <svg width="100%" height="100%" viewBox="0 0 400 100">
        <defs>
          <radialGradient
            id={gradientId}
            cx={`${mousePosition.x}%`}
            cy={`${mousePosition.y}%`}
            r="50%"
            gradientUnits="userSpaceOnUse"
          >
            {/* Sleek metallic gradient (silvery-blue hues) */}
            <stop offset="0%" stopColor="#B4B6B8" />
            <stop offset="25%" stopColor="#A6A9B6" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="75%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#6EE7B7" />
          </radialGradient>

          <mask id={maskId}>
            <rect x="0" y="0" width="100%" height="100%" fill="black" />
            {isHovered && (
              <circle
                cx={`${mousePosition.x}%`}
                cy={`${mousePosition.y}%`}
                r="30%"
                fill="white"
              />
            )}
          </mask>
        </defs>

        {/* Base outline text */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="text-8xl font-bold fill-transparent stroke-gray-700"
          strokeWidth="1"
        >
          {text}
        </text>

        {/* Colored highlight text */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="text-8xl font-bold"
          fill={isHovered ? `url(#${gradientId})` : "transparent"}
          mask={`url(#${maskId})`}
        >
          {text}
        </text>
      </svg>
    </div>
  );
};

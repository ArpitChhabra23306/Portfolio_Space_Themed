"use client";

import { useRef, useState } from "react";
import Image from "next/image";

/**
 * Handles image/gif/video preview with hover play behavior.
 * GIF/video plays on hover, pauses/resets on leave.
 * @param {{ mediaUrl: string, mediaType: 'image'|'gif'|'video', alt: string, className?: string, priority?: boolean }} props
 */
export default function ProjectMedia({ mediaUrl, mediaType, alt, className = "", priority = false }) {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseEnter() {
    setIsHovered(true);
    if (mediaType === "video" && videoRef.current) {
      videoRef.current.play();
    }
  }

  function handleMouseLeave() {
    setIsHovered(false);
    if (mediaType === "video" && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }

  function handleFocus() {
    handleMouseEnter();
  }

  function handleBlur() {
    handleMouseLeave();
  }

  if (mediaType === "video") {
    return (
      <div
        className={`relative overflow-hidden ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <video
          ref={videoRef}
          src={mediaUrl}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={alt}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // For gif: show static poster when not hovered, animate on hover
  // For image: just display normally
  if (mediaType === "gif") {
    return (
      <div
        className={`relative overflow-hidden ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex={0}
        role="img"
        aria-label={alt}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mediaUrl}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity ${
            isHovered ? "opacity-100" : "opacity-80"
          }`}
        />
      </div>
    );
  }

  // Static image
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={mediaUrl}
        alt={alt}
        fill
        priority={priority}
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}

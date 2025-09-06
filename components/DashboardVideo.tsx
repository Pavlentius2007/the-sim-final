'use client'

import React, { useRef, useState, useEffect } from 'react'

interface DashboardVideoProps {
  videoSrc: string
  fallbackImage: string
}

export default function DashboardVideo({ videoSrc, fallbackImage }: DashboardVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    console.error("Video failed to load or play:", videoSrc)
    setHasError(true)
  }

  // Auto-play video on load
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true
      videoRef.current.playsInline = true
      videoRef.current.loop = true
      videoRef.current.autoplay = true
      
      // Start playing immediately
      videoRef.current.play().catch(error => {
        console.error("Error attempting to play video:", error)
        setHasError(true)
      })
    }
  }, [])

  if (hasError) {
    return (
      <div className="relative rounded-xl overflow-hidden bg-gray-800 border-2 border-blue-500/30 shadow-2xl">
        <img
          src={fallbackImage}
          alt="Dashboard Preview Fallback"
          className="w-full h-auto object-cover"
        />
        <p className="absolute inset-0 flex items-center justify-center text-red-400 bg-black bg-opacity-50">
          Error loading video.
        </p>
      </div>
    )
  }

  return (
    <div className="relative rounded-xl overflow-hidden bg-gray-800 border-2 border-blue-500/30 shadow-2xl">
      <video
        ref={videoRef}
        src={videoSrc}
        poster={fallbackImage}
        muted
        loop
        autoPlay
        playsInline
        preload="auto"
        className="w-full h-auto object-cover"
        onError={handleError}
      />
    </div>
  )
}

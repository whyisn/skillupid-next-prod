// components/SignedMuxPlayer.js
"use client";
import { useEffect, useState, useRef } from "react"; 

// [PERUBAHAN KRITIS] Tambahkan onTimeUpdate di props
export default function SignedMuxPlayer({ playbackId, onCompleted, onTimeUpdate }) {
  const [src, setSrc] = useState(null);
  const videoRef = useRef(null); 

  useEffect(() => {
    let mounted = true;
    fetch(`/api/video/signed/${playbackId}`)
      .then(r => r.json())
      .then(({ url }) => { if (mounted) setSrc(url); });
    return () => { mounted = false; };
  }, [playbackId]);

  const handleVideoEnd = () => {
    if (onCompleted) {
      onCompleted(); 
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && onTimeUpdate) {
      // Panggil onTimeUpdate dengan data waktu saat ini dan durasi video
      onTimeUpdate({ 
        currentTime: videoRef.current.currentTime, 
        duration: videoRef.current.duration 
      }); 
    }
  };

  const handleMetadataLoaded = () => {
    if (videoRef.current) {
      console.log('DURASI VIDEO ASLI (detik):', videoRef.current.duration);
    }
  };

  if (!src) return <div className="aspect-video bg-gray-100 animate-pulse rounded-xl" />;
  
  return (
    <video
      ref={videoRef} 
      className="w-full aspect-video rounded-xl bg-black"
      controls
      src={src}
      playsInline
      onEnded={handleVideoEnd} 
      onLoadedMetadata={handleMetadataLoaded} 
      onTimeUpdate={handleTimeUpdate} // <--- PERUBAHAN KRITIS: Tambahkan event onTimeUpdate
    />
  );
}
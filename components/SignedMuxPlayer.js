// components/SignedMuxPlayer.js
"use client";
import { useEffect, useState } from "react";

export default function SignedMuxPlayer({ playbackId, onCompleted }) {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/video/signed/${playbackId}`)
      .then(r => r.json())
      .then(({ url }) => { if (mounted) setSrc(url); });
    return () => { mounted = false; };
  }, [playbackId]);

  useEffect(() => {
    // DEMO: panggil onCompleted setelah 5 detik (ganti dengan event ended player sebenarnya)
    if (!onCompleted) return;
    const t = setTimeout(() => onCompleted(), 5000);
    return () => clearTimeout(t);
  }, [onCompleted, playbackId]);

  if (!src) return <div className="aspect-video bg-gray-100 animate-pulse rounded-xl" />;
  // Gunakan native video element (HLS modern) atau <mux-player> bila kamu menambah dependensi
  return (
    <video
      className="w-full aspect-video rounded-xl bg-black"
      controls
      src={src}
      playsInline
    />
  );
}

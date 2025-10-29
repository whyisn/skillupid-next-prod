"use client";
import { useEffect, useState } from "react";

export default function SignedMuxPlayer({ playbackId, onCompleted }) {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/video/signed/${playbackId}`)
      .then((r) => r.json())
      .then(({ url }) => {
        if (mounted) setSrc(url);
      });
    return () => {
      mounted = false;
    };
  }, [playbackId]);

  useEffect(() => {
    if (!onCompleted) return;
    const t = setTimeout(() => onCompleted(), 5000);
    return () => clearTimeout(t);
  }, [onCompleted, playbackId]);

  if (!src)
    return <div className="aspect-video bg-gray-100 animate-pulse rounded-2xl" />;

  return (
    <video
      className="w-full aspect-video rounded-2xl bg-black border border-borderLight shadow-sm"
      controls
      src={src}
      playsInline
    />
  );
}

// components/SignedMuxPlayer.js
"use client";
import { useEffect, useState, useRef } from "react"; // 1. Tambahkan useRef

export default function SignedMuxPlayer({ playbackId, onCompleted }) {
  const [src, setSrc] = useState(null);
  const videoRef = useRef(null); // 2. Buat ref untuk elemen video

  useEffect(() => {
    let mounted = true;
    fetch(`/api/video/signed/${playbackId}`)
      .then(r => r.json())
      .then(({ url }) => { if (mounted) setSrc(url); });
    return () => { mounted = false; };
  }, [playbackId]);

  // Hapus useEffect timer yang lama (simulasi 5 detik)
  // useEffect(() => {
  //   // DEMO: panggil onCompleted setelah 5 detik...
  // }, [onCompleted, playbackId]);

  // 3. Fungsi untuk event 'ended' yang sebenarnya
  const handleVideoEnd = () => {
    if (onCompleted) {
      onCompleted(); // Panggil 'onCompleted' saat video benar-benar selesai
    }
  };

  // 4. Fungsi untuk membaca metadata video (termasuk durasi)
  const handleMetadataLoaded = () => {
    if (videoRef.current) {
      console.log('DURASI VIDEO ASLI (detik):', videoRef.current.duration);
      // Buka konsol browser (Inspect Element > Console)
      // Anda akan melihat angka seperti 540 (9 menit) di sini.
      // Ini adalah angka yang seharusnya ada di database Anda.
    }
  };

  if (!src) return <div className="aspect-video bg-gray-100 animate-pulse rounded-xl" />;
  
  return (
    <video
      ref={videoRef} // 5. Tambahkan ref
      className="w-full aspect-video rounded-xl bg-black"
      controls
      src={src}
      playsInline
      onEnded={handleVideoEnd} // 6. Ganti timer dengan event 'ended'
      onLoadedMetadata={handleMetadataLoaded} // 7. Tambahkan event 'loadedmetadata'
    />
  );
}
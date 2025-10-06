/**
 * Video provider helper (Mux or Vimeo).
 * In production, prefer Mux for signed playback.
 * These helpers return an embeddable URL or player props.
 */
export function getVideoEmbed({ provider, videoId }){
  const p = (provider || process.env.VIDEO_PROVIDER || 'mux').toLowerCase();
  if(p === 'vimeo'){
    // Basic embed (set privacy on Vimeo)
    return { type: 'iframe', src: `https://player.vimeo.com/video/${videoId}` };
  }
  // Default Mux: public playback ID (for demo). For signed, create an API route that signs URL.
  return { type: 'iframe', src: `https://stream.mux.com/${videoId}.m3u8` };
}

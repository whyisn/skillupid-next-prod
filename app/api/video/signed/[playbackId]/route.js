// // app/api/video/signed/[playbackId]/route.js
// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// export async function GET(req, { params }) {
//   const { playbackId } = params;
//   const keyId = process.env.MUX_SIGNING_KEY_ID;
//   const privateKey = process.env.MUX_SIGNING_PRIVATE_KEY?.replace(/\\n/g, "\n");

//   if (!keyId || !privateKey)
//     return NextResponse.json({ url: `https://stream.mux.com/${playbackId}.m3u8` });

//   const token = jwt.sign(
//     {
//       sub: playbackId,
//       aud: "v",
//       exp: Math.floor(Date.now() / 1000) + 3600, // 1 jam
//     },
//     privateKey,
//     { algorithm: "RS256", keyid: keyId }
//   );

//   const url = `https://stream.mux.com/${playbackId}.m3u8?token=${token}`;
//   return NextResponse.json({ url });
// }

// app/api/video/signed/[playbackId]/route.js
import { NextResponse } from "next/server";
import { SignJWT, importPKCS8 } from "jose";

export async function GET(_req, { params }) {
  const { playbackId } = params;

//   const keyId = process.env.MUX_SIGNING_KEY_ID;
//   const privateKeyPEM = process.env.MUX_SIGNING_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const keyId = process.env.MUX_SIGNING_KEY_ID;
  const rawKey = process.env.MUX_SIGNING_PRIVATE_KEY;
  // terima 2 format: multiline (BEGIN PRIVATE KEY ... END) atau single-line \n
  const privateKeyPEM = rawKey?.includes("\\n") ? rawKey.replace(/\\n/g, "\n") : rawKey;

  // fallback publik jika key tidak ada/invalid
  const fallback = () => NextResponse.json({ url: `https://stream.mux.com/${playbackId}.m3u8` });
  if (!keyId || !privateKeyPEM) return fallback();

//   // RS256 signing dengan jose
//   const alg = "RS256";
//   const key = await importPKCS8(privateKeyPEM, alg);
//   const token = await new SignJWT({})
//     .setProtectedHeader({ alg, kid: keyId })
//     .setSubject(playbackId)
//     .setAudience("v")
//     .setExpirationTime("1h")
//     .sign(key);

//   const url = `https://stream.mux.com/${playbackId}.m3u8?token=${token}`;
//   return NextResponse.json({ url });
  try {
    const alg = "RS256";
    const key = await importPKCS8(privateKeyPEM, alg);
    const token = await new SignJWT({})
      .setProtectedHeader({ alg, kid: keyId })
      .setSubject(playbackId)
      .setAudience("v")
      .setExpirationTime("1h")
      .sign(key);
    const url = `https://stream.mux.com/${playbackId}.m3u8?token=${token}`;
    return NextResponse.json({ url });
  } catch (e) {
    // jika key salah (wrong tag, invalid keyData), pakai URL publik agar tidak 500
    return fallback();
  }
}
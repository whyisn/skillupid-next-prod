// // lib/certificates.js
// import dayjs from "dayjs";
// import { supabaseAdmin } from "./supabase-server.js";
// import puppeteer from "puppeteer";

// // HTML TEMPLATE SERTIFIKAT
// function buildCertificateHTML({ userName, courseTitle, code }) {
//   const issuedAt = dayjs().format("DD MMMM YYYY");

//   return /* html */ `
// <!DOCTYPE html>
// <html lang="id">
// <head>
//   <meta charset="UTF-8" />
//   <title>Sertifikat</title>
//   <style>
//     @page {
//       size: A4 landscape;
//       margin: 0;
//     }
//     * {
//       box-sizing: border-box;
//     }
//     body {
//       margin: 0;
//       padding: 0;
//       font-family: "Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
//       background: #f3f4f6;
//     }
//     .page {
//       position: relative;
//       width: 1123px;
//       height: 794px;
//       padding: 60px 80px;
//       background: white;
//       /* ====== DI SINI KAMU BISA PAKAI GAMBAR DESAIN ======
//          Misal: background-image: url("https://.../template.png");
//       */
//       background-size: cover;
//       background-position: center;
//       border: 4px solid #e5e7eb;
//     }
//     .logo {
//       position: absolute;
//       top: 40px;
//       left: 60px;
//       font-weight: 700;
//       font-size: 20px;
//       display: flex;
//       align-items: center;
//       gap: 10px;
//     }
//     .logo img {
//       height: 40px;
//     }
//     .title {
//       margin-top: 80px;
//       text-align: center;
//       font-size: 26px;
//       font-weight: 700;
//       letter-spacing: 3px;
//       text-transform: uppercase;
//       color: #4b5563;
//     }
//     .subtitle {
//       margin-top: 10px;
//       text-align: center;
//       font-size: 14px;
//       color: #6b7280;
//     }
//     .name-label {
//       margin-top: 70px;
//       text-align: center;
//       font-size: 14px;
//       color: #9ca3af;
//       letter-spacing: 2px;
//       text-transform: uppercase;
//     }
//     .name {
//       margin-top: 12px;
//       text-align: center;
//       font-size: 36px;
//       font-weight: 700;
//       color: #111827;
//     }
//     .course {
//       margin-top: 24px;
//       text-align: center;
//       font-size: 16px;
//       color: #4b5563;
//     }
//     .course span {
//       font-weight: 600;
//       color: #111827;
//     }
//     .footer {
//       position: absolute;
//       left: 80px;
//       right: 80px;
//       bottom: 80px;
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       font-size: 12px;
//       color: #6b7280;
//     }
//     .sign-block {
//       text-align: center;
//     }
//     .sign-image {
//       height: 60px;
//       margin-bottom: 2px;
//     }
//     .sign-name {
//       font-weight: 600;
//       color: #111827;
//     }
//     .sign-role {
//       font-size: 11px;
//       color: #6b7280;
//     }
//     .code {
//       font-family: "SF Mono", ui-monospace, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
//       font-size: 11px;
//       padding: 4px 8px;
//       border-radius: 999px;
//       background: #f3f4f6;
//       border: 1px solid #e5e7eb;
//     }
//   </style>
// </head>
// <body>
//   <div class="page">
//     <!-- LOGO / BRAND -->
//     <div class="logo">
//       <!-- Kalau kamu punya logo PNG di URL publik, taruh di <img src="..."> -->
//       <!-- <img src="https://.../logo.png" /> -->
//       <span>SkillUpID</span>
//     </div>

//     <!-- JUDUL -->
//     <div class="title">Sertifikat Penyelesaian</div>
//     <div class="subtitle">
//       Sertifikat ini diberikan kepada peserta berikut atas keberhasilan menyelesaikan pelatihan.
//     </div>

//     <!-- NAMA PESERTA -->
//     <div class="name-label">Diberikan kepada</div>
//     <div class="name">${userName}</div>

//     <!-- NAMA COURSE -->
//     <div class="course">
//       Telah menyelesaikan kelas <span>${courseTitle}</span><br/>
//       Pada tanggal ${issuedAt}
//     </div>

//     <!-- FOOTER: TANGGAL, SIGN, KODE -->
//     <div class="footer">
//       <div>
//         <div>Tanggal Terbit</div>
//         <div><strong>${issuedAt}</strong></div>
//       </div>

//       <div class="sign-block">
//         <!-- Kalau punya gambar tanda tangan, pasang di src -->
//         <!-- <img class="sign-image" src="https://.../signature.png" /> -->
//         <div class="sign-name">Wahyu Saputra</div>
//         <div class="sign-role">Founder & Instructor, SkillUpID</div>
//       </div>

//       <div>
//         <div>Kode Sertifikat</div>
//         <div class="code">${code}</div>
//       </div>
//     </div>
//   </div>
// </body>
// </html>
// `;
// }

// export async function generateCertificatePDF({ userName, courseTitle, code }) {
//   const bucket = process.env.SUPABASE_CERT_BUCKET || "certificates";
//   const admin = supabaseAdmin();

//   // 1. Render HTML -> PDF dengan Puppeteer
//   const browser = await puppeteer.launch({
//     headless: "new",
//     args: ["--no-sandbox", "--disable-setuid-sandbox"],
//   });

//   try {
//     const page = await browser.newPage();
//     const html = buildCertificateHTML({ userName, courseTitle, code });

//     await page.setContent(html, { waitUntil: "networkidle0" });

//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       landscape: true,
//       printBackground: true,
//       margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
//     });

//     // 2. Upload ke Supabase Storage
//     const path = `${code}.pdf`;

//     const { error } = await admin.storage
//       .from(bucket)
//       .upload(path, pdfBuffer, {
//         upsert: true,
//         contentType: "application/pdf",
//       });

//     if (error) {
//       throw error;
//     }

//     const { data } = admin.storage.from(bucket).getPublicUrl(path);
//     return data.publicUrl;
//   } finally {
//     await browser.close();
//   }
// }

// lib/certificates.js
import dayjs from "dayjs";
import { supabaseAdmin } from "./supabase-server";
import puppeteer from "puppeteer";

const CERT_BG_URL = process.env.CERT_BG_URL; // dari .env

function buildCertificateHTML({ userName, courseTitle, code }) {
  const issuedAt = dayjs().format("YYYY-MM-DDTHH:mm:ss[Z]"); // sama format seperti contohmu

  // fallback nama kalau kosong
  const safeName = userName || "Student";
  const safeCourse = courseTitle || "Course";

  return /* html */ `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Certificate</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <!-- font script untuk nama -->
  <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      margin: 0;
      padding: 0;
      background: #000;
      font-family: "Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .page {
      position: relative;
      width: 1920px;
      height: 1080px;
      background-image: url("${CERT_BG_URL || ""}");
      background-size: cover;
      background-position: center;
      color: #e5e7eb;
      overflow: hidden;
    }

    /* "Presented to" */
    .presented {
      position: absolute;
      top: 38%;
      left: 50%;
      transform: translateX(-50%);
      font-size: 26px;
      font-weight: 400;
      letter-spacing: 2px;
      color: #e5e7eb;
    }

    /* Nama besar */
    .name {
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translateX(-50%);
      font-family: "Great Vibes", cursive;
      font-size: 80px;
      font-weight: 400;
      color: #58f6e0; /* warna turquoise mirip di desain */
      white-space: nowrap;
    }

    /* Judul course */
    .course {
      position: absolute;
      top: 58%;
      left: 50%;
      transform: translateX(-50%);
      font-size: 34px;
      font-weight: 700;
      color: #1dd6c3;
      white-space: nowrap;
    }

    /* Bagian bawah: code & issued */
    .bottom {
      position: absolute;
      bottom: 9%;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      padding: 0 180px;
      font-size: 18px;
      color: #e5e7eb;
    }

    .bottom-label {
      font-weight: 400;
      margin-bottom: 8px;
      opacity: 0.9;
    }

    .bottom-value {
      font-family: "Poppins", monospace;
      font-size: 18px;
      letter-spacing: 1px;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="presented">Presented to</div>
    <div class="name">${safeName}</div>
    <div class="course">${safeCourse}</div>

    <div class="bottom">
      <div>
        <div class="bottom-label">Code</div>
        <div class="bottom-value">${code}</div>
      </div>
      <div style="text-align:right">
        <div class="bottom-label">Issued</div>
        <div class="bottom-value">${issuedAt}</div>
      </div>
    </div>
  </div>
</body>
</html>
`;
}

export async function generateCertificatePDF({ userName, courseTitle, code }) {
  const bucket = process.env.SUPABASE_CERT_BUCKET || "certificates";
  const admin = supabaseAdmin();

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    const html = buildCertificateHTML({ userName, courseTitle, code });

    await page.setViewport({ width: 1920, height: 1080 });
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      width: "1920px",
      height: "1080px",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    const path = `${code}.pdf`;

    const { error } = await admin.storage
      .from(bucket)
      .upload(path, pdfBuffer, {
        upsert: true,
        contentType: "application/pdf",
      });

    if (error) throw error;

    const { data } = admin.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  } finally {
    await browser.close();
  }
}

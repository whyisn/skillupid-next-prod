// lib/certificates.js
import dayjs from "dayjs";
import { supabaseAdmin } from "./supabase-server";
import puppeteer from "puppeteer";

const CERT_BG_URL = process.env.CERT_BG_URL; // dari .env

function buildCertificateHTML({ userName, courseTitle, code }) {
  const issuedAt = dayjs().format("YYYY-MM-DDTHH:mm:ss[Z]");
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
  <link href="https://fonts.googleapis.com/css2?family=Charm:wght@400;700&family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      margin: 0;
      padding: 0;
      background: #000;
      font-family: "Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #e5e7eb;
    }

    .page {
      position: relative;
      width: 1920px;
      height: 1080px;
      background-image: url("${CERT_BG_URL || ""}");
      background-size: cover;
      background-position: center;
      overflow: hidden;
    }

    /* NAMA BESAR (Charm Font & Large Size) */
    .name {
      position: absolute;
      top: 35.5%; 
      left: 50%;
      transform: translateX(-50%);
      font-family: "Charm", cursive; 
      font-size: 150px; 
      font-weight: 700;
      color: #58f6e0; 
      white-space: nowrap;
      text-align: center;
      z-index: 10; 
    }

    /* JUDUL COURSE */
    .course {
      position: absolute;
      top: 63.5%; 
      left: 50%;
      transform: translateX(-50%);
      font-size: 40px;
      font-weight: 700;
      color: #1dd6c3;
      white-space: nowrap;
      text-align: center;
      z-index: 10;
    }

    /* KODE SERTIFIKAT (Dynamic Value) */
    .code-value {
      position: absolute;
      bottom: 5.5%; 
      left: 28%; 
      font-family: "Poppins", monospace;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 1px;
      color: #e5e7eb;
      white-space: nowrap;
      z-index: 10;
    }

    /* TANGGAL TERBIT (Dynamic Value) */
    .issued-value {
      position: absolute;
      bottom: 5.5%; 
      right: 26.8%; 
      font-family: "Poppins", monospace;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 1px;
      color: #e5e7eb;
      white-space: nowrap;
      z-index: 10;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="name">${safeName}</div>
    <div class="course">${safeCourse}</div>

    <div class="code-value">${code}</div>
    <div class="issued-value">${issuedAt}</div>
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
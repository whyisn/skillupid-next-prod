'use client';
import { useEffect, useState } from 'react';
import { Badge, Card } from '../components/ui';
import coursesMock from '../data/courses.json';

function Hero(){
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"/>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Naikkan skill digitalmu dengan <span className="underline decoration-black decoration-4 underline-offset-4">microlearning</span>.
            </h1>
            <p className="text-gray-600 mt-4 max-w-xl">
              Belajar desain, pemasaran digital, coding dasar, AI tools, dan soft skill kerja. Video 5–15 menit, kuis interaktif, sertifikat digital.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a href="/dashboard" className="rounded-2xl px-5 py-3 bg-black text-white">Mulai Gratis</a>
              <a href="#catalog" className="rounded-2xl px-5 py-3 border border-gray-300">Lihat Katalog</a>
            </div>
            <div className="mt-6 flex items-center gap-4 text-sm text-gray-600">
              <span>⭐ 4.8/5 oleh 3.200+ pelajar</span>
              <Badge>Sertifikat Digital</Badge>
              <Badge>Gratis & Premium</Badge>
            </div>
          </div>
          <Card className="p-6">
            <div className="text-sm text-gray-500 mb-2">Preview Kelas</div>
            <div className="aspect-video w-full bg-gray-100 rounded-xl grid place-items-center">Video Player</div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              {['Desain Canva','IG Marketing','Excel Dasar'].map((t)=> (
                <div key={t} className="rounded-xl border border-gray-200 p-2 text-center">{t}</div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Catalog(){
  const [courses, setCourses] = useState(coursesMock);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');

  const filtered = courses.filter(c => {
    const okQ = q ? c.title.toLowerCase().includes(q.toLowerCase()) : true;
    const okCat = cat === 'All' ? true : c.category === cat;
    return okQ && okCat;
  });

  return (
    <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Katalog Kursus</h2>
          <p className="text-gray-600">Pilih topik untuk mahasiswa, fresh graduate, dan pekerja.</p>
        </div>
        <div className="flex items-center gap-2">
          <input value={q} onChange={e=>setQ(e.target.value)} className="rounded-xl border border-gray-300 p-2 w-64" placeholder="Cari kursus, mis. Canva"/>
          <select value={cat} onChange={e=>setCat(e.target.value)} className="rounded-xl border border-gray-300 p-2">
            <option>All</option>
            <option>Desain</option>
            <option>Marketing</option>
            <option>Produktivitas</option>
            <option>Coding</option>
            <option>AI Tools</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {filtered.map(c => (
          <Card key={c.id} className="p-4 flex flex-col">
            <div className="aspect-video w-full rounded-xl bg-gray-100 mb-3"/>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{c.category} • {c.level}</span>
                <span className="inline-flex items-center gap-1 text-xs text-gray-700">⭐ {c.rating}</span>
              </div>
              <h3 className="font-semibold mt-1">{c.title}</h3>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-semibold">{c.price ? `Rp${(c.price/1000).toFixed(0)}k` : 'Gratis'}</span>
              <a href="/dashboard" className="rounded-xl px-3 py-2 bg-black text-white text-sm">Lihat Detail</a>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Pricing(){
  return (
    <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Harga sederhana, belajar fleksibel</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {[{t:'Basic',p:'Gratis',pts:['Kelas dasar','Kuis','Komunitas']},{t:'Premium',p:'Rp30.000/bln',pts:['Semua kelas','Sertifikat','Proyek akhir']},{t:'Pro Team',p:'Hubungi kami',pts:['Lisensi tim','Dashboard HR','Integrasi SSO']}].map((x,i)=> (
          <Card key={x.t} className={`p-6 ${i===1?'ring-2 ring-black':''}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{x.t}</h3>
              {i===1 && <Badge>Terpopuler</Badge>}
            </div>
            <div className="text-3xl font-bold mt-2">{x.p}</div>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              {x.pts.map(p=> <li key={p}>• {p}</li>)}
            </ul>
            <a href="/dashboard" className="mt-6 w-full inline-flex justify-center rounded-2xl px-4 py-2 bg-black text-white">Pilih Paket</a>
          </Card>
        ))}
      </div>
    </section>
  );
}

function FAQ(){
  return (
    <section id="faq" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Pertanyaan Umum</h2>
      <div className="space-y-4">
        {[
          {q:'Apakah ada kelas gratis?',a:'Ada. Kamu bisa mulai dengan kelas dasar tanpa biaya.'},
          {q:'Apakah dapat sertifikat?',a:'Ya, untuk kelas premium tersedia sertifikat digital.'},
          {q:'Metode pembayaran?',a:'Dukungan e-wallet & transfer bank melalui payment gateway.'},
        ].map(item=> (
          <Card key={item.q} className="p-4">
            <div className="font-semibold">{item.q}</div>
            <p className="text-gray-600 text-sm mt-1">{item.a}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default function HomePage(){
  return (
    <main>
      <Hero />
      <Catalog />
      <Pricing />
      <FAQ />
    </main>
  );
}

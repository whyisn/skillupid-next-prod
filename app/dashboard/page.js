'use client';
import { useEffect, useState } from 'react';
import { Card } from '../../components/ui';

export default function Dashboard(){
  const [progress, setProgress] = useState([
    { id:'c3', title: 'Excel Dasar', percent: 60 },
    { id:'c2', title: 'IG Marketing', percent: 20 },
    { id:'c6', title: 'AI Tools untuk Riset', percent: 0 },
  ]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="flex items-center gap-2">
          <select className="rounded-xl border border-gray-300 p-2 text-sm">
            <option>Semua</option>
            <option>Berjalan</option>
            <option>Selesai</option>
          </select>
          <button className="rounded-2xl px-4 py-2 border border-gray-300">Unduh Sertifikat</button>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {progress.map(c => (
          <Card key={c.id} className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{c.title}</h3>
              <span className="text-sm text-gray-600">{c.percent}%</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
              <div className="h-2 bg-black rounded-full" style={{ width: `${c.percent}%` }} />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button className="rounded-xl px-3 py-2 bg-black text-white text-sm">Lanjutkan</button>
              <button className="rounded-xl px-3 py-2 border border-gray-300 text-sm">Detail</button>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}

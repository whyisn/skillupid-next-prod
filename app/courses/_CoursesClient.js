'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import coursesMock from '../../data/courses.json';
import { Card } from '../../components/ui';

export default function CoursesClient() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('id'); // ambil id dari URL ?id=c1
  const [course, setCourse] = useState(null);

  const videos = [
    { id: 1, title: 'Pengenalan Keamanan Siber', duration: '10:20' },
    { id: 2, title: 'Jenis Ancaman Dunia Maya', duration: '8:45' },
    { id: 3, title: 'Tips Melindungi Data Pribadi', duration: '12:15' },
    { id: 4, title: 'Etika dan Hukum dalam Dunia Siber', duration: '9:50' },
  ];

  useEffect(() => {
    const found = coursesMock.find((c) => c.id === courseId);
    setCourse(found || null);
  }, [courseId]);

  if (!course) return <div className="p-6 text-center">Memuat data kursus...</div>;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <p className="text-gray-600 mb-6">
        Kursus kategori <strong>{course.category}</strong> • Level {course.level} • ⭐ {course.rating}
      </p>

      <Card className="p-6 mb-8">
        <div className="aspect-video w-full bg-gray-200 rounded-xl grid place-items-center text-gray-500">
          Video Player (integrasi Mux/Vimeo)
        </div>
      </Card>

      <h2 className="text-2xl font-semibold mb-3">Daftar Materi</h2>
      <div className="space-y-3">
        {videos.map((v) => (
          <div
            key={v.id}
            className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 flex justify-between items-center"
          >
            <span>{v.title}</span>
            <span className="text-gray-500 text-sm">{v.duration}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
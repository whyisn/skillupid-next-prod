'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import coursesMock from '../../data/courses.json';
import { Card } from '../../components/ui';

export default function CourseDetailPage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('id'); 
  const [course, setCourse] = useState(null);

  const videos = [
    { id: 1, title: 'Pengenalan Keamanan Siber', duration: '10:20' },
    { id: 2, title: 'Jenis Ancaman Dunia Maya', duration: '8:45' },
    { id: 3, title: 'Tips Melindungi Data Pribadi', duration: '12:15' },
    { id: 4, title: 'Etika dan Hukum dalam Dunia Siber', duration: '9:50' },
  ];

  useEffect(() => {
    const found = coursesMock.find((c) => c.id === courseId);
    setCourse(found);
  }, [courseId]);

  if (!course) return <div className="p-6 text-center text-gray-500">Memuat data kursus...</div>;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-primary mb-2">{course.title}</h1>
        <p className="text-gray-600">
          Kategori <strong>{course.category}</strong> • Level {course.level} • ⭐ {course.rating}
        </p>
      </div>

      <Card className="p-6 mb-10 bg-white shadow-md rounded-2xl">
        <div className="aspect-video w-full bg-gray-100 rounded-xl grid place-items-center text-gray-500 border border-borderLight">
          🎥 <span className="ml-2">Video Player (akan diintegrasikan)</span>
        </div>
      </Card>

      <h2 className="text-2xl font-semibold text-textMain mb-4">📚 Daftar Materi</h2>
      <div className="space-y-3">
        {videos.map((v) => (
          <div
            key={v.id}
            className="p-4 bg-white border border-borderLight rounded-xl flex justify-between items-center hover:bg-gray-50 hover:shadow-sm transition"
          >
            <span className="font-medium">{v.title}</span>
            <span className="text-gray-500 text-sm">{v.duration}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

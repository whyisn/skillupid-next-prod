// app/courses/[id]/page.js
import { createClient } from "@/lib/supabase/server";
import EnrollActions from "./EnrollActions";

export default async function CourseDetail({ params }) {
  const supabase = createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("id,title,description,category,level,price,premium,rating,thumbnail_url")
    .eq("id", params.id)
    .maybeSingle();

  if (!course) {
    return <div className="max-w-5xl mx-auto p-6">Kursus tidak ditemukan.</div>;
  }

  const { data: modules } = await supabase
    .from("modules")
    .select("id,title,order_no,duration_seconds")
    .eq("course_id", course.id)
    .order("order_no");

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="aspect-video rounded-2xl bg-gray-100 overflow-hidden">
            {course.thumbnail_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center text-gray-500">Preview</div>
            )}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500">{course.category} · {course.level}</div>
          <h1 className="text-3xl font-extrabold mt-1">{course.title}</h1>
          <div className="text-sm text-gray-600 mt-2">⭐ {course.rating || 4.8}</div>

          <p className="mt-4 text-gray-700 whitespace-pre-line">{course.description || "Deskripsi belum tersedia."}</p>

          <div className="mt-6">
            <EnrollActions course={course} />
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-3">Daftar Modul</h2>
        {(!modules || modules.length === 0) ? (
          <div className="p-6 border rounded-xl text-gray-600">Belum ada modul.</div>
        ) : (
          <ol className="space-y-2">
            {modules.map((m) => (
              <li key={m.id} className="p-4 border rounded-xl flex items-center justify-between">
                <div className="font-medium">{m.order_no}. {m.title}</div>
                <div className="text-sm text-gray-500">{Math.round((m.duration_seconds || 0) / 60)} menit</div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}

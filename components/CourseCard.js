// components/CourseCard.js
export default function CourseCard({ course }) {
  const priceLabel = course?.premium ? `Rp ${Intl.NumberFormat('id-ID').format(course.price || 0)}` : "Gratis";
  return (
    <a href={`/courses/${course.id}`} className="block border rounded-2xl overflow-hidden hover:shadow-sm transition">
      <div className="aspect-video bg-gray-100 grid place-items-center text-gray-500">
        {course?.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <span>Thumbnail</span>
        )}
      </div>
      <div className="p-4">
        <div className="text-xs text-gray-500">{course.category} · {course.level}</div>
        <h3 className="mt-1 font-semibold">{course.title}</h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-gray-600">⭐ {course.rating || 4.8}</span>
          <span className={`text-sm ${course.premium ? "text-black" : "text-green-600"}`}>{priceLabel}</span>
        </div>
      </div>
    </a>
  );
}

export default function CourseCard({ course }) {
  const priceLabel = course?.premium
    ? `Rp ${Intl.NumberFormat("id-ID").format(course.price || 0)}`
    : "Gratis";

  return (
    <a
      href={`/courses/${course.id}`}
      className="block rounded-2xl overflow-hidden bg-white border border-borderLight hover:shadow-md hover:-translate-y-1 transition"
    >
      <div className="aspect-video bg-gray-100 grid place-items-center text-gray-500">
        {course?.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>Thumbnail</span>
        )}
      </div>

      <div className="p-5">
        <div className="text-xs text-gray-500 uppercase tracking-wide">
          {course.category} · {course.level}
        </div>
        <h3 className="mt-2 font-semibold text-textMain line-clamp-2">
          {course.title}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-gray-600">⭐ {course.rating || 4.8}</span>
          <span
            className={`text-sm font-medium ${
              course.premium ? "text-primary" : "text-green-600"
            }`}
          >
            {priceLabel}
          </span>
        </div>
      </div>
    </a>
  );
}

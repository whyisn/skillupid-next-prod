// app/dashboard/page.js
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = createClient();
  
  // 1. Ambil data user (Tetap sama)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/sign-in");
  }

  // 2. Ambil data profil (Tetap sama)
  let profile = null;
  const { data: profA } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();
  if (profA) profile = profA;
  if (!profile) {
    const { data: profB } = await supabase
      .from("users") 
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();
    if (profB) profile = profB;
  }
  const displayName = profile?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User";

  // --- [PERUBAHAN LOGIKA FETCHING DATA] ---

  // 3. Ambil HANYA course_id dari tabel enrollments
  const { data: enrollmentData, error: enrollError } = await supabase
    .from("enrollments")
    .select("course_id") 
    .eq("user_id", user.id);

  if (enrollError) {
    console.error("Error fetching enrollments:", enrollError.message);
    return <DashboardClient userDisplayName={displayName} initialCourses={[]} />;
  }

  // 4. Buat array berisi ID course saja
  const courseIds = enrollmentData.map(e => e.course_id);

  let enrolledCourses = [];
  let durationMap = {}; // Object untuk menyimpan total durasi per course_id

  // 5. Jika user punya course_id, baru kita fetch data lengkap
  if (courseIds.length > 0) {
    // 5a. Ambil data lengkap untuk courses
    const { data: coursesData, error: coursesError } = await supabase
      .from("courses")
      // [PERUBAHAN] Ambil 'level', 'rating', 'premium', dan 'price'
      .select("id, title, thumbnail_url, category, level, rating, premium, price") 
      .in("id", courseIds); 

    if (coursesError) {
      console.error("Error fetching courses:", coursesError?.message);
    }

    // 5b. Ambil data durasi dari SEMUA modul yang relevan
    const { data: modulesData, error: modulesError } = await supabase
      .from("modules")
      .select("course_id, duration_seconds")
      .in("course_id", courseIds);

    if (modulesError) {
      console.error("Error fetching modules duration:", modulesError?.message);
    }

    // 5c. Hitung total durasi untuk setiap course
    if (modulesData) {
      modulesData.forEach(mod => {
        const currentDuration = durationMap[mod.course_id] || 0;
        durationMap[mod.course_id] = currentDuration + (mod.duration_seconds || 0);
      });
    }
    
    // 5d. Gabungkan data course dengan total durasinya
    if (coursesData) {
      enrolledCourses = coursesData.map(course => ({
        ...course,
        total_duration_seconds: durationMap[course.id] || 0, // Tambahkan total durasi
      }));
    }
  }

  // 6. Kirim data courses yang sudah lengkap ke Client
  return (
    <DashboardClient 
      userDisplayName={displayName} 
      initialCourses={enrolledCourses} 
    />
  );
}
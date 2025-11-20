// app/dashboard/page.js
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
    const supabase = createClient();
    
    // 1. Ambil data user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/auth/sign-in");
    }

    // 2. Ambil data profil
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

    // --- LOGIKA PERHITUNGAN PROGRESS BAR DASHBOARD ---

    // 3. Ambil enrollment data untuk mendapatkan course IDs dan enrollment IDs
    const { data: enrollmentData, error: enrollError } = await supabase
        .from("enrollments")
        .select("id, course_id") 
        .eq("user_id", user.id);

    if (enrollError) {
        console.error("Error fetching enrollments:", enrollError.message);
        return <DashboardClient userDisplayName={displayName} initialCourses={[]} />;
    }

    // 4. Buat map Course ID -> Enrollment ID dan daftar ID
    const enrollmentMap = enrollmentData.reduce((acc, e) => {
        acc[e.course_id] = e.id;
        return acc;
    }, {});
    const courseIds = Object.keys(enrollmentMap);
    const enrollmentIds = Object.values(enrollmentMap);

    let enrolledCourses = [];
    let durationMap = {};

    if (courseIds.length > 0) {
        // 5a. Ambil data lengkap untuk courses
        const { data: coursesData, error: coursesError } = await supabase
            .from("courses")
            .select("id, title, thumbnail_url, category, level, premium, price") 
            .in("id", courseIds); 

        // 5b. Ambil data modul (untuk total durasi dan count modul)
        const { data: allModules } = await supabase
            .from("modules")
            .select("id, course_id, duration_seconds")
            .in("course_id", courseIds);

        // 5c. Hitung total durasi
        allModules.forEach(mod => {
            durationMap[mod.course_id] = (durationMap[mod.course_id] || 0) + (mod.duration_seconds || 0);
        });

        // 5d. Total Modules Count
        const moduleCountMap = allModules.reduce((acc, mod) => {
            acc[mod.course_id] = (acc[mod.course_id] || 0) + 1;
            return acc;
        }, {});

        
        // --- PROGRES COUNTING ---

        // 6. Videos Completed Count (Progress >= 80)
        const { data: videoProgress } = await supabase
            .from("progress")
            .select("module_id, enrollment_id")
            .in("enrollment_id", enrollmentIds)
            .gte("percent", 80); // Syarat Lulus Video: >= 80%

        const videoCompletedMap = videoProgress.reduce((acc, p) => {
            const courseId = Object.keys(enrollmentMap).find(key => enrollmentMap[key] === p.enrollment_id);
            if (courseId) {
                acc[courseId] = (acc[courseId] || 0) + 1;
            }
            return acc;
        }, {});

        // 7. Quizzes Passed Count (Score >= 4)
        const { data: quizSubmissions } = await supabase
            .from("submissions")
            .select("quiz_id, score")
            .eq("user_id", user.id)
            .gte("score", 4); // Syarat Lulus Quiz: >= 4 benar

        // Map module ID to course ID (agar submissions bisa dikelompokkan per course)
        const moduleIdToCourseId = allModules.reduce((acc, mod) => {
            acc[mod.id] = mod.course_id;
            return acc;
        }, {});

        // Hitung jumlah distinct quiz_id yang lulus per course
        const quizPassedSetMap = quizSubmissions.reduce((acc, sub) => {
            const courseId = moduleIdToCourseId[sub.quiz_id];
            if (courseId) {
                acc[courseId] = new Set([...(acc[courseId] || []), sub.quiz_id]);
            }
            return acc;
        }, {});

        const quizCompletedCountMap = {};
        Object.keys(quizPassedSetMap).forEach(cId => {
            quizCompletedCountMap[cId] = quizPassedSetMap[cId].size;
        });


        // 8. Certificates Issued Count (0 atau 1)
        const { data: certificates } = await supabase
            .from("certificates")
            .select("course_id")
            .eq("user_id", user.id)
            .in("course_id", courseIds);

        const certificateIssuedMap = certificates.reduce((acc, cert) => {
            acc[cert.course_id] = 1; // Mark as 1 if issued
            return acc;
        }, {});


        // --- Final Calculation & Integration ---
        if (coursesData) {
            enrolledCourses = coursesData.map(course => {
                const courseId = course.id;
                const numModules = moduleCountMap[courseId] || 0;
                
                // Jika tidak ada modul, total item = 1 (sertif)
                const totalItems = (numModules * 2) + (numModules > 0 ? 1 : 0); 
                
                const completedVideos = videoCompletedMap[courseId] || 0;
                const completedQuizzes = quizCompletedCountMap[courseId] || 0;
                const certificateIssued = certificateIssuedMap[courseId] || 0;

                const completedItems = completedVideos + completedQuizzes + certificateIssued;

                const finalCompletedItems = Math.min(completedItems, totalItems);
                
                let progressPercent = 0;
                if (totalItems > 0) {
                    progressPercent = Math.round((finalCompletedItems / totalItems) * 100);
                }

                return { 
                    ...course, 
                    total_duration_seconds: durationMap[course.id] || 0,
                    progress_percent: progressPercent,
                    progress_summary: `${finalCompletedItems}/${totalItems}`
                };
            });
        }
    }

    // 9. Kirim data courses yang sudah lengkap ke Client
    return (
        <DashboardClient 
            userDisplayName={displayName} 
            initialCourses={enrolledCourses} 
        />
    );
}
import { createClient } from "@/lib/supabase/server";
import CatalogClient from './CatalogClient';

export default async function CatalogPage({ searchParams }) {
  const supabase = createClient();

  // Ambil filter dari URL, default-nya 'semua'
  const activeFilter = searchParams.filter || 'semua';
  
  // 1. Buat query dasar
  let query = supabase
    .from("courses")
    .select("id,title,category,level,price,premium,rating,thumbnail_url");

  // 2. Terapkan filter berdasarkan URL
  if (activeFilter === 'gratis') {
    query = query.eq('premium', false);
  } else if (activeFilter === 'premium') {
    query = query.eq('premium', true);
  }
  // Jika 'semua', tidak perlu filter tambahan
  
  // 3. Eksekusi query dengan pengurutan (tanpa limit)
  const { data: courses } = await query.order("title", { ascending: true });

  // 4. Kirim data yang sudah difilter ke Client Component
  return (
    <CatalogClient 
      courses={courses || []} // Kirim array kosong jika data null
      activeFilter={activeFilter} 
    />
  );
}
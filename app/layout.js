import './globals.css'
//Import image
import Image from 'next/image'; 
import LogoImage from '../assets/logo.png'; 

// Tambahan: tombol Auth (client component)
import AuthButtons from "@/components/AuthButtons";

export const metadata = {
  title: 'SkillUpID',
  description: 'Belajar skill digital untuk mahasiswa, fresh graduate, dan pekerja.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="text-gray-900">
        {/* === Header (Sticky Nav) === */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            
            {/* Logo SkillUpID */}
            <div className="flex items-center gap-2">
              <Image
                  src={LogoImage}
                  alt="SkillUpID Logo"
                  width={30} 
                  height={30} 
                  className="object-contain"
              />
              <span className="font-bold">
                <span className="text-gray-900 text-xl">SkillUp</span>
                <span className="text-[#1ABC9C] text-xl">ID</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <nav className="flex items-center gap-6 text-sm text-gray-700">
                <a href="#catalog" className="hover:text-black">Katalog</a>
                <a href="#pricing" className="hover:text-black">Harga</a>
                <a href="#faq" className="hover:text-black">FAQ</a>
                <a href="/dashboard" className="hover:text-black">Dashboard</a>
              </nav>
              <AuthButtons />
            </div>
          </div>
        </div>
        
        {children}
        
        {/* === Footer === */}
        <footer className="border-t border-gray-200 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-sm text-gray-600 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {/* Mengganti logo "S" di Footer dengan logo panah juga (Opsional, tapi konsisten) */}
              <Image
                  src={LogoImage}
                  alt="SkillUpID Logo Footer"
                  width={24} // Ukuran lebih kecil untuk footer (w-6 h-6)
                  height={24}
                  className="object-contain"
              />
              <span className="font-bold">
                {/* Pewarnaan SkillUpID di Footer */}
                <span className="text-gray-900">SkillUp</span>
                <span className="text-[#1ABC9C]">ID</span>
              </span>
              <span className="text-gray-600 font-normal">
                 © {new Date().getFullYear()}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-black">Privasi</a>
              <a href="#" className="hover:text-black">Ketentuan</a>
              <a href="#" className="hover:text-black">Kontak</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
import './globals.css'
import { AuthButtons } from '@/components/AuthButtons'

export const metadata = {
  title: 'SkillUpID',
  description: 'Belajar skill digital untuk mahasiswa, fresh graduate, dan pekerja.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="text-textMain bg-base">
        {/* Navbar */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-borderLight shadow-sm transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary text-white grid place-items-center font-bold">S</div>
              <span className="font-semibold text-lg">SkillUpID</span>
            </div>

            <div className="hidden md:flex items-center gap-6 text-sm text-gray-700">
              <a href="#catalog" className="hover:text-primary transition-colors">Katalog</a>
              <a href="#pricing" className="hover:text-primary transition-colors">Harga</a>
              <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
              <a href="/dashboard" className="hover:text-primary transition-colors">Dashboard</a>
              <AuthButtons />
            </div>
          </div>
        </header>

        {/* Konten utama */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="border-t border-borderLight mt-12 bg-white/70 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-sm text-gray-600 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-primary text-white grid place-items-center font-bold">S</div>
              SkillUpID © {new Date().getFullYear()}
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-primary transition-colors">Privasi</a>
              <a href="#" className="hover:text-primary transition-colors">Ketentuan</a>
              <a href="#" className="hover:text-primary transition-colors">Kontak</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}

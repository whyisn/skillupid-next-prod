import './globals.css'

export const metadata = {
  title: 'SkillUpID',
  description: 'Belajar skill digital untuk mahasiswa, fresh graduate, dan pekerja.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="text-gray-900">
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-black text-white grid place-items-center font-bold">S</div>
              <span className="font-bold">SkillUpID</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
              <a href="#catalog" className="hover:text-black">Katalog</a>
              <a href="#pricing" className="hover:text-black">Harga</a>
              <a href="#faq" className="hover:text-black">FAQ</a>
              <a href="/dashboard" className="hover:text-black">Dashboard</a>
            </nav>
          </div>
        </div>
        {children}
        <footer className="border-t border-gray-200 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-sm text-gray-600 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-black text-white grid place-items-center font-bold">S</div> SkillUpID © {new Date().getFullYear()}
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

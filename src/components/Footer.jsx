import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-[#2d2d44] mt-20">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-white font-bold text-lg">Altair</p>
          <p className="text-[#94a3b8] text-sm mt-1">Каталог AI-инструментов и библиотека промптов</p>
        </div>

        <nav className="flex gap-6">
          <Link to="/catalog" className="text-[#94a3b8] text-sm hover:text-white transition-colors">Каталог</Link>
          <Link to="/prompts" className="text-[#94a3b8] text-sm hover:text-white transition-colors">Промпты</Link>
          <Link to="/about"   className="text-[#94a3b8] text-sm hover:text-white transition-colors">О проекте</Link>
        </nav>

        <p className="text-[#94a3b8] text-sm">© 2026 Altair</p>
      </div>
    </footer>
  )
}

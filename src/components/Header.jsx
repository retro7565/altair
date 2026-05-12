import { Link, NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f1a]/90 backdrop-blur border-b border-[#2d2d44]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-white tracking-tight">
          Altair
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'text-[#6366f1] text-sm font-medium' : 'text-[#94a3b8] text-sm hover:text-white transition-colors'
            }
          >
            Главная
          </NavLink>
          <NavLink
            to="/catalog"
            className={({ isActive }) =>
              isActive ? 'text-[#6366f1] text-sm font-medium' : 'text-[#94a3b8] text-sm hover:text-white transition-colors'
            }
          >
            Каталог AI
          </NavLink>
          <NavLink
            to="/prompts"
            className={({ isActive }) =>
              isActive ? 'text-[#6366f1] text-sm font-medium' : 'text-[#94a3b8] text-sm hover:text-white transition-colors'
            }
          >
            Промпты
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? 'text-[#6366f1] text-sm font-medium' : 'text-[#94a3b8] text-sm hover:text-white transition-colors'
            }
          >
            О проекте
          </NavLink>
        </nav>

        <Link
          to="/login"
          className="bg-[#6366f1] hover:bg-[#8b5cf6] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Войти
        </Link>
      </div>
    </header>
  )
}

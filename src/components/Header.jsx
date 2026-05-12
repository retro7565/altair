import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Header() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  const initials = profile?.username
    ? profile.username.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <header style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 50,
      backgroundColor: 'rgba(15, 15, 26, 0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #2d2d44',
    }}>
      <div style={{
        maxWidth: 1152,
        margin: '0 auto',
        padding: '0 32px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        {/* Логотип */}
        <Link to="/" style={{
          fontSize: 22,
          fontWeight: 700,
          color: '#ffffff',
          textDecoration: 'none',
          letterSpacing: '-0.5px',
          flexShrink: 0,
        }}>
          Altair
        </Link>

        {/* Навигация */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {[
            { to: '/',        label: 'Главная',   end: true },
            { to: '/catalog', label: 'Каталог AI' },
            { to: '/prompts', label: 'Промпты'    },
            { to: '/about',   label: 'О проекте'  },
          ].map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#6366f1' : '#94a3b8',
                textDecoration: 'none',
                transition: 'color 0.2s',
              })}
              onMouseEnter={e => { if (e.target.style.color !== 'rgb(99, 102, 241)') e.target.style.color = '#ffffff' }}
              onMouseLeave={e => { if (e.target.style.color !== 'rgb(99, 102, 241)') e.target.style.color = '#94a3b8' }}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Кнопки / аватар */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {user ? (
            <>
              <Link
                to="/profile"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '6px 14px 6px 6px',
                  background: '#1a1a2e', border: '1px solid #2d2d44',
                  borderRadius: 50, textDecoration: 'none', transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#2d2d44'}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
                }}>
                  {initials}
                </div>
                <span style={{ fontSize: 13, color: '#cbd5e1', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {profile?.username || user.email.split('@')[0]}
                </span>
              </Link>

              <button
                onClick={handleSignOut}
                style={{
                  padding: '9px 18px', fontSize: 14, fontWeight: 500,
                  color: '#94a3b8', background: 'transparent',
                  border: '1px solid #2d2d44', borderRadius: 8,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2d2d44'; e.currentTarget.style.color = '#94a3b8' }}
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                padding: '9px 22px', fontSize: 14, fontWeight: 500,
                color: '#94a3b8', textDecoration: 'none',
                border: '1px solid #2d2d44', borderRadius: 8,
                transition: 'all 0.2s', whiteSpace: 'nowrap',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#ffffff' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2d2d44'; e.currentTarget.style.color = '#94a3b8' }}
              >
                Войти
              </Link>

              <Link to="/register" style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                padding: '9px 22px', fontSize: 14, fontWeight: 500,
                color: '#ffffff', textDecoration: 'none',
                backgroundColor: '#6366f1', borderRadius: 8,
                border: '1px solid transparent', transition: 'background-color 0.2s',
                whiteSpace: 'nowrap',
              }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#8b5cf6' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#6366f1' }}
              >
                Регистрация
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  )
}

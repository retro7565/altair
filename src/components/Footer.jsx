import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #2d2d44', background: '#0d0d14' }}>
      <div style={{
        maxWidth: 1152, margin: '0 auto', padding: '40px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 24,
      }}>
        <div>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Altair</p>
          <p style={{ fontSize: 13, color: '#64748b' }}>Каталог AI-инструментов и библиотека промптов</p>
        </div>

        <nav style={{ display: 'flex', gap: 28 }}>
          {[
            { to: '/catalog', label: 'Каталог' },
            { to: '/prompts', label: 'Промпты' },
            { to: '/about',   label: 'О проекте' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} style={{ fontSize: 14, color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
            >
              {label}
            </Link>
          ))}
        </nav>

        <p style={{ fontSize: 13, color: '#64748b' }}>© 2026 Altair</p>
      </div>
    </footer>
  )
}

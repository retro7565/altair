import { Link } from 'react-router-dom'

const STACK = [
  { name: 'React 19',      desc: 'UI-библиотека',              color: '#61dafb' },
  { name: 'Vite',          desc: 'Сборщик проекта',            color: '#646cff' },
  { name: 'Supabase',      desc: 'База данных и авторизация',  color: '#3ecf8e' },
  { name: 'React Router',  desc: 'Маршрутизация',              color: '#f44250' },
  { name: 'Tailwind CSS',  desc: 'Стилизация',                 color: '#38bdf8' },
  { name: 'Netlify',       desc: 'Хостинг и деплой',           color: '#00c7b7' },
]

const FEATURES = [
  { icon: '🔍', title: 'Каталог AI',       desc: 'Подробные карточки популярных нейросетей с описанием, ценами и гайдом по старту' },
  { icon: '📝', title: 'Библиотека промптов', desc: 'Сообщество делится готовыми промптами — с лайками, комментариями и поиском' },
  { icon: '🔐', title: 'Авторизация',      desc: 'Регистрация и вход через email, личный профиль пользователя' },
  { icon: '⚡', title: 'Быстрый поиск',    desc: 'Фильтрация по категориям и мгновенный поиск по названию' },
]

export default function About() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: 80, paddingBottom: 80, background: '#0d0d14' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 32px' }}>

        {/* Заголовок */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h1 style={{ fontSize: 48, fontWeight: 900, color: '#fff', marginBottom: 16, letterSpacing: '-2px' }}>
            О проекте <span style={{ color: '#6366f1' }}>Altair</span>
          </h1>
          <p style={{ fontSize: 17, color: '#94a3b8', lineHeight: 1.7, maxWidth: 600, margin: '0 auto' }}>
            Учебный проект — агрегатор AI-инструментов и библиотека промптов для тех, кто хочет разобраться в мире нейросетей
          </p>
        </div>

        {/* Возможности */}
        <div style={{ marginBottom: 60 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 24 }}>Возможности</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{
                background: '#1a1a2e', border: '1px solid #2d2d44',
                borderRadius: 14, padding: 24, display: 'flex', gap: 16,
              }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>{f.icon}</span>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Стек */}
        <div style={{ marginBottom: 60 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 24 }}>Технологии</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {STACK.map(tech => (
              <div key={tech.name} style={{
                background: '#1a1a2e', border: '1px solid #2d2d44',
                borderRadius: 12, padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: tech.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{tech.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{tech.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))',
          border: '1px solid rgba(99,102,241,0.2)', borderRadius: 18,
          padding: 40, textAlign: 'center',
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
            Начни пользоваться Altair
          </h2>
          <p style={{ fontSize: 15, color: '#94a3b8', marginBottom: 28 }}>
            Изучай AI-инструменты и делись промптами с сообществом
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/catalog" style={{
              padding: '11px 28px', borderRadius: 10,
              background: '#6366f1', color: '#fff',
              fontSize: 14, fontWeight: 600, textDecoration: 'none',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#8b5cf6'}
              onMouseLeave={e => e.currentTarget.style.background = '#6366f1'}
            >
              Каталог AI
            </Link>
            <Link to="/prompts" style={{
              padding: '11px 28px', borderRadius: 10,
              border: '1px solid #2d2d44', color: '#94a3b8',
              fontSize: 14, textDecoration: 'none',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#2d2d44'; e.currentTarget.style.color = '#94a3b8' }}
            >
              Промпты
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

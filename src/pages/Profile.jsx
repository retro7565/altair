import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useEffect } from 'react'

export default function Profile() {
  const { user, profile, loading, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) navigate('/login')
  }, [user, loading])

  if (loading) return (
    <div style={{ minHeight: '100vh', paddingTop: 80, background: '#0d0d14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#94a3b8' }}>Загрузка...</p>
    </div>
  )

  if (!user) return null

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const initials = profile?.username
    ? profile.username.slice(0, 2).toUpperCase()
    : user.email.slice(0, 2).toUpperCase()

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80, paddingBottom: 80, background: '#0d0d14' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 32px' }}>

        <div style={{ background: '#1a1a2e', border: '1px solid #2d2d44', borderRadius: 18, padding: 36, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>
              {initials}
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
                {profile?.username || 'Пользователь'}
              </h1>
              <p style={{ fontSize: 14, color: '#64748b' }}>{user.email}</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #2d2d44' }}>
              <span style={{ fontSize: 14, color: '#64748b' }}>Email</span>
              <span style={{ fontSize: 14, color: '#cbd5e1' }}>{user.email}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #2d2d44' }}>
              <span style={{ fontSize: 14, color: '#64748b' }}>Имя пользователя</span>
              <span style={{ fontSize: 14, color: '#cbd5e1' }}>{profile?.username || '—'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0' }}>
              <span style={{ fontSize: 14, color: '#64748b' }}>Дата регистрации</span>
              <span style={{ fontSize: 14, color: '#cbd5e1' }}>
                {new Date(user.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          style={{
            width: '100%', padding: '12px', borderRadius: 10,
            border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)',
            color: '#ef4444', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.05)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)' }}
        >
          Выйти из аккаунта
        </button>
      </div>
    </div>
  )
}

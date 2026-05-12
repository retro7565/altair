import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { signIn } = useAuth()
  const navigate   = useNavigate()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) setError(error.message)
    else navigate('/profile')
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80, background: '#0d0d14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 420, padding: '0 24px' }}>

        <div style={{ background: '#1a1a2e', border: '1px solid #2d2d44', borderRadius: 18, padding: 40 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 8, textAlign: 'center' }}>
            Вход в Altair
          </h1>
          <p style={{ color: '#64748b', fontSize: 14, textAlign: 'center', marginBottom: 32 }}>
            Нет аккаунта?{' '}
            <Link to="/register" style={{ color: '#6366f1', textDecoration: 'none' }}>Зарегистрироваться</Link>
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{
                  width: '100%', padding: '11px 14px', background: '#0d0d14',
                  border: '1px solid #2d2d44', borderRadius: 10, color: '#fff',
                  fontSize: 14, outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#2d2d44'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>Пароль</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '11px 14px', background: '#0d0d14',
                  border: '1px solid #2d2d44', borderRadius: 10, color: '#fff',
                  fontSize: 14, outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#2d2d44'}
              />
            </div>

            {error && (
              <p style={{ fontSize: 13, color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '12px', borderRadius: 10, border: 'none',
                background: loading ? '#4b4f8f' : '#6366f1', color: '#fff',
                fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s', marginTop: 4,
              }}
              onMouseEnter={e => { if (!loading) e.target.style.background = '#8b5cf6' }}
              onMouseLeave={e => { if (!loading) e.target.style.background = '#6366f1' }}
            >
              {loading ? 'Входим...' : 'Войти'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

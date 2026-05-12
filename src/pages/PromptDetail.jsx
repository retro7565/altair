import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const CATEGORY_COLORS = {
  programming:  '#10b981',
  studying:     '#6366f1',
  writing:      '#f59e0b',
  marketing:    '#ef4444',
  design:       '#ec4899',
  productivity: '#8b5cf6',
}

export default function PromptDetail() {
  const { id } = useParams()
  const { user, profile } = useAuth()
  const navigate = useNavigate()

  const [prompt, setPrompt]       = useState(null)
  const [comments, setComments]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [liked, setLiked]         = useState(false)
  const [copied, setCopied]       = useState(false)
  const [comment, setComment]     = useState('')
  const [sending, setSending]     = useState(false)

  useEffect(() => {
    fetchPrompt()
    fetchComments()
  }, [id])

  useEffect(() => {
    if (!user) return
    supabase.from('likes').select('id').eq('user_id', user.id).eq('prompt_id', id).maybeSingle()
      .then(({ data }) => setLiked(!!data))
  }, [user, id])

  async function fetchPrompt() {
    setLoading(true)
    const { data } = await supabase
      .from('prompts')
      .select('*, categories(name, slug), profiles(username), ai_models(name, slug)')
      .eq('id', id)
      .single()
    setPrompt(data)
    setLoading(false)
  }

  async function fetchComments() {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(username)')
      .eq('prompt_id', id)
      .order('created_at', { ascending: true })
    setComments(data || [])
  }

  async function toggleLike() {
    if (!user) { navigate('/login'); return }
    if (liked) {
      await supabase.from('likes').delete().eq('user_id', user.id).eq('prompt_id', id)
      setLiked(false)
      setPrompt(p => ({ ...p, likes_count: p.likes_count - 1 }))
    } else {
      await supabase.from('likes').insert({ user_id: user.id, prompt_id: Number(id) })
      setLiked(true)
      setPrompt(p => ({ ...p, likes_count: p.likes_count + 1 }))
    }
  }

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function submitComment(e) {
    e.preventDefault()
    if (!comment.trim()) return
    setSending(true)
    await supabase.from('comments').insert({
      user_id: user.id,
      prompt_id: Number(id),
      content: comment.trim(),
    })
    setComment('')
    await fetchComments()
    setSending(false)
  }

  async function deletePrompt() {
    if (!confirm('Удалить промпт?')) return
    await supabase.from('prompts').delete().eq('id', id)
    navigate('/prompts')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', paddingTop: 80, background: '#0d0d14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#94a3b8' }}>Загрузка...</p>
    </div>
  )

  if (!prompt) return (
    <div style={{ minHeight: '100vh', paddingTop: 80, background: '#0d0d14', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <p style={{ color: '#94a3b8', fontSize: 18 }}>Промпт не найден</p>
      <Link to="/prompts" style={{ color: '#6366f1', textDecoration: 'none', fontSize: 14 }}>← Вернуться к промптам</Link>
    </div>
  )

  const cat = prompt.categories
  const color = CATEGORY_COLORS[cat?.slug] || '#6366f1'
  const isOwner = user?.id === prompt.user_id
  const canDelete = isOwner || profile?.is_admin

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80, paddingBottom: 80, background: '#0d0d14' }}>
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 32px' }}>

        <Link to="/prompts" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748b', textDecoration: 'none', fontSize: 13, marginBottom: 32 }}
          onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
          onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
        >
          ← Библиотека промптов
        </Link>

        {/* Карточка промпта */}
        <div style={{ background: '#1a1a2e', border: '1px solid #2d2d44', borderRadius: 18, padding: 36, marginBottom: 20 }}>

          {/* Категория + действия */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {cat && (
                <span style={{
                  fontSize: 11, fontWeight: 600, color,
                  background: `${color}18`, border: `1px solid ${color}40`,
                  padding: '3px 10px', borderRadius: 6,
                }}>
                  {cat.name}
                </span>
              )}
              {prompt.ai_models && (
                <span style={{
                  fontSize: 11, fontWeight: 600, color: '#94a3b8',
                  background: 'rgba(148,163,184,0.08)', border: '1px solid #2d2d44',
                  padding: '3px 10px', borderRadius: 6,
                }}>
                  {prompt.ai_models.name}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {canDelete && (
                <button onClick={deletePrompt} style={{
                  padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)',
                  background: 'transparent', color: '#ef4444', fontSize: 13, cursor: 'pointer',
                }}>
                  {profile?.is_admin && !isOwner ? '🛡 Удалить (модерация)' : 'Удалить'}
                </button>
              )}
            </div>
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 10 }}>
            {prompt.title}
          </h1>

          {prompt.description && (
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.65, marginBottom: 24 }}>
              {prompt.description}
            </p>
          )}

          {/* Текст промпта */}
          <div style={{ position: 'relative', marginBottom: 24 }}>
            <div style={{
              background: '#0d0d14', border: '1px solid #2d2d44', borderRadius: 12,
              padding: '20px 20px 48px', fontFamily: 'monospace', fontSize: 14,
              color: '#cbd5e1', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            }}>
              {prompt.content}
            </div>
            <button
              onClick={copyPrompt}
              style={{
                position: 'absolute', bottom: 12, right: 12,
                padding: '6px 14px', borderRadius: 8,
                background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.15)',
                border: `1px solid ${copied ? 'rgba(16,185,129,0.4)' : 'rgba(99,102,241,0.4)'}`,
                color: copied ? '#10b981' : '#6366f1',
                fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {copied ? '✓ Скопировано' : 'Скопировать'}
            </button>
          </div>

          {/* Футер */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, color: '#64748b' }}>
                {prompt.profiles?.username || 'Аноним'}
              </span>
              <span style={{ fontSize: 12, color: '#3d4d61' }}>
                {new Date(prompt.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <button
              onClick={toggleLike}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 8,
                border: `1px solid ${liked ? 'rgba(239,68,68,0.4)' : '#2d2d44'}`,
                background: liked ? 'rgba(239,68,68,0.08)' : 'transparent',
                color: liked ? '#ef4444' : '#64748b',
                fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {liked ? '♥' : '♡'} {prompt.likes_count}
            </button>
          </div>
        </div>

        {/* Комментарии */}
        <div style={{ background: '#1a1a2e', border: '1px solid #2d2d44', borderRadius: 18, padding: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 24 }}>
            Комментарии {comments.length > 0 && <span style={{ color: '#64748b', fontWeight: 400, fontSize: 15 }}>({comments.length})</span>}
          </h2>

          {/* Форма */}
          {user ? (
            <form onSubmit={submitComment} style={{ marginBottom: 28 }}>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Напиши комментарий..."
                rows={3}
                style={{
                  width: '100%', padding: '12px 14px', background: '#0d0d14',
                  border: '1px solid #2d2d44', borderRadius: 10, color: '#fff',
                  fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#2d2d44'}
              />
              <button
                type="submit"
                disabled={sending || !comment.trim()}
                style={{
                  marginTop: 10, padding: '9px 20px', borderRadius: 8,
                  background: '#6366f1', border: 'none', color: '#fff',
                  fontSize: 13, fontWeight: 600, cursor: sending ? 'not-allowed' : 'pointer',
                  opacity: !comment.trim() ? 0.5 : 1, transition: 'all 0.2s',
                }}
              >
                {sending ? 'Отправляем...' : 'Отправить'}
              </button>
            </form>
          ) : (
            <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>
              <Link to="/login" style={{ color: '#6366f1', textDecoration: 'none' }}>Войди</Link>, чтобы оставить комментарий
            </p>
          )}

          {/* Список комментариев */}
          {comments.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: 14 }}>Комментариев пока нет</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {comments.map(c => (
                <div key={c.id} style={{ borderTop: '1px solid #2d2d44', paddingTop: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
                    }}>
                      {(c.profiles?.username || 'А').slice(0, 2).toUpperCase()}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#cbd5e1' }}>
                      {c.profiles?.username || 'Аноним'}
                    </span>
                    <span style={{ fontSize: 12, color: '#3d4d61' }}>
                      {new Date(c.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, paddingLeft: 38 }}>
                    {c.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

export default function Prompts() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [prompts, setPrompts]       = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [categoryId, setCategoryId] = useState(null)
  const [likedIds, setLikedIds]     = useState(new Set())

  useEffect(() => {
    supabase.from('categories').select('*').order('id').then(({ data }) => setCategories(data || []))
  }, [])

  useEffect(() => {
    fetchPrompts()
  }, [categoryId])

  useEffect(() => {
    if (!user) return
    supabase.from('likes').select('prompt_id').eq('user_id', user.id).then(({ data }) => {
      setLikedIds(new Set((data || []).map(l => l.prompt_id)))
    })
  }, [user])

  async function fetchPrompts() {
    setLoading(true)
    let query = supabase
      .from('prompts')
      .select('*, categories(name, slug), profiles(username)')
      .order('created_at', { ascending: false })
    if (categoryId) query = query.eq('category_id', categoryId)
    const { data } = await query
    setPrompts(data || [])
    setLoading(false)
  }

  async function toggleLike(e, prompt) {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    const liked = likedIds.has(prompt.id)
    if (liked) {
      await supabase.from('likes').delete().eq('user_id', user.id).eq('prompt_id', prompt.id)
      setLikedIds(prev => { const s = new Set(prev); s.delete(prompt.id); return s })
      setPrompts(prev => prev.map(p => p.id === prompt.id ? { ...p, likes_count: p.likes_count - 1 } : p))
    } else {
      await supabase.from('likes').insert({ user_id: user.id, prompt_id: prompt.id })
      setLikedIds(prev => new Set([...prev, prompt.id]))
      setPrompts(prev => prev.map(p => p.id === prompt.id ? { ...p, likes_count: p.likes_count + 1 } : p))
    }
  }

  const filtered = prompts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80, paddingBottom: 60, background: '#0d0d14' }}>
      <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 32px' }}>

        {/* Шапка */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 36, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
              Библиотека промптов
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 16 }}>
              {prompts.length} промптов от сообщества
            </p>
          </div>
          {user && (
            <Link to="/prompts/new" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 22px', borderRadius: 10,
              background: '#6366f1', color: '#fff',
              fontSize: 14, fontWeight: 600, textDecoration: 'none',
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#8b5cf6'}
              onMouseLeave={e => e.currentTarget.style.background = '#6366f1'}
            >
              + Добавить промпт
            </Link>
          )}
        </div>

        {/* Поиск */}
        <input
          type="text"
          placeholder="Поиск промптов..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '12px 18px',
            background: '#1a1a2e', border: '1px solid #2d2d44',
            borderRadius: 10, color: '#fff', fontSize: 15, outline: 'none',
            marginBottom: 20, boxSizing: 'border-box',
          }}
        />

        {/* Фильтры по категориям */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}>
          <button
            onClick={() => setCategoryId(null)}
            style={{
              padding: '7px 18px', borderRadius: 8, border: '1px solid',
              fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
              borderColor: categoryId === null ? '#6366f1' : '#2d2d44',
              background:  categoryId === null ? '#6366f1' : 'transparent',
              color:       categoryId === null ? '#fff'    : '#94a3b8',
            }}
          >
            Все
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryId(cat.id)}
              style={{
                padding: '7px 18px', borderRadius: 8, border: '1px solid',
                fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                borderColor: categoryId === cat.id ? (CATEGORY_COLORS[cat.slug] || '#6366f1') : '#2d2d44',
                background:  categoryId === cat.id ? (CATEGORY_COLORS[cat.slug] || '#6366f1') : 'transparent',
                color:       categoryId === cat.id ? '#fff' : '#94a3b8',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Список */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ height: 180, borderRadius: 14, background: '#1a1a2e', opacity: 0.5 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: 60, fontSize: 16 }}>
            Ничего не найдено
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
            {filtered.map(prompt => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                liked={likedIds.has(prompt.id)}
                onLike={toggleLike}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function PromptCard({ prompt, liked, onLike }) {
  const [hovered, setHovered] = useState(false)
  const cat = prompt.categories
  const color = CATEGORY_COLORS[cat?.slug] || '#6366f1'

  return (
    <Link
      to={`/prompts/${prompt.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block', textDecoration: 'none',
        background: '#1a1a2e',
        border: `1px solid ${hovered ? '#6366f1' : '#2d2d44'}`,
        borderRadius: 14, padding: 24, transition: 'all 0.25s',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 8px 30px rgba(99,102,241,0.15)' : 'none',
      }}
    >
      {/* Категория */}
      {cat && (
        <span style={{
          display: 'inline-block', fontSize: 11, fontWeight: 600, color,
          background: `${color}18`, border: `1px solid ${color}40`,
          padding: '3px 9px', borderRadius: 6, marginBottom: 12,
        }}>
          {cat.name}
        </span>
      )}

      {/* Заголовок */}
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8, lineHeight: 1.4 }}>
        {prompt.title}
      </h3>

      {/* Описание */}
      {prompt.description && (
        <p style={{
          fontSize: 13, color: '#94a3b8', lineHeight: 1.55, marginBottom: 16,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {prompt.description}
        </p>
      )}

      {/* Футер: автор + лайки */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <span style={{ fontSize: 12, color: '#64748b' }}>
          {prompt.profiles?.username || 'Аноним'}
        </span>
        <button
          onClick={e => onLike(e, prompt)}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, color: liked ? '#ef4444' : '#64748b',
            transition: 'color 0.2s', padding: '4px 8px',
          }}
        >
          {liked ? '♥' : '♡'} {prompt.likes_count}
        </button>
      </div>
    </Link>
  )
}

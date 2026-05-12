import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const CATEGORIES = [
  { label: 'Все',            value: null },
  { label: 'Текст и чат',    value: 'text' },
  { label: 'Код',            value: 'code' },
  { label: 'Изображения',    value: 'image' },
  { label: 'Видео',          value: 'video' },
  { label: 'Поиск',          value: 'search' },
  { label: 'Продуктивность', value: 'productivity' },
]

const CATEGORY_COLORS = {
  text:        '#6366f1',
  code:        '#10b981',
  image:       '#f59e0b',
  video:       '#ef4444',
  search:      '#3b82f6',
  productivity:'#8b5cf6',
}

const CATEGORY_LABELS = {
  text:        'Текст и чат',
  code:        'Код',
  image:       'Изображения',
  video:       'Видео',
  search:      'Поиск',
  productivity:'Продуктивность',
}

// Simple Icons CDN — белые SVG логотипы без фона
const MODEL_ICONS = {
  chatgpt:    'https://cdn.simpleicons.org/openai/ffffff',
  claude:     'https://cdn.simpleicons.org/anthropic/ffffff',
  gemini:     'https://cdn.simpleicons.org/googlegemini/ffffff',
  grok:       'https://cdn.simpleicons.org/x/ffffff',
  midjourney: 'https://cdn.simpleicons.org/midjourney/ffffff',
  kling:      null,
  runway:     'https://cdn.simpleicons.org/runwayml/ffffff',
  perplexity: 'https://cdn.simpleicons.org/perplexity/ffffff',
  cursor:     'https://cdn.simpleicons.org/cursor/ffffff',
  deepseek:   'https://cdn.simpleicons.org/deepseek/ffffff',
}

export default function Catalog() {
  const [models, setModels]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState(null)

  useEffect(() => {
    async function fetchModels() {
      setLoading(true)
      let query = supabase.from('ai_models').select('*').order('id')
      if (category) query = query.eq('category', category)
      const { data } = await query
      setModels(data || [])
      setLoading(false)
    }
    fetchModels()
  }, [category])

  const filtered = models.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80, paddingBottom: 60, background: '#0d0d14' }}>
      <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 32px' }}>

        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
            Каталог AI-инструментов
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 16 }}>
            {models.length} сервисов — выбери подходящий для твоих задач
          </p>
        </div>

        <input
          type="text"
          placeholder="Поиск по названию..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '12px 18px',
            background: '#1a1a2e', border: '1px solid #2d2d44',
            borderRadius: 10, color: '#fff', fontSize: 15, outline: 'none',
            marginBottom: 20,
          }}
        />

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.label}
              onClick={() => setCategory(cat.value)}
              style={{
                padding: '7px 18px', borderRadius: 8, border: '1px solid',
                fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                borderColor: category === cat.value ? '#6366f1' : '#2d2d44',
                background:  category === cat.value ? '#6366f1' : 'transparent',
                color:       category === cat.value ? '#fff'    : '#94a3b8',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ height: 200, borderRadius: 14, background: '#1a1a2e', opacity: 0.5 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: 60, fontSize: 16 }}>
            Ничего не найдено
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {filtered.map(model => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ModelCard({ model }) {
  const [hovered, setHovered]     = useState(false)
  const [iconError, setIconError] = useState(false)
  const color   = CATEGORY_COLORS[model.category] || '#6366f1'
  const iconUrl = MODEL_ICONS[model.slug]

  return (
    <Link
      to={`/catalog/${model.slug}`}
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
      {/* Шапка: иконка + бейджи */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>

        {/* Иконка */}
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: '#0d0d14', border: '1px solid #2d2d44',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {iconUrl && !iconError ? (
            <img
              src={iconUrl}
              alt={model.name}
              onError={() => setIconError(true)}
              style={{ width: 26, height: 26, objectFit: 'contain' }}
            />
          ) : (
            <span style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>
              {model.name[0]}
            </span>
          )}
        </div>

        {/* Бейджи */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {model.has_free_tier && (
            <span style={{
              fontSize: 11, fontWeight: 600, color: '#10b981',
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
              padding: '3px 9px', borderRadius: 6, whiteSpace: 'nowrap',
            }}>
              Бесплатно
            </span>
          )}
          <span style={{
            fontSize: 11, fontWeight: 600, color: '#f59e0b',
            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
            padding: '3px 9px', borderRadius: 6, whiteSpace: 'nowrap',
          }}>
            Подписка
          </span>
        </div>
      </div>

      {/* Название */}
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
        {model.name}
      </h3>

      {/* Описание */}
      <p style={{
        fontSize: 13, color: '#94a3b8', lineHeight: 1.55, marginBottom: 16,
        display: '-webkit-box', WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {model.short_description}
      </p>

      {/* Категория + разработчик */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: 11, fontWeight: 600, color,
          background: `${color}18`, border: `1px solid ${color}40`,
          padding: '3px 9px', borderRadius: 6,
        }}>
          {CATEGORY_LABELS[model.category] || model.category}
        </span>
        <span style={{ fontSize: 12, color: '#64748b' }}>{model.developer}</span>
      </div>
    </Link>
  )
}

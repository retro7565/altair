import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const MODEL_ICONS = {
  chatgpt:    'https://cdn.simpleicons.org/openai/ffffff',
  claude:     'https://cdn.simpleicons.org/anthropic/ffffff',
  gemini:     'https://cdn.simpleicons.org/googlegemini/ffffff',
  grok:       'https://cdn.simpleicons.org/x/ffffff',
  midjourney: 'https://cdn.simpleicons.org/midjourney/ffffff',
  runway:     'https://cdn.simpleicons.org/runwayml/ffffff',
  perplexity: 'https://cdn.simpleicons.org/perplexity/ffffff',
  cursor:     'https://cdn.simpleicons.org/cursor/ffffff',
  deepseek:   'https://cdn.simpleicons.org/deepseek/ffffff',
}

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

const PROMPT_CAT_COLORS = {
  programming:  '#10b981',
  studying:     '#6366f1',
  writing:      '#f59e0b',
  marketing:    '#ef4444',
  design:       '#ec4899',
  productivity: '#8b5cf6',
}

export default function Home() {
  const { user } = useAuth()
  const [models, setModels]   = useState([])
  const [prompts, setPrompts] = useState([])

  useEffect(() => {
    supabase.from('ai_models').select('*').order('id').limit(6).then(({ data }) => setModels(data || []))
    supabase.from('prompts').select('*, categories(name, slug), profiles(username)')
      .order('likes_count', { ascending: false }).limit(3).then(({ data }) => setPrompts(data || []))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d14' }}>

      {/* Hero */}
      <section style={{
        paddingTop: 160, paddingBottom: 100,
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        padding: '160px 32px 100px',
        background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.15), transparent)',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: 50, padding: '6px 16px', fontSize: 13, color: '#a5b4fc',
          marginBottom: 32,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} />
          Каталог AI-инструментов и промптов
        </div>

        <h1 style={{
          fontSize: 64, fontWeight: 900, color: '#fff',
          lineHeight: 1.1, marginBottom: 24, maxWidth: 780,
          letterSpacing: '-2px',
        }}>
          Все AI-инструменты<br />
          <span style={{ color: '#6366f1' }}>в одном месте</span>
        </h1>

        <p style={{
          fontSize: 18, color: '#94a3b8', lineHeight: 1.7,
          maxWidth: 560, marginBottom: 44,
        }}>
          Находи лучшие нейросети, изучай их возможности и делись промптами с сообществом
        </p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/catalog" style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '14px 32px', borderRadius: 12,
            background: '#6366f1', color: '#fff',
            fontSize: 15, fontWeight: 600, textDecoration: 'none',
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#8b5cf6'}
            onMouseLeave={e => e.currentTarget.style.background = '#6366f1'}
          >
            Открыть каталог →
          </Link>
          <Link to="/prompts" style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '14px 32px', borderRadius: 12,
            border: '1px solid #2d2d44', color: '#cbd5e1',
            fontSize: 15, fontWeight: 500, textDecoration: 'none',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#2d2d44'; e.currentTarget.style.color = '#cbd5e1' }}
          >
            Промпты сообщества
          </Link>
        </div>

        {/* Статистика */}
        <div style={{ display: 'flex', gap: 48, marginTop: 72, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { value: '10+', label: 'AI-инструментов' },
            { value: '6',   label: 'категорий' },
            { value: '∞',   label: 'промптов' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 6 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Популярные AI */}
      <section style={{ maxWidth: 1152, margin: '0 auto', padding: '0 32px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>Популярные инструменты</h2>
          <Link to="/catalog" style={{ fontSize: 14, color: '#6366f1', textDecoration: 'none' }}>Все инструменты →</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {models.map(model => (
            <ModelMiniCard key={model.id} model={model} />
          ))}
        </div>
      </section>

      {/* Последние промпты */}
      {prompts.length > 0 && (
        <section style={{ background: '#111120', padding: '80px 32px' }}>
          <div style={{ maxWidth: 1152, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>Популярные промпты</h2>
              <Link to="/prompts" style={{ fontSize: 14, color: '#6366f1', textDecoration: 'none' }}>Все промпты →</Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {prompts.map(prompt => (
                <PromptMiniCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {!user && (
        <section style={{ padding: '80px 32px', textAlign: 'center' }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 16, letterSpacing: '-1px' }}>
              Присоединяйся к Altair
            </h2>
            <p style={{ fontSize: 16, color: '#94a3b8', marginBottom: 36, lineHeight: 1.6 }}>
              Создай аккаунт, чтобы сохранять промпты, ставить лайки и делиться своими находками с сообществом
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" style={{
                padding: '13px 30px', borderRadius: 12,
                background: '#6366f1', color: '#fff',
                fontSize: 15, fontWeight: 600, textDecoration: 'none',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#8b5cf6'}
                onMouseLeave={e => e.currentTarget.style.background = '#6366f1'}
              >
                Зарегистрироваться
              </Link>
              <Link to="/login" style={{
                padding: '13px 30px', borderRadius: 12,
                border: '1px solid #2d2d44', color: '#94a3b8',
                fontSize: 15, textDecoration: 'none',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2d2d44'; e.currentTarget.style.color = '#94a3b8' }}
              >
                Войти
              </Link>
            </div>
          </div>
        </section>
      )}

    </div>
  )
}

function ModelMiniCard({ model }) {
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
        display: 'flex', alignItems: 'center', gap: 16,
        textDecoration: 'none', background: '#1a1a2e',
        border: `1px solid ${hovered ? '#6366f1' : '#2d2d44'}`,
        borderRadius: 14, padding: '18px 20px', transition: 'all 0.25s',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? '0 8px 24px rgba(99,102,241,0.12)' : 'none',
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: '#0d0d14', border: '1px solid #2d2d44',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {iconUrl && !iconError ? (
          <img src={iconUrl} alt={model.name} onError={() => setIconError(true)}
            style={{ width: 24, height: 24, objectFit: 'contain' }} />
        ) : (
          <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{model.name[0]}</span>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{model.name}</div>
        <div style={{ fontSize: 12, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {model.short_description}
        </div>
      </div>
      <span style={{
        fontSize: 11, fontWeight: 600, color, flexShrink: 0,
        background: `${color}18`, border: `1px solid ${color}40`,
        padding: '3px 8px', borderRadius: 6,
      }}>
        {CATEGORY_LABELS[model.category] || model.category}
      </span>
    </Link>
  )
}

function PromptMiniCard({ prompt }) {
  const [hovered, setHovered] = useState(false)
  const cat = prompt.categories
  const color = PROMPT_CAT_COLORS[cat?.slug] || '#6366f1'

  return (
    <Link
      to={`/prompts/${prompt.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block', textDecoration: 'none', background: '#1a1a2e',
        border: `1px solid ${hovered ? '#6366f1' : '#2d2d44'}`,
        borderRadius: 14, padding: 22, transition: 'all 0.25s',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? '0 8px 24px rgba(99,102,241,0.12)' : 'none',
      }}
    >
      {cat && (
        <span style={{
          fontSize: 11, fontWeight: 600, color,
          background: `${color}18`, border: `1px solid ${color}40`,
          padding: '3px 9px', borderRadius: 6, display: 'inline-block', marginBottom: 10,
        }}>
          {cat.name}
        </span>
      )}
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8, lineHeight: 1.4 }}>
        {prompt.title}
      </h3>
      {prompt.description && (
        <p style={{
          fontSize: 13, color: '#94a3b8', lineHeight: 1.5, marginBottom: 12,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {prompt.description}
        </p>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: '#64748b' }}>{prompt.profiles?.username || 'Аноним'}</span>
        <span style={{ fontSize: 13, color: '#64748b' }}>♥ {prompt.likes_count}</span>
      </div>
    </Link>
  )
}

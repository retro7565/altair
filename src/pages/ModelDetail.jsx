import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

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

function Section({ title, children }) {
  return (
    <div style={{
      background: '#1a1a2e', border: '1px solid #2d2d44',
      borderRadius: 14, padding: 28, marginBottom: 20,
    }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 16 }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

function ListItems({ text, color = '#6366f1' }) {
  if (!text) return <p style={{ color: '#64748b', fontSize: 14 }}>Нет данных</p>
  const items = text.split('\n').map(s => s.replace(/^[-•]\s*/, '').trim()).filter(Boolean)
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#cbd5e1', lineHeight: 1.6 }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: color,
            flexShrink: 0, marginTop: 7,
          }} />
          {item}
        </li>
      ))}
    </ul>
  )
}

export default function ModelDetail() {
  const { id: slug } = useParams()
  const [model, setModel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [iconError, setIconError] = useState(false)

  useEffect(() => {
    async function fetchModel() {
      setLoading(true)
      const { data } = await supabase
        .from('ai_models')
        .select('*')
        .eq('slug', slug)
        .single()
      setModel(data || null)
      if (data) document.title = `${data.name} — нейросеть для работы | Altair`
      setLoading(false)
    }
    fetchModel()
  }, [slug])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: 80, background: '#0d0d14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#94a3b8', fontSize: 16 }}>Загрузка...</div>
      </div>
    )
  }

  if (!model) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: 80, background: '#0d0d14', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <p style={{ color: '#94a3b8', fontSize: 18 }}>Модель не найдена</p>
        <Link to="/catalog" style={{ color: '#6366f1', textDecoration: 'none', fontSize: 14 }}>← Вернуться в каталог</Link>
      </div>
    )
  }

  const color = CATEGORY_COLORS[model.category] || '#6366f1'
  const iconUrl = MODEL_ICONS[model.slug]

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80, paddingBottom: 80, background: '#0d0d14' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 32px' }}>

        {/* Back link */}
        <Link
          to="/catalog"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748b', textDecoration: 'none', fontSize: 13, marginBottom: 32, transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
          onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
        >
          ← Каталог AI-инструментов
        </Link>

        {/* Hero card */}
        <div style={{
          background: '#1a1a2e', border: '1px solid #2d2d44',
          borderRadius: 18, padding: 36, marginBottom: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>

            {/* Icon */}
            <div style={{
              width: 72, height: 72, borderRadius: 18,
              background: '#0d0d14', border: '1px solid #2d2d44',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {iconUrl && !iconError ? (
                <img
                  src={iconUrl}
                  alt={model.name}
                  onError={() => setIconError(true)}
                  style={{ width: 40, height: 40, objectFit: 'contain' }}
                />
              ) : (
                <span style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>
                  {model.name[0]}
                </span>
              )}
            </div>

            {/* Name + meta */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
                <h1 style={{ fontSize: 30, fontWeight: 800, color: '#fff', margin: 0 }}>
                  {model.name}
                </h1>
                <span style={{
                  fontSize: 11, fontWeight: 600, color,
                  background: `${color}18`, border: `1px solid ${color}40`,
                  padding: '3px 10px', borderRadius: 6,
                }}>
                  {CATEGORY_LABELS[model.category] || model.category}
                </span>
              </div>

              <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>
                {model.short_description}
              </p>

              {/* Badges + developer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                {model.has_free_tier && (
                  <span style={{
                    fontSize: 12, fontWeight: 600, color: '#10b981',
                    background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                    padding: '4px 12px', borderRadius: 8,
                  }}>Бесплатно</span>
                )}
                <span style={{
                  fontSize: 12, fontWeight: 600, color: '#f59e0b',
                  background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
                  padding: '4px 12px', borderRadius: 8,
                }}>Подписка</span>
                <span style={{ fontSize: 13, color: '#64748b', marginLeft: 4 }}>
                  от {model.developer}
                </span>
              </div>
            </div>

            {/* Official link */}
            {model.official_url && (
              <a
                href={model.official_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '10px 22px', borderRadius: 10,
                  background: '#6366f1', color: '#fff',
                  fontSize: 14, fontWeight: 600, textDecoration: 'none',
                  transition: 'background 0.2s', whiteSpace: 'nowrap', alignSelf: 'flex-start',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#8b5cf6'}
                onMouseLeave={e => e.currentTarget.style.background = '#6366f1'}
              >
                Открыть сайт ↗
              </a>
            )}
          </div>
        </div>

        {/* Full description */}
        {model.full_description && (
          <Section title="О сервисе">
            <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.75 }}>
              {model.full_description}
            </p>
          </Section>
        )}

        {/* Use cases + strengths/weaknesses side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 20 }}>

          {model.use_cases && (
            <div style={{ background: '#1a1a2e', border: '1px solid #2d2d44', borderRadius: 14, padding: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Для чего использовать</h2>
              <ListItems text={model.use_cases} color='#6366f1' />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {model.strengths && (
              <div style={{ background: '#1a1a2e', border: '1px solid #2d2d44', borderRadius: 14, padding: 28, flex: 1 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Преимущества</h2>
                <ListItems text={model.strengths} color='#10b981' />
              </div>
            )}

            {model.weaknesses && (
              <div style={{ background: '#1a1a2e', border: '1px solid #2d2d44', borderRadius: 14, padding: 28, flex: 1 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Недостатки</h2>
                <ListItems text={model.weaknesses} color='#ef4444' />
              </div>
            )}
          </div>
        </div>

        {/* Pricing */}
        {model.pricing_info && (
          <Section title="Тарифы и стоимость">
            <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.75, whiteSpace: 'pre-line' }}>
              {model.pricing_info}
            </p>
          </Section>
        )}

        {/* How to start */}
        {model.how_to_start && (
          <Section title="Как начать">
            <ListItems text={model.how_to_start} color='#3b82f6' />
          </Section>
        )}

        {/* Russia notes */}
        {model.russia_notes && (
          <div style={{
            background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.25)',
            borderRadius: 14, padding: 28, marginBottom: 20,
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f59e0b', marginBottom: 12 }}>
              Доступность в России
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.75 }}>
              {model.russia_notes}
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

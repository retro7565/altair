import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export default function PromptNew() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [models, setModels]         = useState([])
  const [title, setTitle]           = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent]       = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [modelId, setModelId]       = useState('')
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState('')

  useEffect(() => {
    if (!loading && !user) navigate('/login')
  }, [user, loading])

  useEffect(() => {
    supabase.from('categories').select('*').order('id').then(({ data }) => {
      setCategories(data || [])
      if (data?.length) setCategoryId(data[0].id)
    })
    supabase.from('ai_models').select('id, name, slug').order('name').then(({ data }) => {
      setModels(data || [])
    })
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!content.trim()) { setError('Текст промпта обязателен'); return }
    setSaving(true)
    const { error } = await supabase.from('prompts').insert({
      user_id: user.id,
      title: title.trim(),
      description: description.trim() || null,
      content: content.trim(),
      category_id: Number(categoryId),
      ai_model_id: modelId ? Number(modelId) : null,
    })
    setSaving(false)
    if (error) setError(error.message)
    else navigate('/prompts')
  }

  if (loading || !user) return null

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80, paddingBottom: 80, background: '#0d0d14' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 32px' }}>

        <Link to="/prompts" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748b', textDecoration: 'none', fontSize: 13, marginBottom: 32 }}
          onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
          onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
        >
          ← Библиотека промптов
        </Link>

        <div style={{ background: '#1a1a2e', border: '1px solid #2d2d44', borderRadius: 18, padding: 36 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 28 }}>
            Новый промпт
          </h1>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>Заголовок *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                maxLength={100}
                placeholder="Короткое название промпта"
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
              <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>Категория</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                style={{
                  width: '100%', padding: '11px 14px', background: '#0d0d14',
                  border: '1px solid #2d2d44', borderRadius: 10, color: '#fff',
                  fontSize: 14, outline: 'none', boxSizing: 'border-box', cursor: 'pointer',
                }}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>AI-модель</label>
              <select
                value={modelId}
                onChange={e => setModelId(e.target.value)}
                style={{
                  width: '100%', padding: '11px 14px', background: '#0d0d14',
                  border: '1px solid #2d2d44', borderRadius: 10, color: modelId ? '#fff' : '#64748b',
                  fontSize: 14, outline: 'none', boxSizing: 'border-box', cursor: 'pointer',
                }}
              >
                <option value=''>Не указана</option>
                {models.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>Описание</label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                maxLength={200}
                placeholder="Для чего этот промпт (необязательно)"
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
              <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>Текст промпта *</label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                required
                rows={8}
                placeholder="Напиши текст промпта здесь..."
                style={{
                  width: '100%', padding: '12px 14px', background: '#0d0d14',
                  border: '1px solid #2d2d44', borderRadius: 10, color: '#fff',
                  fontSize: 14, outline: 'none', resize: 'vertical',
                  boxSizing: 'border-box', fontFamily: 'monospace', lineHeight: 1.6,
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

            <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  flex: 1, padding: '12px', borderRadius: 10, border: 'none',
                  background: saving ? '#4b4f8f' : '#6366f1', color: '#fff',
                  fontSize: 15, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
                }}
              >
                {saving ? 'Сохраняем...' : 'Опубликовать'}
              </button>
              <Link to="/prompts" style={{
                padding: '12px 24px', borderRadius: 10,
                border: '1px solid #2d2d44', color: '#94a3b8',
                fontSize: 15, textDecoration: 'none', display: 'flex', alignItems: 'center',
              }}>
                Отмена
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

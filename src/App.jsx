import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_BASE = import.meta.env.PROD ? 'https://course-notes-site-qyz8.onrender.com' : ''

const text = {
  loading: '\u8f09\u5165\u5f8c\u7aef\u8cc7\u6599\u5eab\u4e2d',
  connected: '\u5df2\u9023\u7dda\u5230\u5f8c\u7aef\u8cc7\u6599\u5eab',
  localMode: '\u76ee\u524d\u4f7f\u7528\u700f\u89bd\u5668\u66ab\u5b58\u8cc7\u6599\uff1b\u555f\u52d5\u5f8c\u7aef\u5f8c\u6703\u5beb\u5165\u8cc7\u6599\u5eab',
  saved: '\u65b0\u7b46\u8a18\u5df2\u5beb\u5165\u5f8c\u7aef\u8cc7\u6599\u5eab',
  savedLocal: '\u65b0\u7b46\u8a18\u5df2\u5b58\u5230\u700f\u89bd\u5668\u66ab\u5b58\u8cc7\u6599',
  updated: '\u7b46\u8a18\u5df2\u66f4\u65b0\u5230\u5f8c\u7aef\u8cc7\u6599\u5eab',
  updatedLocal: '\u7b46\u8a18\u5df2\u66f4\u65b0\u5230\u700f\u89bd\u5668\u66ab\u5b58\u8cc7\u6599',
  deleted: '\u7b46\u8a18\u5df2\u5f9e\u5f8c\u7aef\u8cc7\u6599\u5eab\u522a\u9664',
  deleteFailed: '\u522a\u9664\u5931\u6557\uff0c\u8acb\u78ba\u8a8d\u5f8c\u7aef server \u5df2\u91cd\u65b0\u555f\u52d5',
  all: '\u5168\u90e8',
  base: '\u524d\u7aef\u57fa\u790e',
  interaction: '\u4e92\u52d5\u8a2d\u8a08',
  backend: '\u5f8c\u7aef\u8cc7\u6599\u5eab',
  final: '\u671f\u672b\u5c08\u984c',
}

const emptyForm = { title: '', course: '', category: text.base, summary: '', content: '' }

const starterNotes = [
  { id: 'html-css', title: 'HTML \u8207 CSS \u57fa\u790e', course: '\u7b2c\u4e00\u9031', category: text.base, summary: '\u6574\u7406\u8a9e\u610f\u5316\u6a19\u7c64\u3001\u76d2\u6a21\u578b\u3001\u6392\u7248\u8207 RWD \u7684\u6838\u5fc3\u89c0\u5ff5\u3002', content: 'HTML \u8ca0\u8cac\u5167\u5bb9\u7d50\u69cb\uff0cCSS \u8ca0\u8cac\u756b\u9762\u5448\u73fe\u3002\u4f7f\u7528 flex\u3001grid \u8207 media query \u53ef\u4ee5\u8b93\u7db2\u7ad9\u5728\u624b\u6a5f\u8207\u96fb\u8166\u4e0a\u90fd\u5bb9\u6613\u95b1\u8b80\u3002', updatedAt: '2026-05-02' },
  { id: 'javascript-dom', title: 'JavaScript \u8207 DOM \u64cd\u4f5c', course: '\u7b2c\u4e09\u9031', category: text.interaction, summary: '\u8a18\u9304\u4e8b\u4ef6\u76e3\u807d\u3001\u8868\u55ae\u8655\u7406\u3001\u9663\u5217\u65b9\u6cd5\u8207\u8cc7\u6599\u6e32\u67d3\u3002', content: 'JavaScript \u53ef\u4ee5\u63a5\u6536\u4f7f\u7528\u8005\u8f38\u5165\uff0c\u900f\u904e state \u6216 DOM \u66f4\u65b0\u756b\u9762\u3002\u8868\u55ae\u9001\u51fa\u524d\u8981\u9a57\u8b49\u6b04\u4f4d\uff0c\u907f\u514d\u7a7a\u8cc7\u6599\u9032\u5165\u8cc7\u6599\u5eab\u3002', updatedAt: '2026-05-16' },
  { id: 'backend-database', title: '\u5f8c\u7aef API \u8207\u8cc7\u6599\u5eab', course: '\u7b2c\u516b\u9031', category: text.backend, summary: '\u7528 API \u5132\u5b58\u8ab2\u7a0b\u7b46\u8a18\uff0c\u8b93\u524d\u7aef\u4e0d\u53ea\u662f\u4e00\u500b\u975c\u614b\u9801\u9762\u3002', content: '\u524d\u7aef\u900f\u904e fetch \u547c\u53eb\u5f8c\u7aef API\u3002\u5f8c\u7aef\u63a5\u6536\u8cc7\u6599\u5f8c\u5beb\u5165 JSON \u8cc7\u6599\u5eab\uff0c\u91cd\u65b0\u6574\u7406\u9801\u9762\u5f8c\u8cc7\u6599\u4ecd\u7136\u5b58\u5728\u3002', updatedAt: '2026-06-10' },
]

const lessons = [
  'HTML \u8a9e\u610f\u5316\u6a19\u7c64\u8207\u7db2\u7ad9\u7d50\u69cb',
  'CSS \u76d2\u6a21\u578b\u3001Flexbox\u3001Grid \u8207 RWD',
  'JavaScript \u8b8a\u6578\u3001\u51fd\u5f0f\u3001\u9663\u5217\u8207\u7269\u4ef6',
  'DOM \u4e8b\u4ef6\u8655\u7406\u8207\u8868\u55ae\u9a57\u8b49',
  'React \u5143\u4ef6\u5316\u3001props \u8207 state',
  '\u524d\u5f8c\u7aef API \u4e32\u63a5\u8207\u8cc7\u6599\u5eab\u5132\u5b58',
]

function App() {
  const [view, setView] = useState(() => (window.location.hash === '#project' ? 'project' : 'home'))
  useEffect(() => {
    const syncView = () => setView(window.location.hash === '#project' ? 'project' : 'home')
    window.addEventListener('hashchange', syncView)
    return () => window.removeEventListener('hashchange', syncView)
  }, [])
  return view === 'project' ? <ProjectPage /> : <HomePage />
}

function HomePage() {
  return (
    <main>
      <nav className="site-nav" aria-label="main navigation"><a className="brand" href="#top" aria-label="home">CN</a><div className="nav-links"><a href="#about">&#x500B;&#x4EBA;&#x7C21;&#x4ECB;</a><a href="#course">&#x8AB2;&#x7A0B;&#x5167;&#x5BB9;</a><a href="#final">&#x671F;&#x672B;&#x5C08;&#x984C;</a></div></nav>
      <section className="hero-section" id="top"><div className="hero-copy"><p className="eyebrow">Web Design Final Portfolio</p><h1>&#x8AB2;&#x7A0B;&#x7B46;&#x8A18;&#x7DB2;&#x7AD9;</h1><p className="hero-text">&#x9019;&#x662F;&#x6211;&#x7684;&#x671F;&#x672B;&#x4F5C;&#x696D;&#x7DB2;&#x7AD9;&#xFF0C;&#x6574;&#x5408;&#x500B;&#x4EBA;&#x7C21;&#x4ECB;&#x3001;&#x672C;&#x5B78;&#x671F;&#x7684;&#x7DB2;&#x9801;&#x8A2D;&#x8A08;&#x8AB2;&#x7A0B;&#x5167;&#x5BB9;&#xFF0C;&#x4EE5;&#x53CA;&#x53EF;&#x9023;&#x63A5;&#x5F8C;&#x7AEF;&#x8CC7;&#x6599;&#x5EAB;&#x7684;&#x8AB2;&#x7A0B;&#x7B46;&#x8A18;&#x7CFB;&#x7D71;&#x3002;</p><div className="hero-actions"><a className="primary-link" href="#project">&#x958B;&#x555F;&#x671F;&#x672B;&#x5C08;&#x984C;</a><a className="secondary-link" href="#course">&#x67E5;&#x770B;&#x8AB2;&#x7A0B;&#x5167;&#x5BB9;</a></div></div><div className="hero-panel" aria-label="site overview"><div><span>Front End</span><strong>React + Vite</strong></div><div><span>Back End</span><strong>Node API</strong></div><div><span>Database</span><strong>JSON Notes DB</strong></div></div></section>
      <section className="content-band" id="about"><div className="section-heading"><p className="eyebrow">About Me</p><h2>&#x500B;&#x4EBA;&#x7C21;&#x4ECB;</h2></div><div className="about-grid"><article><h3>&#x6211;&#x7684;&#x57FA;&#x672C;&#x8CC7;&#x6599;</h3><p>&#x6211;&#x662F; 4B2G0069 &#x8B1D;&#x627F;&#x4FEE;&#xFF0C;&#x76EE;&#x524D;&#x5C31;&#x8B80;&#x5357;&#x53F0;&#x79D1;&#x6280;&#x5927;&#x5B78;&#x3002;&#x9019;&#x500B;&#x7DB2;&#x7AD9;&#x662F;&#x6211;&#x7684;&#x7DB2;&#x9801;&#x8A2D;&#x8A08;&#x8AB2;&#x7A0B;&#x671F;&#x672B;&#x4F5C;&#x54C1;&#xFF0C;&#x7528;&#x4F86;&#x6574;&#x7406;&#x672C;&#x5B78;&#x671F;&#x5B78;&#x5230;&#x7684;&#x524D;&#x7AEF;&#x3001;&#x5F8C;&#x7AEF;&#x8207;&#x8CC7;&#x6599;&#x5EAB;&#x61C9;&#x7528;&#x3002;</p></article><article><h3>&#x7DB2;&#x7AD9;&#x88FD;&#x4F5C;&#x76EE;&#x6A19;</h3><p>&#x9019;&#x500B;&#x7DB2;&#x7AD9;&#x4E0D;&#x53EA;&#x662F;&#x975C;&#x614B;&#x4F5C;&#x54C1;&#x96C6;&#xFF0C;&#x4E5F;&#x5305;&#x542B;&#x5BE6;&#x969B;&#x53EF;&#x64CD;&#x4F5C;&#x7684;&#x671F;&#x672B;&#x5C08;&#x984C;&#x3002;&#x4F7F;&#x7528;&#x8005;&#x53EF;&#x4EE5;&#x65B0;&#x589E;&#x3001;&#x7DE8;&#x8F2F;&#x3001;&#x522A;&#x9664;&#x7B46;&#x8A18;&#xFF0C;&#x4E26;&#x4F9D;&#x95DC;&#x9375;&#x5B57;&#x6216;&#x5206;&#x985E;&#x95B1;&#x8B80;&#x672C;&#x5B78;&#x671F;&#x5B78;&#x5230;&#x7684;&#x91CD;&#x9EDE;&#x3002;</p></article></div></section>
      <section className="content-band alt" id="course"><div className="section-heading"><p className="eyebrow">Course Review</p><h2>&#x672C;&#x5B78;&#x671F;&#x4E0A;&#x8AB2;&#x5167;&#x5BB9;</h2></div><ol className="lesson-list">{lessons.map((lesson, index) => <li key={lesson}><span>{String(index + 1).padStart(2, '0')}</span>{lesson}</li>)}</ol></section>
      <section className="content-band" id="final"><div className="section-heading"><p className="eyebrow">Final Project</p><h2>&#x671F;&#x672B;&#x5C08;&#x984C;</h2></div><div className="project-summary"><div><h3>&#x8AB2;&#x7A0B;&#x7B46;&#x8A18;&#x7BA1;&#x7406;&#x7CFB;&#x7D71;</h3><p>&#x5C08;&#x984C;&#x63D0;&#x4F9B;&#x7B46;&#x8A18;&#x700F;&#x89BD;&#x3001;&#x65B0;&#x589E;&#x3001;&#x7DE8;&#x8F2F;&#x3001;&#x522A;&#x9664;&#x3001;&#x5206;&#x985E;&#x8207;&#x641C;&#x5C0B;&#x529F;&#x80FD;&#x3002;&#x524D;&#x7AEF;&#x4F7F;&#x7528; React &#x88FD;&#x4F5C;&#x4E92;&#x52D5;&#x4ECB;&#x9762;&#xFF0C;&#x5F8C;&#x7AEF;&#x4F7F;&#x7528; Node API&#xFF0C;&#x8CC7;&#x6599;&#x5132;&#x5B58;&#x5728; JSON &#x8CC7;&#x6599;&#x5EAB;&#x4E2D;&#x3002;</p></div><a className="primary-link" href="#project">&#x5728;&#x672C;&#x9801;&#x700F;&#x89BD;&#x5C08;&#x984C;</a></div></section>
    </main>
  )
}

function ProjectPage() {
  const [notes, setNotes] = useState(starterNotes)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(text.all)
  const [status, setStatus] = useState(text.loading)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    fetch(API_BASE + '/api/notes').then((response) => {
      if (!response.ok) throw new Error('API unavailable')
      return response.json()
    }).then((data) => {
      setNotes(data)
      setStatus(text.connected)
    }).catch(() => {
      const saved = window.localStorage.getItem('course-notes-demo')
      if (saved) setNotes(JSON.parse(saved))
      setStatus(text.localMode)
    })
  }, [])

  const categories = useMemo(() => [text.all, ...Array.from(new Set(notes.map((note) => note.category)))], [notes])
  const filteredNotes = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return notes.filter((note) => {
      const matchCategory = category === text.all || note.category === category
      const searchable = (note.title + ' ' + note.course + ' ' + note.category + ' ' + note.summary + ' ' + note.content).toLowerCase()
      return matchCategory && searchable.includes(keyword)
    })
  }, [category, notes, query])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }
  const resetForm = () => { setEditingId(null); setForm(emptyForm) }
  const saveFallback = (nextNotes) => { window.localStorage.setItem('course-notes-demo', JSON.stringify(nextNotes)); setNotes(nextNotes) }
  const handleEdit = (note) => { setEditingId(note.id); setForm({ title: note.title, course: note.course, category: note.category, summary: note.summary, content: note.content }); document.getElementById('create')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

  const handleSubmit = (event) => {
    event.preventDefault()
    const payload = { ...form, updatedAt: new Date().toISOString().slice(0, 10) }
    if (editingId) {
      fetch(API_BASE + '/api/notes/' + encodeURIComponent(editingId), { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then((response) => { if (!response.ok) throw new Error('Update failed'); return response.json() }).then((updatedNote) => { setNotes((current) => current.map((note) => (note.id === editingId ? updatedNote : note))); setStatus(text.updated); resetForm() }).catch(() => { const nextNotes = notes.map((note) => (note.id === editingId ? { ...note, ...payload } : note)); saveFallback(nextNotes); setStatus(text.updatedLocal); resetForm() })
      return
    }
    const nextNote = { id: crypto.randomUUID(), ...payload }
    fetch(API_BASE + '/api/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(nextNote) }).then((response) => { if (!response.ok) throw new Error('Save failed'); return response.json() }).then((savedNote) => { setNotes((current) => [savedNote, ...current]); setStatus(text.saved); resetForm() }).catch(() => { saveFallback([nextNote, ...notes]); setStatus(text.savedLocal); resetForm() })
  }

  const handleDelete = (noteId) => {
    const target = notes.find((note) => note.id === noteId)
    const confirmed = window.confirm('\u78ba\u5b9a\u8981\u522a\u9664\u300c' + (target?.title || '\u9019\u7bc7\u7b46\u8a18') + '\u300d\u55ce\uff1f')
    if (!confirmed) return
    fetch(API_BASE + '/api/notes/' + encodeURIComponent(noteId), { method: 'DELETE' }).then((response) => { if (!response.ok) throw new Error('Delete failed'); return response.json() }).then(() => { setNotes((current) => current.filter((note) => note.id !== noteId)); setStatus(text.deleted); if (editingId === noteId) resetForm() }).catch(() => setStatus(text.deleteFailed))
  }

  return (
    <main className="project-page">
      <nav className="site-nav project-nav" aria-label="project navigation"><a className="brand" href="./">CN</a><div className="nav-links"><a href="./">&#x56DE;&#x9996;&#x9801;</a><a href="#notes">&#x7B46;&#x8A18;&#x5217;&#x8868;</a><a href="#create">&#x65B0;&#x589E;&#x6216;&#x7DE8;&#x8F2F;</a></div></nav>
      <section className="project-hero" id="top"><div><p className="eyebrow">Final Project</p><h1>&#x8AB2;&#x7A0B;&#x7B46;&#x8A18;&#x7BA1;&#x7406;&#x7CFB;&#x7D71;</h1><p>&#x7528;&#x524D;&#x7AEF;&#x4ECB;&#x9762;&#x6574;&#x7406;&#x8AB2;&#x5802;&#x91CD;&#x9EDE;&#xFF0C;&#x4E26;&#x900F;&#x904E;&#x5F8C;&#x7AEF; API &#x5C07;&#x7B46;&#x8A18;&#x5BEB;&#x5165;&#x8CC7;&#x6599;&#x5EAB;&#x3002;&#x9019;&#x500B;&#x5C08;&#x984C;&#x5C55;&#x793A;&#x4E86;&#x5F9E;&#x756B;&#x9762;&#x8A2D;&#x8A08;&#x3001;&#x8CC7;&#x6599;&#x67E5;&#x8A62;&#x5230;&#x8CC7;&#x6599;&#x4FDD;&#x5B58;&#x7684;&#x5B8C;&#x6574;&#x6D41;&#x7A0B;&#x3002;</p></div><div className="status-box"><span>&#x8CC7;&#x6599;&#x5EAB;&#x72C0;&#x614B;</span><strong>{status}</strong></div></section>
      <section className="toolbar" aria-label="search and category"><label>&#x641C;&#x5C0B;<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="\u8f38\u5165\u95dc\u9375\u5b57" /></label><label>&#x5206;&#x985E;<select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label></section>
      <section className="notes-layout" id="notes"><div className="notes-list">{filteredNotes.map((note) => <article className="note-card" key={note.id}><div className="note-card-header"><div className="note-meta"><span>{note.course}</span><span>{note.category}</span><time dateTime={note.updatedAt}>{note.updatedAt}</time></div><div className="note-actions"><button className="edit-note" type="button" onClick={() => handleEdit(note)}>&#x7DE8;&#x8F2F;</button><button className="delete-note" type="button" onClick={() => handleDelete(note.id)}>&#x522A;&#x9664;</button></div></div><h2>{note.title}</h2><p className="summary">{note.summary}</p><p>{note.content}</p></article>)}</div>
        <form className="note-form" id="create" onSubmit={handleSubmit}><div className="form-title-row"><h2>{editingId ? '\u7de8\u8f2f\u8ab2\u7a0b\u7b46\u8a18' : '\u65b0\u589e\u8ab2\u7a0b\u7b46\u8a18'}</h2>{editingId && <button className="cancel-edit" type="button" onClick={resetForm}>&#x53D6;&#x6D88;</button>}</div><label>&#x6A19;&#x984C;<input name="title" value={form.title} onChange={handleChange} required /></label><label>&#x9031;&#x6B21;&#x6216;&#x8AB2;&#x7A0B;<input name="course" value={form.course} onChange={handleChange} required /></label><label>&#x5206;&#x985E;<select name="category" value={form.category} onChange={handleChange}><option>{text.base}</option><option>{text.interaction}</option><option>{text.backend}</option><option>{text.final}</option></select></label><label>&#x6458;&#x8981;<input name="summary" value={form.summary} onChange={handleChange} required /></label><label>&#x5167;&#x5BB9;<textarea name="content" value={form.content} onChange={handleChange} rows="6" required /></label><button type="submit">{editingId ? '\u66f4\u65b0\u7b46\u8a18' : '\u5132\u5b58\u7b46\u8a18'}</button></form></section>
    </main>
  )
}

export default App

import { useState } from 'react';
import axios from 'axios';

const ROLES = ['Frontend Developer','Backend Developer','Full Stack Developer','Data Scientist','Machine Learning Engineer','DevOps Engineer','UI/UX Designer','Product Manager','Cybersecurity Analyst','Mobile Developer'];
const LEVELS = ['Entry Level','Mid Level','Senior Level'];
const TYPES = ['Technical','Behavioral','System Design','All Types'];

export default function InterviewPrep() {
  const [form, setForm] = useState({ role: '', level: 'Entry Level', type: 'All Types', count: '5' });
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [error, setError] = useState('');

  const generate = async () => {
    if (!form.role) return setError('Please select a job role.');
    setLoading(true); setError(''); setQuestions(null);
    try {
      const { data } = await axios.post('/api/interview/generate', form);
      setQuestions(data.questions);
    } catch {
      setError('Failed to generate questions. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Interview Question Generator</h1>
      <p className="page-sub">Get AI-generated interview questions tailored to your target role.</p>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="grid-2" style={{ marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--muted)', fontSize: '0.88rem' }}>Job Role</label>
            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.95rem', outline: 'none' }}>
              <option value="">Select role...</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--muted)', fontSize: '0.88rem' }}>Experience Level</label>
            <select value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}
              style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.95rem', outline: 'none' }}>
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--muted)', fontSize: '0.88rem' }}>Question Type</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.95rem', outline: 'none' }}>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--muted)', fontSize: '0.88rem' }}>Number of Questions</label>
            <select value={form.count} onChange={e => setForm(f => ({ ...f, count: e.target.value }))}
              style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.95rem', outline: 'none' }}>
              {['5','10','15','20'].map(n => <option key={n} value={n}>{n} questions</option>)}
            </select>
          </div>
        </div>
        {error && <p style={{ color: 'var(--danger)', marginBottom: '0.75rem', fontSize: '0.9rem' }}>{error}</p>}
        <button className="btn-primary" onClick={generate} disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Generating...' : 'Generate Questions'}
        </button>
      </div>

      {loading && <div className="loading-ring" />}

      {questions && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {questions.map((q, i) => (
            <div key={i} className="card" style={{ cursor: 'pointer' }} onClick={() => setExpanded(expanded === i ? null : i)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '0.8rem', fontWeight: 600 }}>Q{i + 1}</span>
                    <span className={`badge ${q.type === 'Technical' ? 'badge-primary' : q.type === 'Behavioral' ? 'badge-success' : 'badge-warning'}`}>
                      {q.type}
                    </span>
                    <span className={`badge ${q.difficulty === 'Easy' ? 'badge-success' : q.difficulty === 'Hard' ? 'badge-danger' : 'badge-warning'}`}>
                      {q.difficulty}
                    </span>
                  </div>
                  <p style={{ fontWeight: 500, fontSize: '0.95rem' }}>{q.question}</p>
                </div>
                <span style={{ color: 'var(--muted)', fontSize: '1.1rem', marginLeft: '1rem' }}>{expanded === i ? '▲' : '▼'}</span>
              </div>
              {expanded === i && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--accent)', marginBottom: '0.4rem' }}>Suggested Answer</p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>{q.answer}</p>
                  {q.tips && (
                    <>
                      <p style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--warning)', marginTop: '0.75rem', marginBottom: '0.4rem' }}>Tips</p>
                      <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>{q.tips}</p>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

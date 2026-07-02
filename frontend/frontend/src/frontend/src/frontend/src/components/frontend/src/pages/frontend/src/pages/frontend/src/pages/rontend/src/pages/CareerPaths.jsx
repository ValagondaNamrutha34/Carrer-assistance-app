import { useState } from 'react';
import axios from 'axios';

const INTERESTS = ['Web Development', 'Data Science', 'AI/ML', 'Cybersecurity', 'Mobile Development', 'DevOps', 'UI/UX Design', 'Blockchain'];
const EDUCATION = ['High School', 'Bachelor\'s (CS/IT)', 'Bachelor\'s (Other)', 'Master\'s', 'PhD', 'Bootcamp'];

export default function CareerPaths() {
  const [form, setForm] = useState({ skills: '', interests: [], education: '', experience: '0' });
  const [loading, setLoading] = useState(false);
  const [paths, setPaths] = useState(null);
  const [error, setError] = useState('');

  const toggleInterest = (interest) =>
    setForm(f => ({
      ...f,
      interests: f.interests.includes(interest)
        ? f.interests.filter(i => i !== interest)
        : [...f.interests, interest],
    }));

  const submit = async () => {
    if (!form.skills) return setError('Please enter at least one skill.');
    setLoading(true); setError('');
    try {
      const { data } = await axios.post('/api/careers/recommend', form);
      setPaths(data.paths);
    } catch {
      setError('Failed to fetch recommendations. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Career Path Recommendations</h1>
      <p className="page-sub">Tell us about yourself and get AI-curated career paths.</p>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--muted)', fontSize: '0.88rem' }}>Your Skills (comma separated)</label>
          <input value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))}
            placeholder="e.g. Python, React, SQL, Machine Learning"
            style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.95rem', outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.6rem', color: 'var(--muted)', fontSize: '0.88rem' }}>Interests</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {INTERESTS.map(interest => (
              <button key={interest} onClick={() => toggleInterest(interest)}
                style={{
                  padding: '0.4rem 0.9rem', borderRadius: '20px', fontSize: '0.85rem', border: '1px solid',
                  borderColor: form.interests.includes(interest) ? 'var(--primary)' : 'var(--border)',
                  background: form.interests.includes(interest) ? 'rgba(99,102,241,0.15)' : 'transparent',
                  color: form.interests.includes(interest) ? 'var(--primary)' : 'var(--muted)',
                }}>
                {interest}
              </button>
            ))}
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--muted)', fontSize: '0.88rem' }}>Education</label>
            <select value={form.education} onChange={e => setForm(f => ({ ...f, education: e.target.value }))}
              style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.95rem', outline: 'none' }}>
              <option value="">Select...</option>
              {EDUCATION.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--muted)', fontSize: '0.88rem' }}>Years of Experience</label>
            <select value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}
              style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.95rem', outline: 'none' }}>
              {['0','1','2','3-5','5+'].map(v => <option key={v} value={v}>{v === '0' ? 'No experience' : `${v} years`}</option>)}
            </select>
          </div>
        </div>

        {error && <p style={{ color: 'var(--danger)', marginBottom: '0.75rem', fontSize: '0.9rem' }}>{error}</p>}
        <button className="btn-primary" onClick={submit} disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Getting Recommendations...' : 'Get Career Paths'}
        </button>
      </div>

      {loading && <div className="loading-ring" />}

      {paths && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {paths.map((path, i) => (
            <div key={i} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{path.title}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>{path.category}</p>
                </div>
                <span className={`badge ${path.match >= 80 ? 'badge-success' : path.match >= 60 ? 'badge-warning' : 'badge-primary'}`}>
                  {path.match}% match
                </span>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>{path.description}</p>
              <div style={{ marginBottom: '0.75rem' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Key Skills Required</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {path.requiredSkills?.map(s => <span key={s} className="badge badge-primary">{s}</span>)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
                <span>💰 {path.avgSalary}</span>
                <span>📈 {path.demand} demand</span>
                <span>⏱ {path.timeToLearn}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

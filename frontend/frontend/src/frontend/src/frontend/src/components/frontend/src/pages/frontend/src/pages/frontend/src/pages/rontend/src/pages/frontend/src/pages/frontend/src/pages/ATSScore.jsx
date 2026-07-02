import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

export default function ATSScore() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const onDrop = useCallback((accepted) => {
    if (accepted[0]) { setFile(accepted[0]); setResult(null); }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1 });

  const analyze = async () => {
    if (!file) return setError('Please upload a resume.');
    setLoading(true); setError('');
    try {
      const fd = new FormData();
      fd.append('resume', file);
      fd.append('jobDescription', jobDesc);
      const { data } = await axios.post('/api/ats/score', fd);
      setResult(data);
    } catch {
      setError('ATS analysis failed. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score) => score >= 75 ? 'var(--success)' : score >= 50 ? 'var(--warning)' : 'var(--danger)';

  return (
    <div className="page">
      <h1 className="page-title">ATS Resume Score</h1>
      <p className="page-sub">Check how well your resume passes Applicant Tracking Systems.</p>

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div {...getRootProps()} style={{
          border: `2px dashed ${isDragActive ? 'var(--primary)' : 'var(--border)'}`,
          borderRadius: '8px', padding: '2rem', textAlign: 'center', cursor: 'pointer',
          background: isDragActive ? 'rgba(99,102,241,0.05)' : 'transparent',
        }}>
          <input {...getInputProps()} />
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
          {file
            ? <p style={{ color: 'var(--success)', fontWeight: 600 }}>✓ {file.name}</p>
            : <p style={{ color: 'var(--muted)' }}>Upload your resume</p>
          }
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--muted)', fontSize: '0.88rem' }}>Job Description (optional — improves scoring accuracy)</label>
          <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} rows={5}
            placeholder="Paste the job description here..."
            style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
          />
        </div>

        {error && <p style={{ color: 'var(--danger)', marginTop: '0.5rem', fontSize: '0.9rem' }}>{error}</p>}
        <button className="btn-primary" onClick={analyze} disabled={loading} style={{ marginTop: '1rem', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Analyzing...' : 'Get ATS Score'}
        </button>
      </div>

      {loading && <div className="loading-ring" />}

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', fontWeight: 800, color: scoreColor(result.overallScore) }}>{result.overallScore}%</div>
            <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>ATS Compatibility Score</p>
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width: `${result.overallScore}%`, background: scoreColor(result.overallScore) }} />
            </div>
            <p style={{ marginTop: '0.75rem', fontWeight: 600, color: scoreColor(result.overallScore) }}>
              {result.overallScore >= 75 ? '✅ Great — likely to pass ATS filters' : result.overallScore >= 50 ? '⚠️ Moderate — needs improvement' : '❌ Low — likely to be filtered out'}
            </p>
          </div>

          <div className="grid-2">
            {result.categories?.map(({ name, score, feedback }) => (
              <div key={name} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{name}</p>
                  <span style={{ fontWeight: 700, color: scoreColor(score) }}>{score}%</span>
                </div>
                <div className="progress-bar-wrap" style={{ marginBottom: '0.6rem' }}>
                  <div className="progress-bar-fill" style={{ width: `${score}%`, background: scoreColor(score) }} />
                </div>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{feedback}</p>
              </div>
            ))}
          </div>

          <div className="grid-2">
            <div className="card">
              <p className="section-title" style={{ color: 'var(--success)' }}>Keywords Found ✅</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {result.keywordsFound?.map(k => <span key={k} className="badge badge-success">{k}</span>)}
              </div>
            </div>
            <div className="card">
              <p className="section-title" style={{ color: 'var(--danger)' }}>Keywords Missing ❌</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {result.keywordsMissing?.map(k => <span key={k} className="badge badge-danger">{k}</span>)}
              </div>
            </div>
          </div>

          <div className="card">
            <p className="section-title">Recommendations</p>
            <ul style={{ paddingLeft: '1.2rem', lineHeight: 2.2 }}>
              {result.recommendations?.map((r, i) => <li key={i} style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>{r}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

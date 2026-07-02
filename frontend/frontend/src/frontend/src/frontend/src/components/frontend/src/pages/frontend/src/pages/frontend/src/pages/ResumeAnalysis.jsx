import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

export default function ResumeAnalysis() {
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const onDrop = useCallback((accepted) => {
    if (accepted[0]) { setFile(accepted[0]); setResult(null); setError(''); }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'],
      'application/msword': ['.doc'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxFiles: 1,
  });

  const analyze = async () => {
    if (!file) return setError('Please upload a resume file.');
    setLoading(true); setError('');
    try {
      const fd = new FormData();
      fd.append('resume', file);
      fd.append('jobRole', jobRole);
      const { data } = await axios.post('/api/resume/analyze', fd);
      setResult(data);
    } catch {
      setError('Analysis failed. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Resume Analysis</h1>
      <p className="page-sub">Upload your resume and get AI-powered feedback instantly.</p>

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div {...getRootProps()} style={{
          border: `2px dashed ${isDragActive ? 'var(--primary)' : 'var(--border)'}`,
          borderRadius: '8px', padding: '2.5rem', textAlign: 'center', cursor: 'pointer',
          background: isDragActive ? 'rgba(99,102,241,0.05)' : 'transparent', transition: 'all 0.2s',
        }}>
          <input {...getInputProps()} />
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📎</div>
          {file
            ? <p style={{ color: 'var(--success)', fontWeight: 600 }}>✓ {file.name}</p>
            : <p style={{ color: 'var(--muted)' }}>Drag & drop your resume, or <span style={{ color: 'var(--primary)' }}>click to browse</span></p>
          }
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Supports PDF, DOC, DOCX, TXT</p>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--muted)', fontSize: '0.88rem' }}>
            Target Job Role (optional)
          </label>
          <input value={jobRole} onChange={e => setJobRole(e.target.value)}
            placeholder="e.g. Frontend Developer, Data Scientist..."
            style={{
              width: '100%', padding: '0.7rem 1rem', borderRadius: '8px',
              background: 'var(--bg)', border: '1px solid var(--border)',
              color: 'var(--text)', fontSize: '0.95rem', outline: 'none',
            }}
          />
        </div>

        {error && <p style={{ color: 'var(--danger)', marginTop: '0.75rem', fontSize: '0.9rem' }}>{error}</p>}

        <button className="btn-primary" onClick={analyze} disabled={loading}
          style={{ marginTop: '1.25rem', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </div>

      {loading && <div className="loading-ring" />}

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card">
            <p className="section-title">Overall Score</p>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)' }}>{result.score}%</div>
            <div className="progress-bar-wrap" style={{ marginTop: '0.75rem' }}>
              <div className="progress-bar-fill" style={{ width: `${result.score}%`, background: 'var(--primary)' }} />
            </div>
          </div>

          <div className="grid-2">
            <div className="card">
              <p className="section-title">Strengths ✅</p>
              <ul style={{ paddingLeft: '1.2rem', lineHeight: 2 }}>
                {result.strengths?.map((s, i) => <li key={i} style={{ fontSize: '0.9rem' }}>{s}</li>)}
              </ul>
            </div>
            <div className="card">
              <p className="section-title">Improvements 🔧</p>
              <ul style={{ paddingLeft: '1.2rem', lineHeight: 2 }}>
                {result.improvements?.map((s, i) => <li key={i} style={{ fontSize: '0.9rem' }}>{s}</li>)}
              </ul>
            </div>
          </div>

          <div className="card">
            <p className="section-title">Detected Skills</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {result.skills?.map(s => <span key={s} className="badge badge-primary">{s}</span>)}
            </div>
          </div>

          {result.missingSkills?.length > 0 && (
            <div className="card">
              <p className="section-title">Missing Skills for "{jobRole || 'target role'}"</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {result.missingSkills.map(s => <span key={s} className="badge badge-warning">{s}</span>)}
              </div>
            </div>
          )}

          <div className="card">
            <p className="section-title">AI Summary</p>
            <p style={{ color: 'var(--muted)', lineHeight: 1.7, fontSize: '0.93rem' }}>{result.summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}

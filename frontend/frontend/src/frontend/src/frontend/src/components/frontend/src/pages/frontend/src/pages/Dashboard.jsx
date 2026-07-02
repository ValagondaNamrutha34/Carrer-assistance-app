import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Replace with real API call: axios.get('/api/dashboard')
    setStats({
      resumeScore: 74,
      atsScore: 68,
      skillsFound: 12,
      skillsMissing: 5,
      interviewsGenerated: 3,
      topSkills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
      missingSkills: ['TypeScript', 'Docker', 'AWS', 'GraphQL', 'Testing'],
      recentActivity: [
        { action: 'Resume Analyzed', time: '2 hours ago' },
        { action: 'ATS Score Generated', time: '2 hours ago' },
        { action: 'Interview Questions (Frontend)', time: '1 day ago' },
      ],
    });
  }, []);

  if (!stats) return <div className="loading-ring" />;

  return (
    <div className="page">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-sub">Your career readiness overview</p>

      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Resume Score', value: `${stats.resumeScore}%`, color: 'var(--primary)' },
          { label: 'ATS Score',    value: `${stats.atsScore}%`,    color: 'var(--accent)' },
          { label: 'Skills Found', value: stats.skillsFound,       color: 'var(--success)' },
          { label: 'Missing Skills', value: stats.skillsMissing,   color: 'var(--warning)' },
          { label: 'Interviews Practiced', value: stats.interviewsGenerated, color: 'var(--primary)' },
          { label: 'Completion', value: '60%', color: 'var(--accent)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color }}>{value}</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.3rem' }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <p className="section-title">Your Skills</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {stats.topSkills.map(s => <span key={s} className="badge badge-primary">{s}</span>)}
          </div>
          <p className="section-title" style={{ marginTop: '1.25rem' }}>Missing Skills</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {stats.missingSkills.map(s => <span key={s} className="badge badge-warning">{s}</span>)}
          </div>
        </div>

        <div className="card">
          <p className="section-title">Recent Activity</p>
          {stats.recentActivity.map(({ action, time }, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: i < stats.recentActivity.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontSize: '0.9rem' }}>{action}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

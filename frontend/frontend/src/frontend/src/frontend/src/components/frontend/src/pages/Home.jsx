import { Link } from 'react-router-dom';

const features = [
  { icon: '📄', title: 'Resume Analysis',      desc: 'Get instant AI feedback on your resume structure, keywords, and content.',   to: '/resume' },
  { icon: '🎯', title: 'Skill Gap Detection',  desc: 'Find exactly which skills you\'re missing for your target roles.',           to: '/resume' },
  { icon: '🚀', title: 'Career Paths',          desc: 'Explore career paths tailored to your background and goals.',               to: '/careers' },
  { icon: '🎤', title: 'Interview Prep',        desc: 'Practice with AI-generated role-specific interview questions.',             to: '/interview' },
  { icon: '📊', title: 'ATS Score',             desc: 'Check if your resume passes Applicant Tracking System filters.',           to: '/ats' },
];

export default function Home() {
  return (
    <main className="page" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <h1 style={{ fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.1rem' }}>
        AI-Powered <span style={{ color: 'var(--primary)' }}>Career Assistant</span>
        <br />for Students
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto 2.5rem' }}>
        Build better resumes, find skill gaps, prepare for interviews, and land your dream job — powered by AI.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
        <Link to="/resume"><button className="btn-primary" style={{ fontSize: '1rem' }}>Analyze My Resume</button></Link>
        <Link to="/dashboard"><button className="btn-outline" style={{ fontSize: '1rem' }}>Go to Dashboard</button></Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.25rem', textAlign: 'left' }}>
        {features.map(({ icon, title, desc, to }) => (
          <Link key={title} to={to}>
            <div className="card" style={{ cursor: 'pointer', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '0.65rem' }}>{icon}</div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.4rem' }}>{title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

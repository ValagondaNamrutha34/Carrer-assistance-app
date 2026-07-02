import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/',          label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/resume',    label: 'Resume' },
  { to: '/careers',   label: 'Career Paths' },
  { to: '/interview', label: 'Interview Prep' },
  { to: '/ats',       label: 'ATS Score' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <nav style={{
      background: 'var(--bg-card)', borderBottom: '1px solid var(--border)',
      padding: '0 1.5rem', display: 'flex', alignItems: 'center',
      gap: '0.25rem', height: '58px', position: 'sticky', top: 0, zIndex: 100,
    }}>
      <Link to="/" style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)', marginRight: '1rem' }}>
        CareerAI
      </Link>
      {links.map(({ to, label }) => (
        <Link key={to} to={to} style={{
          padding: '0.4rem 0.85rem', borderRadius: '6px', fontSize: '0.87rem',
          fontWeight: pathname === to ? 600 : 400,
          color: pathname === to ? 'var(--text)' : 'var(--muted)',
          background: pathname === to ? 'rgba(99,102,241,0.15)' : 'transparent',
        }}>
          {label}
        </Link>
      ))}
    </nav>
  );
}

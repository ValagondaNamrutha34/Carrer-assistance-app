import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</div>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>Page Not Found</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>The page you're looking for doesn't exist.</p>
      <Link to="/"><button className="btn-primary">Go Home</button></Link>
    </div>
  );
}

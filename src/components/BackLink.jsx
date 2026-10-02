import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '../lib/cn';

// "Back" returns to the page the visitor actually came from. Only when they landed here
// directly (a shared link, a new tab) is there nothing to go back to, so it links to the
// section this page belongs to instead.
export function BackLink({ to, label, className }) {
  const location = useLocation();
  const navigate = useNavigate();
  const styles = cn('inline-flex items-center gap-1.5 no-underline', className);
  if (location.key !== 'default') {
    return (
      <button type="button" onClick={() => navigate(-1)} className={styles}>
        <ArrowLeft size={14} /> Back
      </button>
    );
  }
  return (
    <Link to={to} className={styles}>
      <ArrowLeft size={14} /> {label}
    </Link>
  );
}

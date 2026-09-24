import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';

export function NextStep({ text, to, label, variant = 'primary', external = false }) {
  const linkProps = external ? { as: 'a', href: to, target: '_blank', rel: 'noopener' } : { as: Link, to };
  return (
    <div className="surface-card mt-6 flex flex-wrap items-center justify-between gap-4 p-5">
      <p className="text-[15px] text-ac-dark">{text}</p>
      <Button variant={variant} {...linkProps}>
        {label} <ArrowRight size={15} />
      </Button>
    </div>
  );
}

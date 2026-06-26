import type { WorkoutIconType } from '@/types';

interface Props {
  icon: WorkoutIconType;
  className?: string;
}

export function WorkoutIcon({ icon, className = 'w-10 h-10' }: Props) {
  const cls = `${className} text-white/90`;

  switch (icon) {
    case 'dumbbell':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 4v16M18 4v16M6 8H2v8h4M18 8h4v8h-4M6 9h12M6 15h12" />
        </svg>
      );
    case 'barbell':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <line x1="2" y1="12" x2="22" y2="12" />
          <rect x="2" y="9" width="3" height="6" rx="1" fill="currentColor" stroke="none" opacity="0.8" />
          <rect x="5" y="8" width="2" height="8" rx="1" fill="currentColor" stroke="none" />
          <rect x="17" y="8" width="2" height="8" rx="1" fill="currentColor" stroke="none" />
          <rect x="19" y="9" width="3" height="6" rx="1" fill="currentColor" stroke="none" opacity="0.8" />
        </svg>
      );
    case 'legs':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 3v8l-3 10h2l2-5 2 5h2L12 11V3h-2z" />
          <circle cx="11" cy="2" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'core':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <circle cx="12" cy="12" r="7" />
          <line x1="12" y1="2" x2="12" y2="5" />
          <line x1="12" y1="19" x2="12" y2="22" />
          <line x1="2" y1="12" x2="5" y2="12" />
          <line x1="19" y1="12" x2="22" y2="12" />
        </svg>
      );
    case 'lightning':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H13L13 2z" opacity="0.9" />
        </svg>
      );
    case 'flower':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="2" />
          <path d="M12 2a3 3 0 0 1 3 3c0 1.5-1 2.5-1 3.5a2 2 0 0 1-4 0C10 7.5 9 6.5 9 5a3 3 0 0 1 3-3z" />
          <path d="M12 22a3 3 0 0 1-3-3c0-1.5 1-2.5 1-3.5a2 2 0 0 1 4 0c0 1 1 2 1 3.5a3 3 0 0 1-3 3z" />
          <path d="M2 12a3 3 0 0 1 3-3c1.5 0 2.5 1 3.5 1a2 2 0 0 1 0 4C7.5 14 6.5 15 5 15a3 3 0 0 1-3-3z" />
          <path d="M22 12a3 3 0 0 1-3 3c-1.5 0-2.5-1-3.5-1a2 2 0 0 1 0-4c1 0 2-1 3.5-1a3 3 0 0 1 3 3z" />
        </svg>
      );
    case 'pull':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6h16" />
          <path d="M8 6v4a4 4 0 0 0 8 0V6" />
          <path d="M12 10v8" />
          <path d="M9 18h6" />
        </svg>
      );
    case 'heart':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M12 21.593c-.525-.347-7.474-5.047-9.347-7.98C1.118 11.607 1 10.367 1 10c0-3.309 2.691-6 6-6 1.78 0 3.37.783 4.5 2.031C12.63 4.783 14.22 4 16 4c3.309 0 6 2.691 6 6 0 .367-.118 1.607-1.653 3.613-1.873 2.933-8.822 7.633-9.347 7.98z" opacity="0.9" />
        </svg>
      );
  }
}

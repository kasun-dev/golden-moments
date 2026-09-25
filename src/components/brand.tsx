import { Link } from "@tanstack/react-router";

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-3 ${light ? "text-inverse" : "text-foreground"}`}>
      <span className="grid size-9 place-items-center border border-current/30 font-display text-lg italic">M</span>
      <span className="leading-none">
        <span className="block font-display text-xl">Moments</span>
        <span className="mt-1 block text-[9px] uppercase tracking-[0.22em] opacity-60">by Studio Click.ed</span>
      </span>
    </Link>
  );
}

export function Mandala({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className={className} fill="none" stroke="currentColor">
      <circle cx="100" cy="100" r="18" />
      <circle cx="100" cy="100" r="42" strokeDasharray="2 5" />
      <circle cx="100" cy="100" r="75" />
      {Array.from({ length: 12 }).map((_, index) => (
        <g key={index} transform={`rotate(${index * 30} 100 100)`}>
          <path d="M100 25 C116 45 116 58 100 76 C84 58 84 45 100 25Z" />
          <path d="M100 4 C108 14 109 21 100 29 C91 21 92 14 100 4Z" />
        </g>
      ))}
    </svg>
  );
}
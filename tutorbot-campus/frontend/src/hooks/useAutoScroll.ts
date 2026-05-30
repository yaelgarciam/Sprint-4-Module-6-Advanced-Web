import { useEffect, useRef } from 'react';

export function useAutoScroll(deps: unknown[]) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    });

    // Observe all children for size changes (new tokens)
    for (const child of Array.from(el.children)) {
      observer.observe(child);
    }

    // Also scroll immediately
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });

    return () => observer.disconnect();
  }, deps);

  return ref;
}

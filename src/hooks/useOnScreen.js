import { useState, useEffect, useMemo } from 'react';

export default function useOnScreen(ref) {
  const [isIntersecting, setIntersecting] = useState(false);

  const observer = useMemo(() => new IntersectionObserver(
    ([entry]) => setIntersecting(entry.isIntersecting)
  ), []);

  useEffect(() => {
    observer.observe(ref.current);
    // Hapus observer saat komponen tidak lagi digunakan
    return () => observer.disconnect();
  }, [observer, ref]);

  return isIntersecting;
}
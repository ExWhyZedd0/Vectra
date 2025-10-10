import { useState, useEffect, useMemo } from 'react';

export default function useOnScreen(ref, rootRef = null) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    // Pastikan ref sudah ada sebelum membuat observer
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Hanya update jika statusnya berubah
        if (entry.isIntersecting !== isIntersecting) {
          setIntersecting(entry.isIntersecting);
        }
      },
      {
        // Gunakan container scroll sebagai root, atau viewport jika tidak ada
        root: rootRef && rootRef.current ? rootRef.current : null,
        rootMargin: '0px',
        // Picu saat 10% elemen terlihat
        threshold: 0.1 
      }
    );

    const currentRef = ref.current;
    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, [ref, rootRef, isIntersecting]); // Tambahkan isIntersecting ke dependency

  return isIntersecting;
}
import { useEffect, useState } from '../lib/teact/teact';

export function useIsOverflowing(ref: React.RefObject<HTMLElement>) {
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const checkOverflow = () => {
      setIsOverflowing(el.scrollWidth > el.clientWidth);
    };

    checkOverflow();

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(el);

    // eslint-disable-next-line consistent-return
    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isOverflowing;
}

import { useEffect, useState } from "react";

/**
 * Renders `text` with a simple typewriter animation — reveals the string
 * a few characters at a time. Used for the "new" assistant message so it
 * feels like it's being typed out live.
 *
 * Props:
 *  - text: string to reveal
 *  - speed: ms between reveal ticks (default 15)
 *  - charsPerTick: characters revealed per tick (default 2)
 */
export default function TypewriterText({ text = "", speed = 15, charsPerTick = 2 }) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
    if (!text) return;

    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        const next = prev + charsPerTick;
        if (next >= text.length) {
          clearInterval(interval);
          return text.length;
        }
        return next;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, charsPerTick]);

  return <>{text.slice(0, visibleCount)}</>;
}
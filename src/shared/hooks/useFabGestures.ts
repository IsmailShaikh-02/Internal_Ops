// src/shared/hooks/useFabGestures.ts
import { useRef, type PointerEventHandler } from "react";

interface UseFabGesturesOptions {
  onClick: () => void;
  onSwipeUp: () => void;
}

export function useFabGestures({ onClick, onSwipeUp }: UseFabGesturesOptions) {
  const startRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const onPointerDown: PointerEventHandler = (e) => {
    startRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerUp: PointerEventHandler = (e) => {
    if (!startRef.current) return;
    e.currentTarget.releasePointerCapture(e.pointerId);

    const deltaX = e.clientX - startRef.current.x;
    const deltaY = e.clientY - startRef.current.y;
    const duration = Date.now() - startRef.current.time;

    startRef.current = null;

    // Upward swipe action (deltaY < -30px)
    if (deltaY < -30) {
      if (typeof navigator.vibrate === "function") {
        try {
          navigator.vibrate(8);
        } catch {
          // Suppress vibration exceptions in environments that block it
        }
      }
      onSwipeUp();
      return;
    }

    // Single Click/Tap Action: press time < 200ms and movement < 10px
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (duration < 200 && distance < 10) {
      onClick();
    }
  };

  const onPointerCancel: PointerEventHandler = (e) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    startRef.current = null;
  };

  return {
    onPointerDown,
    onPointerUp,
    onPointerCancel,
  };
}

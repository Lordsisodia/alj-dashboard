import { useEffect, useState } from "react";

/**
 * Shared hook to decide whether to render animated backgrounds
 * respecting prefers-reduced-motion and deferring work off the main path.
 */
export function useNotificationsBackground() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const idle =
      "requestIdleCallback" in window
        ? (window as any).requestIdleCallback
        : (cb: FrameRequestCallback) => window.setTimeout(cb, 250);
    const supportsIdleCallback = "cancelIdleCallback" in window;
    const handle = idle(() => setReady(media.matches));
    return () => {
      if (supportsIdleCallback) {
        (window as any).cancelIdleCallback?.(handle);
      } else {
        window.clearTimeout(handle as number);
      }
    };
  }, []);

  return ready;
}

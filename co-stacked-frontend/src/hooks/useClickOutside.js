// src/hooks/useClickOutside.js
import { useEffect } from 'react';

/**
 * A custom hook that detects clicks outside of a specified element.
 * @param {React.RefObject} ref - A ref to the element to monitor.
 * @param {function} handler - The function to call when a click outside occurs.
 */
export const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    // Cleanup function to remove event listeners
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]); // Re-run effect only if ref or handler changes
};
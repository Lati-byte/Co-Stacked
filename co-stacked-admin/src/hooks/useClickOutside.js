// src/hooks/useClickOutside.js

import { useEffect } from 'react';

/**
 * A custom React hook that triggers a callback when a click occurs outside of the referenced element.
 * @param {React.RefObject} ref - The ref object attached to the element to monitor.
 * @param {Function} handler - The callback function to execute on an outside click.
 */
export const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if the click is inside the ref's element or its descendants
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      // Otherwise, call the handler
      handler(event);
    };

    // Add event listeners for both mouse and touch events
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    // Cleanup function to remove the event listeners when the component unmounts
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]); // Re-run the effect if the ref or handler function changes
};
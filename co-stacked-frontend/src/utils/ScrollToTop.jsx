// src/utils/ScrollToTop.jsx

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * This is a "utility component" that has no visible UI. Its only job
 * is to scroll the window to the top whenever the route changes.
 */
const ScrollToTop = () => { // <-- THE FIX: Changed 'of>' to '=>'
  // `pathname` will be the current URL path (e.g., '/', '/projects', '/about')
  const { pathname } = useLocation();

  // This effect will run every single time the `pathname` changes.
  useEffect(() => {
    // This command scrolls the window to the very top (coordinates 0, 0)
    window.scrollTo(0, 0);
  }, [pathname]); // The dependency array ensures the effect runs only on navigation

  // This component doesn't render any HTML.
  return null;
};

export default ScrollToTop;
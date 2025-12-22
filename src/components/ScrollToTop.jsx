import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop - Scrolls to top of page on route change and initial load
 * Also disables browser scroll restoration to prevent unwanted scroll on refresh
 */
export default function ScrollToTop() {
    const { pathname } = useLocation();

    // Disable browser scroll restoration
    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
    }, []);

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

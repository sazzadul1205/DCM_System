// React
import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

// Inertia

// Icons
import { FaArrowLeft, FaMoon, FaSun } from 'react-icons/fa';

export default function GuestLayout({ children }) {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window === 'undefined') {
            return false;
        }

        const savedTheme = window.localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        return savedTheme === 'dark' || (!savedTheme && prefersDark);
    });

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
        window.localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const toggleDarkMode = () => {
        setIsDark((current) => !current);
    };

    const handleBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            router.visit('/');
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 dark:bg-gray-900 sm:justify-center sm:pt-0">
            {/* Back Button - Top Left */}
            <button
                onClick={handleBack}
                className="fixed left-4 top-4 flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-gray-700 shadow-md transition-all hover:bg-gray-50 hover:shadow-lg dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                aria-label="Go back"
            >
                <FaArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
            </button>

            {/* Dark Mode Toggle - Top Right */}
            <button
                onClick={toggleDarkMode}
                className="fixed right-4 top-4 rounded-lg bg-white p-3 text-gray-700 shadow-md transition-all hover:bg-gray-50 hover:shadow-lg dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                aria-label="Toggle dark mode"
            >
                {isDark ? (
                    <FaSun className="h-5 w-5" />
                ) : (
                    <FaMoon className="h-5 w-5" />
                )}
            </button>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md transition-colors dark:bg-gray-800 sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}

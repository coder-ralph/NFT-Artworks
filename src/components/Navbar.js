import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDarkTheme(savedTheme === 'dark');
            document.body.classList.toggle('dark', savedTheme === 'dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDarkTheme ? 'dark' : 'light';
        setIsDarkTheme(!isDarkTheme);
        document.body.classList.toggle('dark', newTheme === 'dark');
        localStorage.setItem('theme', newTheme);
    };

    return (
        <nav className={`p-4 ${isDarkTheme ? 'bg-gray-800' : 'bg-blue-500'}`}>
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-white text-2xl sm:text-xl md:text-2xl">NFT Artworks</h1>
                <div className="flex items-center space-x-4">
                    {/* Star the Repo Button */}
                    <a
                        href="https://github.com/coder-ralph/NFT-Artworks"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-sm text-white hover:text-yellow-300 transition-colors duration-300 sm:text-xs"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-star"
                        >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        <span className="text-sm sm:text-xs">Star the repo</span>
                    </a>
                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className="text-white focus:outline-none"
                        aria-label={isDarkTheme ? "Switch to light theme" : "Switch to dark theme"}
                    >
                        {isDarkTheme ? (
                            <SunIcon className="h-6 w-6" />
                        ) : (
                            <MoonIcon className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

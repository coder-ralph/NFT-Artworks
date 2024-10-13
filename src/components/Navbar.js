import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { FaGithub } from "react-icons/fa";

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
                <h1 className="text-white text-2xl">NFT Artworks</h1>
                <div className="flex items-center space-x-4">
                    {/* Star the Repo Button */}
                    <a
                        href="https://github.com/coder-ralph/NFT-Artworks"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-white hover:text-yellow-300 transition-colors duration-300"
                    >
                        <FaGithub className="h-5 w-5" />
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

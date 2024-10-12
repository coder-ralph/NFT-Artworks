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
                <h1 className="text-white text-2xl">NFT Artworks</h1>
                <button onClick={toggleTheme} className="text-white focus:outline-none">
                    {isDarkTheme ? (
                        <SunIcon className="h-6 w-6" />
                    ) : (
                        <MoonIcon className="h-6 w-6" />
                    )}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;

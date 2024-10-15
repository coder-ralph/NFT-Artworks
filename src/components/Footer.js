import React from 'react';

const Footer = () => {
    return (
        <footer className="p-16 bg-[#1f2937] text-white w-full">
            <div className="container mx-auto text-center">
                <p>&copy; 2024 NFT Artworks. All Rights Reserved.</p>
                {/* Star the repo button */}
                <div className="flex justify-center mt-2">
                    <a
                        href="https://github.com/coder-ralph/NFT-Artworks"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-sm text-white hover:text-yellow-300 transition-colors duration-300"
                    >
                        <span>Give it a star</span>
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
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

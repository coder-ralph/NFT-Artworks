import React from 'react';
import Navbar from './components/Navbar';
import FileUpload from './components/FileUpload';

const HomePage = () => {
    return (
        <div>
            <Navbar />
            <div className="container mx-auto p-4 flex flex-col items-center">
                <header className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">Welcome to NFT Artworks</h2>
                    <p className="text-base sm:text-lg mb-8">Upload and showcase your unique NFT Artworks</p>
                </header>

                <section>
                    <FileUpload />
                </section>
            </div>
        </div>
    );
};

export default HomePage;

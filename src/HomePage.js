import React from 'react';
import Navbar from './components/Navbar';
import Gallery from './components/Gallery';
import Footer from './components/Footer';

const HomePage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="container mx-auto mt-8 p-4 flex-grow">
                <header className="text-center">
                    <h2 className="text-2xl sm:text-4xl font-bold mb-4 whitespace-nowrap">Welcome to NFT Artworks</h2>
                    <p className="text-sm sm:text-lg mb-8">Upload and showcase your unique NFT Artworks</p>
                </header>

                <section className="mb-8 min-h-[500px]">
                    <Gallery />
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;

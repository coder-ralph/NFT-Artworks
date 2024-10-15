import React from 'react';
import HomePage from './HomePage';
import './index.css';
import { Analytics } from '@vercel/analytics/react';

function App() {
    return (
        <>
            <HomePage />
            <Analytics />
        </>
    );
}

export default App;

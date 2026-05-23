import Link from 'next/link';
import React from 'react';

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
            <p className="text-lg text-gray-500">The page you are looking for does not exist.</p>
            <Link href="/" className="text-red-700">Go to Home</Link>
        </div>
    );
}

export default NotFoundPage;
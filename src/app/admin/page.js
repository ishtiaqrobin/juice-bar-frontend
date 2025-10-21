import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const AdminPage = () => {
    return (
        <div className="mx-auto max-w-6xl text-center my-12">
            <p className="text-4xl font-extrabold leading-tight tracking-tight text-stone-900">Admin Page</p>
            <p className="mt-5">Go to
                <Link
                    href="/admin/users"
                    className="ml-3"
                >
                    <Button className="hover:cursor-pointer">Users</Button>
                </Link>
            </p>
        </div>
    );
};

export default AdminPage;
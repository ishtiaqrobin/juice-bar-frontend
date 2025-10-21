import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/button';

const Users = () => {
    return (
        <div className="mx-auto max-w-6xl text-center my-12">
            <p className="text-4xl font-extrabold leading-tight tracking-tight text-stone-900">Users Page</p>
            <p className="mt-5">Go to
                <Link
                    href="/admin"
                    className="ml-3"
                >
                    <Button className="hover:cursor-pointer">Admin</Button>
                </Link>
            </p>
        </div>
    );
};

export default Users;
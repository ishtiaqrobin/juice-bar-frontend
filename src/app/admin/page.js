import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const AdminPage = () => {
    return (
        <div className="mx-auto max-w-6xl text-center my-12">
            <p className="text-4xl font-extrabold leading-tight tracking-tight text-stone-900">Admin Page</p>
            <div className="flex justify-center gap-3 mt-5">
                <Link
                    href="/admin/products"
                    className="ml-3"
                >
                    <Button className="hover:cursor-pointer">Products</Button>
                </Link>
                <Link
                    href="/admin/products/new"
                    className="ml-3"
                >
                    <Button className="hover:cursor-pointer">Add New Product</Button>
                </Link>
            </div>

        </div>
    );
};

export default AdminPage;
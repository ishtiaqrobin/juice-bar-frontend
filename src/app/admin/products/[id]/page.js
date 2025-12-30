"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

export default function EditProductPage({ params }) {
    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [productId, setProductId] = useState(null);

    useEffect(() => {
        const unwrapParams = async () => {
            const unwrapped = await params;
            setProductId(unwrapped.id);
        };
        unwrapParams();
    }, [params]);

    useEffect(() => {
        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await api.products.getById(productId);
            setProduct(response.data.data);
        } catch (error) {
            console.error("Error fetching product:", error);
            toast.error("Product not found");
            router.push("/admin/products");
        } finally {
            setLoading(false);
        }
    };

    // if (loading) {
    //     return (
    //         <div className="container mx-auto px-4 py-8">
    //             <div className="text-center">Loading...</div>
    //         </div>
    //     );
    // }

    // if (!product) {
    //     return (
    //         <div className="container mx-auto px-4 py-8">
    //             <div className="text-center">Product not found</div>
    //         </div>
    //     );
    // }

    return (
        <div className="container mx-auto px- py-">
            <ProductForm product={product} />
        </div>
    );
}

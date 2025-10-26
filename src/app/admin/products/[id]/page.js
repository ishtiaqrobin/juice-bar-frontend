import { notFound } from 'next/navigation'
import ProductForm from '@/components/admin/ProductForm'
import { prisma } from '@/lib/prisma'

async function getProduct(id) {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true
            }
        })

        if (!product) return null

        // Convert Decimal objects to plain numbers
        return {
            ...product,
            price: product.price ? parseFloat(product.price.toString()) : 0,
            discountPrice: product.discountPrice ? parseFloat(product.discountPrice.toString()) : null,
            discountPercentage: product.discountPercentage ? parseFloat(product.discountPercentage.toString()) : null
        }
    } catch (error) {
        return null
    }
}

export default async function EditProductPage({ params }) {
    const { id } = await params
    const product = await getProduct(id)

    if (!product) {
        notFound()
    }

    return (
        <div className="container mx-auto px- py-">
            <ProductForm product={product} />
        </div>
    )
}

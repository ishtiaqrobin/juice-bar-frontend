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
        return product
    } catch (error) {
        return null
    }
}

export default async function EditProductPage({ params }) {
    const product = await getProduct(params.id)

    if (!product) {
        notFound()
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <ProductForm product={product} />
        </div>
    )
}

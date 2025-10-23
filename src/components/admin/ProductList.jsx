'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useProducts } from '@/hooks/useProducts'
import { Switch } from '@/components/ui/switch'

export default function ProductList() {
    const router = useRouter()
    const { products, isLoading, mutate } = useProducts()
    const [updating, setUpdating] = useState(null)

    const handleToggleStatus = async (productId, currentStatus) => {
        setUpdating(productId)
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    isActive: !currentStatus
                }),
            })

            if (response.ok) {
                mutate() // Refresh the data
            } else {
                alert('Failed to update product status')
            }
        } catch (error) {
            alert('Failed to update product status')
        } finally {
            setUpdating(null)
        }
    }

    const handleDelete = async (productId) => {
        if (!confirm('Are you sure you want to delete this product?')) return

        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                mutate() // Refresh the data
            } else {
                alert('Failed to delete product')
            }
        } catch (error) {
            alert('Failed to delete product')
        }
    }

    if (isLoading) {
        return <div className="text-center py-8">Loading products...</div>
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Products</h2>
                <Button onClick={() => router.push('/admin/products/new')}>
                    Add New Product
                </Button>
            </div>

            <div className="grid gap-4">
                {products.map((product) => (
                    <Card key={product.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        {product.name}
                                        {product.isFeatured && (
                                            <Badge variant="secondary">Featured</Badge>
                                        )}
                                        <Badge variant={product.isActive ? "default" : "destructive"}>
                                            {product.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </CardTitle>
                                    <p className="text-sm text-gray-600">{product.category?.name}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold">${product.price}</span>
                                    <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            checked={product.isActive}
                                            onCheckedChange={() => handleToggleStatus(product.id, product.isActive)}
                                            disabled={updating === product.id}
                                        />
                                        <span className="text-sm">Active</span>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.push(`/admin/products/${product.id}`)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

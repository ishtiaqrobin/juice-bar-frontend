'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useProducts } from '@/hooks/useProducts'
import { Switch } from '@/components/ui/switch'
import { SpinnerCustom } from '@/components/ui/spinner'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import Image from 'next/image'
import { toast } from 'sonner'

export default function ProductList() {
    const router = useRouter()
    const { products, isLoading, mutate } = useProducts()
    const [updating, setUpdating] = useState(null)
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, productId: null, productName: '' })

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
                toast.success('Product status updated successfully!')
                mutate() // Refresh the data
            } else {
                toast.error('Failed to update product status')
            }
        } catch (error) {
            toast.error('Failed to update product status')
        } finally {
            setUpdating(null)
        }
    }

    const handleDeleteClick = (productId, productName) => {
        setDeleteDialog({ isOpen: true, productId, productName })
    }

    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(`/api/products/${deleteDialog.productId}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                toast.success('Product deleted successfully!')
                mutate() // Refresh the data
                setDeleteDialog({ isOpen: false, productId: null, productName: '' })
            } else {
                toast.error('Failed to delete product')
            }
        } catch (error) {
            toast.error('Failed to delete product')
        }
    }

    const handleDeleteCancel = () => {
        setDeleteDialog({ isOpen: false, productId: null, productName: '' })
    }

    if (isLoading) {
        return <div className="flex justify-center py-20">
            <SpinnerCustom />
        </div>
    }

    return (
        <div className="mx-auto space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Products</h2>
                {/* <Button onClick={() => router.push('/admin/products/new')}>
                    Add New Product
                </Button> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((product) => (
                    <Card key={product.id} className="bg-gray-100 border p- flex flex-col hover:shadow-lg transition">
                        <CardHeader>
                            <div className="flex flex-col justify-between items-start">
                                <Image
                                    src={product.image || '/placeholder-image.jpg'}
                                    alt={product.name}
                                    width={150}
                                    height={150}
                                    className="w-full h-40 object-cover rounded"></Image>
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <p className='text-base font-semibold'>Name: {product.name}</p>
                                        {product.featured && (
                                            <Badge variant="secondary">{product.featured}</Badge>
                                        )}
                                        <Badge variant={product.isActive ? "default" : "destructive"}>
                                            {product.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </CardTitle>
                                    <p className="text-sm text-gray-600">{product.category?.name}</p>
                                    <p className="text-xs text-gray-500">Added: {new Date(product.addedDate).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            {product.discountPrice ? (
                                                <>
                                                    <span className="text-lg font-bold text-red-600">${product.discountPrice}</span>
                                                    <span className="text-sm text-gray-500 line-through">${product.price}</span>
                                                    {product.discountPercentage && (
                                                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                                            -{product.discountPercentage}%
                                                        </span>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-lg font-bold">${product.price}</span>
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-500">Stock: {product.stock} {product.unitType}</span>
                                        {product.discountPercentage && !product.discountPrice && (
                                            <span className="text-xs text-blue-600">
                                                Discount: {product.discountPercentage}% (${((parseFloat(product.price) * (100 - parseFloat(product.discountPercentage))) / 100).toFixed(2)})
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center px-6 justify-between">
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
                                        className="hover:cursor-pointer"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.push(`/admin/products/${product.id}`)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        className="hover:cursor-pointer"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDeleteClick(product.id, product.name)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Delete Confirmation AlertDialog */}
            <AlertDialog open={deleteDialog.isOpen} onOpenChange={handleDeleteCancel}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. Are you sure you want to delete <span className="text-primary">"{deleteDialog.productName}"</span>?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleDeleteCancel} className="hover:cursor-pointer font-medium">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-primary text-white hover:cursor-pointer hover:bg-primary/90 font-medium"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

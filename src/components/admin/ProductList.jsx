'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useInfiniteProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { SpinnerCustom } from '@/components/ui/spinner'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import Image from 'next/image'
import { toast } from 'sonner'

export default function ProductList() {
    const router = useRouter()
    const { categories } = useCategories()
    const [statusFilter, setStatusFilter] = useState('all')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const { products, isLoading, isValidating, hasMore, size, setSize, mutate } = useInfiniteProducts({
        status: statusFilter,
        category: categoryFilter === 'all' ? undefined : categoryFilter,
        limit: 12
    })
    const [updating, setUpdating] = useState(null)
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, productId: null, productName: '' })
    const loaderRef = useRef(null)

    useEffect(() => {
        setSize(1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter, categoryFilter])

    useEffect(() => {
        if (!loaderRef.current) return
        const el = loaderRef.current
        const observer = new IntersectionObserver((entries) => {
            const first = entries[0]
            if (first.isIntersecting && hasMore && !isValidating) {
                setSize(prev => prev + 1)
            }
        })
        observer.observe(el)
        return () => observer.disconnect()
    }, [hasMore, isValidating, setSize])

    const handleToggleStatus = async (productId, currentStatus) => {
        setUpdating(productId)
        try {
            // Find the product to get all required data
            const product = products.find(p => p.id === productId)
            if (!product) {
                toast.error('Product not found')
                return
            }

            const response = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: product.name,
                    description: product.description || '',
                    price: product.price,
                    image: product.image || '',
                    categoryId: product.categoryId,
                    stock: product.stock || 0,
                    unitType: product.unitType || 'piece',
                    featured: product.featured || 'none',
                    addedDate: product.addedDate,
                    discountPrice: product.discountPrice || null,
                    discountPercentage: product.discountPercentage || null,
                    isActive: !currentStatus
                }),
            })

            if (response.ok) {
                toast.success('Product status updated successfully!')
                mutate() // Refresh the data
            } else {
                const errorData = await response.json()
                toast.error(errorData.error || 'Failed to update product status')
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

    if (isLoading && products.length === 0) {
        return <div className="flex justify-center py-20">
            <SpinnerCustom />
        </div>
    }

    return (
        <div className="mx-auto space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <h2 className="text-2xl font-bold">Products</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
                        <SelectTrigger className="bg-white w-full md:w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v)}>
                        <SelectTrigger className="bg-white w-full md:w-[220px]">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories?.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((product) => (
                    <Card key={product.id} className={`bg-gray-100 border p- flex flex-col hover:shadow-lg transition ${product.stock <= 0 ? 'opacity-75 border-red-300 bg-red-50' : ''}`}>
                        <CardHeader className="p-4">
                            <div className="flex flex-col justify-between items-start">
                                <div className="relative">
                                    <Image
                                        src={product.image || '/placeholder-image.jpg'}
                                        alt={product.name}
                                        width={150}
                                        height={150}
                                        className={`w-full h-40 object-cover rounded ${product.stock <= 0 ? 'grayscale' : ''}`}
                                    />
                                    {product.stock <= 0 && (
                                        <div className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center">
                                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                OUT OF STOCK
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <CardTitle>
                                        <p className='text-base font-semibold'>Name: {product.name}</p>
                                        Featured: {product.featured && (
                                            <Badge
                                                className="bg-primary/20"
                                                variant="secondary">{product.featured}</Badge>
                                        )}
                                    </CardTitle>

                                    <p className="text-sm text-gray-600">Category: {product.category?.name}</p>
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

                                        {product.discountPercentage && !product.discountPrice && (
                                            <span className="text-xs text-blue-600">
                                                Discount: {product.discountPercentage}% (${((parseFloat(product.price) * (100 - parseFloat(product.discountPercentage))) / 100).toFixed(2)})
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <CardTitle className="flex items-center gap-2">
                                <span className={`text-sm ${product.stock <= 0 ? 'text-red-600 font-semibold' : product.stock <= 5 ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>
                                    {product.stock <= 0 ? 'Out of Stock' : `Stock: ${product.stock} ${product.unitType}`}
                                </span>

                                {/* <Badge variant={product.isActive ? "default" : "destructive"}>
                                    {product.isActive ? "Active" : "Inactive"}
                                </Badge> */}
                                {product.stock <= 0 && (
                                    <Badge variant="destructive" className="bg-red-600">
                                        Out of Stock
                                    </Badge>
                                )}
                                {product.stock > 0 && product.stock <= 5 && (
                                    <Badge variant="secondary" className="bg-orange-500 text-white">
                                        Low Stock
                                    </Badge>
                                )}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="py-4">
                            <div className="flex items-center px-6 justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            className="hover:cursor-pointer"
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

            <div ref={loaderRef} className="h-8" />
            {isValidating && products.length > 0 && (
                <div className="flex justify-center py-6"><SpinnerCustom /></div>
            )}

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

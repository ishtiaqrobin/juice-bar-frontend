'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardImage, CardPrice, CardStock, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useInfiniteProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { SpinnerCustom } from '@/components/ui/spinner'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import Image from 'next/image'
import { toast } from 'sonner'
import { SquarePen, Trash2 } from 'lucide-react'

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

    function ProductImage({ src, alt, className }) {
        const [loaded, setLoaded] = useState(false)
        const imgRef = useRef(null)

        useEffect(() => {
            const imgEl = imgRef.current
            if (imgEl && imgEl.complete && imgEl.naturalWidth > 0) {
                setLoaded(true)
            }
        }, [])

        return (
            <div className="relative">
                {!loaded && (
                    <Skeleton className="absolute inset-0 w-full h-56 rounded-lg" />
                )}
                <Image
                    ref={imgRef}
                    src={src}
                    alt={alt}
                    width={150}
                    height={150}
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    onLoadingComplete={() => setLoaded(true)}
                    className={`${className} transition-opacity duration-300`}
                />
            </div>
        )
    }

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

            {/* Product List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {(isLoading && products.length === 0) ? (
                    Array.from({ length: 12 }).map((_, idx) => (
                        <div key={idx} className="bg-[#FAFAF9] border p- rounded-xl flex flex-col h-full">
                            <div className="p-3 md:p-4 space-y-3">
                                <div className="relative">
                                    <Skeleton className="w-full h-56 rounded-lg" />
                                </div>
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-6 w-24" />
                                <div className="space-y-3">
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-4 w-36" />
                                </div>
                                <Skeleton className="h-5 w-28" />
                            </div>
                            <div className="pb-3 md:pb-4 px-3 md:px-4 mt-auto">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <Skeleton className="h-6 w-20" />
                                    </div>
                                    <div className="flex space-x-2">
                                        <Skeleton className="h-8 w-9 rounded-md" />
                                        <Skeleton className="h-8 w-9 rounded-md" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : products.map((product) => (
                    <Card key={product.id} className={`bg-[#FAFAF9] border p- flex flex-col h-full hover:shadow-lg transition ${product.stock <= 0 ? 'opacity-75 border-red-400 bg-red-100/90' : ''}`}>
                        <CardHeader className="p-3 md:p-4">
                            <CardImage className="relative">
                                <ProductImage
                                    src={product.image || '/placeholder-image.jpg'}
                                    alt={product.name}
                                    className={`w-full h-56 object-cover rounded-lg ${product.stock <= 0 ? 'grayscale' : ''}`}
                                />
                                {product.stock <= 0 && (
                                    <div className="absolute inset-0 rounded-lg bg-red-500/20" />
                                )}
                            </CardImage>

                            <CardTitle>
                                <p className='text-base text-black font-semibold'>{product.name}</p>
                            </CardTitle>

                            <div>
                                {product.featured && (
                                    <Badge
                                        className="bg-[#A7A7A7] text-white rounded"
                                        variant="secondary">{product.featured}</Badge>
                                )}
                            </div>

                            <CardPrice>
                                <div className="flex items-center gap-2">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            {product.discountPrice ? (
                                                <>
                                                    <span className="text-lg font-bold text-red-600">৳{product.discountPrice}</span>
                                                    <span className="text-sm text-gray-500 line-through">৳{product.price}</span>
                                                    {product.discountPercentage && (
                                                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                                            -{product.discountPercentage}%
                                                        </span>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-lg text-black font-bold">৳{product.price}</span>
                                            )}
                                        </div>

                                        {product.discountPercentage && !product.discountPrice && (
                                            <span className="text-xs text-blue-600">
                                                Discount: {product.discountPercentage}% (${((parseFloat(product.price) * (100 - parseFloat(product.discountPercentage))) / 100).toFixed(2)})
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </CardPrice>

                            <CardDescription className="text-card-foreground">
                                <p>
                                    In Category: {product.category?.name}
                                </p>

                                <p>
                                    Added on: {new Date(product.addedDate).toLocaleDateString()}
                                </p>
                            </CardDescription>

                            <CardStock className="flex items-center gap-">
                                <span className={`text-sm font-semibold capitalize ${product.stock <= 0 ? 'text-red-600 ' : product.stock <= 5 ? 'text-orange-600 mr-2' : 'text-card-foreground'}`}>
                                    {product.stock <= 0 ? '' : `Stock: ${product.stock} ${product.unitType}`}
                                </span>

                                {product.stock <= 0 && (
                                    <Badge variant="destructive" className="bg-red-600 text-[11px] font-semibold">
                                        Out of Stock
                                    </Badge>
                                )}
                                {product.stock > 0 && product.stock <= 5 && (
                                    <Badge variant="secondary" className="bg-orange-600 text-white text-[11px] font-semibold">
                                        Low Stock
                                    </Badge>
                                )}
                            </CardStock>
                        </CardHeader>

                        <CardFooter className="pb-3 md:pb-4 px-3 md:px-4 mt-auto">
                            <div className="flex items-center justify-between">
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
                                        <SquarePen size={14} className="" />
                                    </Button>
                                    <Button
                                        className="hover:cursor-pointer"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDeleteClick(product.id, product.name)}
                                    >
                                        <Trash2 size={14} className="" />
                                    </Button>
                                </div>
                            </div>
                        </CardFooter>
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

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useCategories } from '@/hooks/useCategories'

export default function ProductForm({ product, onSave }) {
    const router = useRouter()
    const { categories } = useCategories()
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        image: '',
        categoryId: '',
        stock: '',
        isFeatured: false,
        isActive: true
    })
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price?.toString() || '',
                image: product.image || '',
                categoryId: product.categoryId || '',
                stock: product.stock?.toString() || '',
                isFeatured: product.isFeatured || false,
                isActive: product.isActive !== false
            })
        }
    }, [product])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const url = product ? `/api/products/${product.id}` : '/api/products'
            const method = product ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                onSave?.()
                router.push('/admin')
            } else {
                const error = await response.json()
                alert(error.error || 'Failed to save product')
            }
        } catch (error) {
            alert('Failed to save product')
        } finally {
            setIsLoading(false)
        }
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (response.ok) {
                const result = await response.json()
                setFormData(prev => ({ ...prev, image: result.url }))
            }
        } catch (error) {
            alert('Failed to upload image')
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>{product ? 'Edit Product' : 'Add New Product'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="price">Price</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="stock">Stock</Label>
                            <Input
                                id="stock"
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                            value={formData.categoryId}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="image">Product Image</Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                        {formData.image && (
                            <div className="mt-2">
                                <img
                                    src={formData.image}
                                    alt="Product preview"
                                    className="w-32 h-32 object-cover rounded"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="featured"
                                checked={formData.isFeatured}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
                            />
                            <Label htmlFor="featured">Featured Product</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="active"
                                checked={formData.isActive}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                            />
                            <Label htmlFor="active">Active</Label>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Product'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

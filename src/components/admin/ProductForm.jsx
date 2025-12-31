"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { formatPrice } from "@/lib/utils";
import AddCategoryDialog from "./AddCategoryDialog";
import AddFeaturedDialog from "./AddFeaturedDialog";

export default function ProductForm({ product }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [featuredOptions, setFeaturedOptions] = useState([]);
  const [selectKey, setSelectKey] = useState(0);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddFeatured, setShowAddFeatured] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    categoryId: "",
    stock: "",
    unitType: "piece",
    featured: "none",
    addedDate: new Date().toISOString().split("T")[0],
    discountPrice: "",
    discountPercentage: "",
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [calculatedDiscountPrice, setCalculatedDiscountPrice] = useState("");

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchCategories(), fetchFeaturedOptions()]);
      setDataLoaded(true);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (product && dataLoaded) {
      // console.log("Product loaded:", product);
      // console.log("CategoryId:", product.categoryId);
      // console.log("Featured:", product.featured);
      // console.log("Categories available:", categories);
      // console.log("Featured options available:", featuredOptions);

      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        image: product.image || "",
        categoryId: product.categoryId || "",
        stock: product.stock?.toString() || "",
        unitType: product.unitType || "piece",
        featured: product.featured ? product.featured : "none",
        addedDate: product.addedDate,
        discountPrice: product.discountPrice?.toString() || "",
        discountPercentage: product.discountPercentage?.toString() || "",
        isActive: product.isActive !== false,
      });
      // Set calculated discount price if exists
      if (product.discountPrice) {
        setCalculatedDiscountPrice(product.discountPrice.toString());
      }
      // Force re-render of select components
      setSelectKey((prev) => prev + 1);
    }
  }, [product, dataLoaded, categories, featuredOptions]);

  const fetchCategories = async () => {
    try {
      const response = await api.categories.getAll();
      const categoriesData = response.data.data || [];
      setCategories(categoriesData);
      console.log("Categories loaded:", categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchFeaturedOptions = async () => {
    try {
      const response = await api.featured.getAll();
      const featuredData = response.data.data || [];
      setFeaturedOptions(featuredData);
      console.log("Featured options loaded:", featuredData);
    } catch (error) {
      console.error("Error fetching featured options:", error);
    }
  };

  const handlePriceChange = (value) => {
    setFormData((prev) => ({ ...prev, price: value }));
    if (formData.discountPercentage && value) {
      const calculated = calculateDiscountPrice(
        value,
        formData.discountPercentage
      );
      setFormData((prev) => ({ ...prev, discountPrice: calculated }));
      setCalculatedDiscountPrice(calculated);
    }
  };

  const handleDiscountPercentageChange = (value) => {
    setFormData((prev) => ({ ...prev, discountPercentage: value }));
    if (formData.price && value) {
      const calculated = calculateDiscountPrice(formData.price, value);
      setFormData((prev) => ({ ...prev, discountPrice: calculated }));
      setCalculatedDiscountPrice(calculated);
    } else {
      setFormData((prev) => ({ ...prev, discountPrice: "" }));
      setCalculatedDiscountPrice("");
    }
  };

  const calculateDiscountPrice = (price, percentage) => {
    if (!price || !percentage) return "";
    const originalPrice = parseFloat(price);
    const discountPercent = parseFloat(percentage);
    if (discountPercent > 100) return "";
    const discountAmount = (originalPrice * discountPercent) / 100;
    return (originalPrice - discountAmount).toFixed(2);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await api.upload.product(file);
      setFormData((prev) => ({ ...prev, image: response.data.data.url }));
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleCategoryAdded = (newCategory) => {
    setCategories((prev) => [...prev, newCategory]);
    setFormData((prev) => ({ ...prev, categoryId: newCategory.id }));
    fetchCategories(); // Refetch to ensure consistency
    setSelectKey((prev) => prev + 1);
  };

  const handleFeaturedAdded = (newFeatured) => {
    setFeaturedOptions((prev) => [...prev, newFeatured]);
    setFormData((prev) => ({ ...prev, featured: newFeatured.name }));
    fetchFeaturedOptions(); // Refetch to ensure consistency
    setSelectKey((prev) => prev + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.name.trim()) {
      toast.error("Product name is required");
      setIsLoading(false);
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Valid price is required");
      setIsLoading(false);
      return;
    }

    if (!formData.categoryId) {
      toast.error("Please select a category");
      setIsLoading(false);
      return;
    }

    if (!formData.image || formData.image.trim() === "") {
      toast.error("Product image is required");
      setIsLoading(false);
      return;
    }

    try {
      // Prepare data with null for empty discount fields
      const submitData = {
        ...formData,
        discountPercentage:
          formData.discountPercentage &&
          formData.discountPercentage.trim() !== ""
            ? parseFloat(formData.discountPercentage)
            : null,
        discountPrice:
          formData.discountPrice && formData.discountPrice.trim() !== ""
            ? parseFloat(formData.discountPrice)
            : null,
      };

      if (product) {
        await api.products.update(product.id, submitData);
        toast.success("Product updated successfully");
      } else {
        await api.products.create(submitData);
        toast.success("Product created successfully");
      }
      router.push("/admin/products");
    } catch (error) {
      toast.error(error.message || "Failed to save product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full mx-auto">
      <CardTitle className="text-2xl font-bold">
        {product ? "Edit Product" : "Add New Product"}
      </CardTitle>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="bg-[#FAFAF9] p-4 md:p-6 rounded-lg space-y-4 mt-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">
              Product Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="price">
                Price {""}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formatPrice(formData.price)}
                onChange={(e) => handlePriceChange(e.target.value)}
                required
                placeholder="Enter product price"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="discountPercentage">Discount Percentage</Label>
              <Input
                id="discountPercentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formatPrice(formData.discountPercentage)}
                onChange={(e) => handleDiscountPercentageChange(e.target.value)}
                placeholder="Enter percentage (0-100)%"
              />
              {calculatedDiscountPrice && (
                <p className="text-sm text-green-600">
                  Calculated Discount Price: ৳
                  {formatPrice(calculatedDiscountPrice)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="manualDiscountPrice">
                Manual Discount Price{" "}
              </Label>
              <Input
                id="manualDiscountPrice"
                type="number"
                step="0.01"
                value={formatPrice(formData.discountPrice)}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    discountPrice: e.target.value,
                  }))
                }
                placeholder="Enter manual discount price"
              />
              <p className="text-xs text-gray-500">
                Leave empty to use percentage-based discount
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="unitType">Unit Type</Label>
              <Select
                key={`unitType-${selectKey}`}
                value={formData.unitType}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, unitType: value }))
                }
              >
                <SelectTrigger className="bg-white w-full">
                  <SelectValue placeholder="Select unit type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="piece">Piece</SelectItem>
                  <SelectItem value="kg">Kg</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="stock">
                Stock ({formData.unitType}) {""}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, stock: e.target.value }))
                }
                placeholder="Enter product stock"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="category">
                  Category {""}
                  <span className="text-red-500">*</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddCategory(true)}
                  className="text-xs hover:cursor-pointer"
                >
                  + Add Category
                </Button>
              </div>
              <Select
                key={`category-${selectKey}`}
                value={formData.categoryId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, categoryId: value }))
                }
                required
              >
                <SelectTrigger className="bg-white w-full">
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

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Featured Product</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddFeatured(true)}
                  className="text-xs hover:cursor-pointer"
                >
                  + Add Featured
                </Button>
              </div>
              <Select
                key={`featured-${selectKey}`}
                value={formData.featured}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, featured: value }))
                }
              >
                <SelectTrigger className="bg-white w-full">
                  <SelectValue placeholder="Select featured type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {featuredOptions.map((option) => (
                    <SelectItem key={option.id} value={option.name}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="image">
                Product Image <span className="text-red-500">*</span>
              </Label>
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

            <div className="flex flex-col gap-2">
              <Label htmlFor="addedDate">Product Added Date</Label>
              <Input
                id="addedDate"
                type="date"
                value={formData.addedDate}
                className="text-sm"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    addedDate: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Label htmlFor="active">Active Status</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isActive: checked }))
                }
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-2">
            <Button
              className="hover:cursor-pointer"
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              className="hover:cursor-pointer"
              type="submit"
              disabled={isLoading}
            >
              {product ? "Update Product" : "Add Product"}
            </Button>
          </div>
        </form>
      </CardContent>

      {/* Dialog Components */}
      <AddCategoryDialog
        open={showAddCategory}
        onOpenChange={setShowAddCategory}
        onCategoryAdded={handleCategoryAdded}
      />

      <AddFeaturedDialog
        open={showAddFeatured}
        onOpenChange={setShowAddFeatured}
        onFeaturedAdded={handleFeaturedAdded}
      />
    </Card>
  );
}

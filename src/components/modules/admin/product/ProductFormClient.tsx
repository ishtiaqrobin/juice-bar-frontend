"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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

import { formatPrice } from "@/lib/utils";
import { useImageUpload } from "@/hooks/useImageUpload";
import { IMAGE_UPLOAD_CONFIG } from "@/constants/imageUpload";
import {
  productSchema,
  type ProductFormInput,
  type ProductFormValues,
} from "@/validations/product.validation";
import CategoryDialog from "@/components/modules/admin/category/CategoryDialog";
import FeaturedDialog from "@/components/modules/admin/featured/FeaturedDialog";
import { saveProductAction } from "@/actions/product.action";
import { Category, FeaturedOption, Product, ProductPayload } from "@/types";

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProductFormClientProps {
  product?: Product | null;
  categories: Category[];
  featuredOptions: FeaturedOption[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductFormClient({
  product,
  categories,
  featuredOptions,
}: ProductFormClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [selectKey, setSelectKey] = useState(0);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddFeatured, setShowAddFeatured] = useState(false);

  // Use the reusable hook for image upload with compression
  const {
    file: imageFile,
    preview: imagePreview,
    isCompressing,
    handleFileChange,
  } = useImageUpload({
    showSuccessToast: false, // We'll handle in form submit
  });

  // ── react-hook-form ───────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price?.toString() ?? "",
      image: product?.image ?? "",
      categoryId: product?.categoryId ?? "",
      stock: product?.stock?.toString() ?? "",
      unitType: product?.unitType ?? "piece",
      featured: product?.featured ?? "none",
      addedDate: product?.addedDate ?? new Date().toISOString().split("T")[0],
      discountPercentage: product?.discountPercentage?.toString() ?? "",
      discountPrice: product?.discountPrice?.toString() ?? "",
      isActive: product?.isActive ?? true,
    },
  });

  // Watch fields needed for reactive UI
  const price = watch("price");
  const discountPercentage = watch("discountPercentage");
  const unitType = watch("unitType");

  // ── Discount calculation ──────────────────────────────────────────────────
  const calcDiscount = (p: string, pct: string): string => {
    if (!p || !pct) return "";
    const orig = parseFloat(p);
    const disc = parseFloat(pct);
    if (isNaN(orig) || isNaN(disc) || disc > 100) return "";
    return (orig - (orig * disc) / 100).toFixed(2);
  };

  const calculatedDiscountPrice = calcDiscount(price, discountPercentage ?? "");

  const handleDiscountPctChange = (val: string) => {
    setValue("discountPercentage", val);
    setValue("discountPrice", val ? calcDiscount(price, val) : "");
  };

  const handlePriceChange = (val: string) => {
    setValue("price", val);
    if (discountPercentage) {
      setValue("discountPrice", calcDiscount(val, discountPercentage));
    }
  };

  // ── Form submit ───────────────────────────────────────────────────────────
  const onSubmit: (values: ProductFormValues) => void = (values) => {
    setServerError(null);

    startTransition(async () => {
      try {
        // Show preview: either new compressed file or existing image
        const displayPreview = imagePreview || product?.image || "";

        // Build payload with all form data and optional imageFile
        // Service layer (via Server Action) handles FormData + API call
        const payload: ProductPayload & { imageFile?: File } = {
          name: values.name.trim(),
          description: values.description.trim(),
          price: parseFloat(values.price),
          image: displayPreview,
          categoryId: values.categoryId,
          stock: parseFloat(values.stock) || 0,
          unitType: values.unitType,
          featured: values.featured === "none" ? null : values.featured || null,
          addedDate: values.addedDate,
          discountPrice: values.discountPrice.trim()
            ? parseFloat(values.discountPrice)
            : null,
          discountPercentage: values.discountPercentage.trim()
            ? parseFloat(values.discountPercentage)
            : null,
          isActive: values.isActive,
          ...(imageFile && { imageFile }),
        };

        const result = await saveProductAction(product?.id ?? null, payload);
        if (result?.error) {
          setServerError(result.error);
          toast.error(result.error);
        }
        // On success, redirect() is called server-side
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Operation failed";
        setServerError(message);
        toast.error(message);
      }
    });
  };

  // ── Dialog callbacks ──────────────────────────────────────────────────────
  const handleCategoryAdded = () => {
    router.refresh();
    setSelectKey((k) => k + 1);
  };

  const handleFeaturedAdded = () => {
    router.refresh();
    setSelectKey((k) => k + 1);
  };

  const isSubmitting = isPending;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Card className="w-full mx-auto">
      <CardTitle className="text-2xl font-bold">
        {product ? "Edit Product" : "Add New Product"}
      </CardTitle>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-[#FAFAF9] p-4 md:p-6 rounded-lg space-y-4 mt-4"
        >
          {/* ── Name ──────────────────────────────────────────────── */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">
              Product Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter product name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* ── Description ───────────────────────────────────────── */}
          {/* <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Enter product description"
              {...register("description")}
            />
          </div> */}

          {/* ── Price / Discount ──────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="price">
                Price <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="Enter product price"
                value={formatPrice(price)}
                onChange={(e) => handlePriceChange(e.target.value)}
              />
              {errors.price && (
                <p className="text-xs text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="discountPercentage">Discount Percentage</Label>
              <Input
                id="discountPercentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="Enter percentage (0-100)%"
                value={formatPrice(discountPercentage ?? "")}
                onChange={(e) => handleDiscountPctChange(e.target.value)}
              />
              {calculatedDiscountPrice && (
                <p className="text-sm text-green-600">
                  Calculated: ৳{formatPrice(calculatedDiscountPrice)}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="discountPrice">Manual Discount Price</Label>
              <Input
                id="discountPrice"
                type="number"
                step="0.01"
                placeholder="Enter manual discount price"
                value={formatPrice(watch("discountPrice") ?? "")}
                onChange={(e) => setValue("discountPrice", e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Leave empty to use percentage-based discount
              </p>
            </div>
          </div>

          {/* ── Unit Type / Stock ─────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Unit Type</Label>
              <Controller
                control={control}
                name="unitType"
                render={({ field }) => (
                  <Select
                    key={`unitType-${selectKey}`}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="bg-white w-full">
                      <SelectValue placeholder="Select unit type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="piece">Piece</SelectItem>
                      <SelectItem value="kg">Kg</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="stock">
                Stock ({unitType}) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="stock"
                min="0"
                type="number"
                placeholder="Enter product stock"
                {...register("stock")}
              />
              {errors.stock && (
                <p className="text-xs text-red-500">{errors.stock.message}</p>
              )}
            </div>
          </div>

          {/* ── Category / Featured ───────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label>
                  Category <span className="text-red-500">*</span>
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
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select
                    key={`category-${selectKey}`}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="bg-white w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[400px]">
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId && (
                <p className="text-xs text-red-500">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label>Featured Product</Label>
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
              <Controller
                control={control}
                name="featured"
                render={({ field }) => (
                  <Select
                    key={`featured-${selectKey}`}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="bg-white w-full">
                      <SelectValue placeholder="Select featured type" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[400px]">
                      <SelectItem value="none">None</SelectItem>
                      {featuredOptions.map((opt) => (
                        <SelectItem key={opt.id} value={opt.name}>
                          {opt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* ── Image Upload ──────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="imageFile">
                Product Image <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="imageFile"
                  type="file"
                  accept={IMAGE_UPLOAD_CONFIG.ACCEPT_TYPES}
                  onChange={handleFileChange}
                  disabled={isSubmitting || isCompressing}
                />
                {!(imagePreview || product?.image) && (
                  <p className="text-xs text-gray-500 mt-1">
                    Max size: {IMAGE_UPLOAD_CONFIG.MAX_SIZE_MB} MB.
                    Auto-compressed!
                  </p>
                )}
              </div>
              {errors.image && (
                <p className="text-xs text-red-500">{errors.image.message}</p>
              )}
              {(imagePreview || product?.image) && (
                <div className="mt-2">
                  <Image
                    key={product?.id || "new"} // ID-based key for proper rendering
                    src={imagePreview || product?.image || ""}
                    alt={`Product preview - ${product?.id || "new"}`}
                    width={128}
                    height={128}
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              )}
            </div>

            {/* ── Added Date ────────────────────────────────────── */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="addedDate">Product Added Date</Label>
              <Input
                id="addedDate"
                type="date"
                className="text-sm"
                disabled={isSubmitting || isCompressing}
                {...register("addedDate")}
              />
            </div>
          </div>

          {/* ── Active Status ─────────────────────────────────────── */}
          {/* <div className="flex items-center space-x-4">
            <Label htmlFor="active">Active Status</Label>
            <Controller
              control={control}
              name="isActive"
              render={({ field }) => (
                <Switch
                  id="active"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div> */}

          {/* ── Server error ──────────────────────────────────────── */}
          {/* {serverError && (
            <p className="text-sm text-red-600 font-medium">{serverError}</p>
          )} */}

          {/* ── Actions ───────────────────────────────────────────── */}
          <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-2">
            <Button
              type="button"
              variant="outline"
              className="hover:cursor-pointer"
              onClick={() => router.back()}
              disabled={isSubmitting || isCompressing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="hover:cursor-pointer"
              disabled={isSubmitting || isCompressing}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  {product ? "Updating..." : "Adding..."}
                </>
              ) : isCompressing ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Compressing...
                </>
              ) : (
                <>{product ? "Update Product" : "Add Product"}</>
              )}
            </Button>
          </div>
        </form>
      </CardContent>

      {/* ── Inline dialogs ──────────────────────────────────────────── */}
      <CategoryDialog
        open={showAddCategory}
        onOpenChange={setShowAddCategory}
        mode="add"
        onSuccess={handleCategoryAdded}
      />
      <FeaturedDialog
        open={showAddFeatured}
        onOpenChange={setShowAddFeatured}
        mode="add"
        onSuccess={handleFeaturedAdded}
      />
    </Card>
  );
}

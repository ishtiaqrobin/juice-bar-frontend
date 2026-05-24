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
import { Switch } from "@/components/ui/switch";

import { formatPrice } from "@/lib/utils";
import {
  productSchema,
  type ProductFormInput,
  type ProductFormValues,
} from "@/validations/product.validation";
import CategoryDialog from "@/components/modules/admin/category/CategoryDialog";
import FeaturedDialog from "@/components/modules/admin/featured/FeaturedDialog";
import { saveProductAction } from "@/actions/product.action";
import { Category, FeaturedOption, Product, ProductPayload } from "@/types";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;
const ACCEPT_TYPES = "image/jpeg,image/jpg,image/png,image/webp";
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    product?.image ?? "",
  );

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

  // ── Image upload ──────────────────────────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!(ALLOWED_TYPES as readonly string[]).includes(file.type)) {
      const readable = ALLOWED_TYPES.map((t) =>
        t.replace("image/", "").toUpperCase(),
      ).join(", ");
      toast.error(`Only ${readable} images are allowed`);
      return;
    }

    // Validate file size
    if (file.size > MAX_SIZE_BYTES) {
      const currentMB = (file.size / 1024 / 1024).toFixed(1);
      toast.error(
        `Image must be smaller than ${MAX_SIZE_MB} MB (current: ${currentMB})`,
      );
      return;
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setImageFile(file);
    setImagePreview(previewUrl);
  };

  // ── Form submit ───────────────────────────────────────────────────────────
  const onSubmit: (values: ProductFormValues) => void = (values) => {
    setServerError(null);

    // Build the typed payload from validated form values
    const payload: ProductPayload & { imageFile?: File } = {
      name: values.name.trim(),
      description: values.description.trim(),
      price: parseFloat(values.price),
      image: imagePreview,
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

    startTransition(async () => {
      const result = await saveProductAction(product?.id ?? null, payload);
      if (result?.error) {
        setServerError(result.error);
        toast.error(result.error);
      }
      // On success, redirect() is called server-side — no client navigation needed
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
                  accept={ACCEPT_TYPES}
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                />
                {!imagePreview && (
                  <p className="text-xs text-gray-500 mt-1">
                    Max size: {MAX_SIZE_MB} MB. Formats: JPEG, PNG, WebP
                  </p>
                )}
              </div>
              {errors.image && (
                <p className="text-xs text-red-500">{errors.image.message}</p>
              )}
              {imagePreview && (
                <div className="mt-2">
                  <Image
                    src={imagePreview}
                    alt="Product preview"
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
          {serverError && (
            <p className="text-sm text-red-600 font-medium">{serverError}</p>
          )}

          {/* ── Actions ───────────────────────────────────────────── */}
          <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-2">
            <Button
              type="button"
              variant="outline"
              className="hover:cursor-pointer"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="hover:cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  {product ? "Updating..." : "Adding..."}
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

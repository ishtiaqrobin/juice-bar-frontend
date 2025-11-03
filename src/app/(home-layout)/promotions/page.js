"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BreadcrumbWithCustomSeparator } from "@/components/site/BreadcrumbWithCustomSeparator";
import IconFJBStripe from "@/assets/svg/icon_fjb_strip.svg";

const promos = [
  {
    id: 1,
    title: "Bucket Deal - Save 20%",
    image: "https://images.unsplash.com/photo-1625944528322-0fe4829fe8d8?w=800",
    desc: "Family bucket with fries and drinks.",
  },
  {
    id: 2,
    title: "Burger Combo",
    image: "https://images.unsplash.com/photo-1553867745-0f31a7c3d8e8?w=800",
    desc: "Burger + Fries + Drink at a special price.",
  },
];

export default function PromotionsPage() {
  return (
    <div className="max-w-[972px] mx-auto px-4 py-4 md:py-6">
      <div className="hidden md:block mb-3">
        <Image src={IconFJBStripe} alt="Logo" width={40} height={16}></Image>
      </div>

      <div className="hidden md:block">
        <BreadcrumbWithCustomSeparator />
      </div>

      <div className="mt-4">
        <h1 className="text-3xl md:text-[31px] leading-[37px] font-bold tracking-normal text-stone-900">
          Promotions
        </h1>
        <p className="mt-3 text-stone-600">
          Hot deals you don’t want to miss.
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {promos.map((promo) => (
          <Card key={promo.id} className="overflow-hidden">
            <CardHeader className="p-0">
              <Image
                src={promo.image}
                alt={promo.title}
                width={1200}
                height={800}
                className="h-48 w-full object-cover"
              />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle>{promo.title}</CardTitle>
              <p className="mt-2 text-sm text-stone-600">{promo.desc}</p>
              <Button className="mt-4 bg-primary hover:bg-primary/90 text-white hover:cursor-pointer">
                Order Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

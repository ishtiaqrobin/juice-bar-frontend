"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { HeroCarousel } from "@/components/site/HeroCarousel";

const products = [
    {
        id: 1,
        name: "Apple Juice",
        price: "৳120",
        image: "https://images.unsplash.com/photo-1605199910378-edb0c0709ab4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
        category: "Juice",
    },
    {
        id: 2,
        name: "Mango Juice",
        price: "৳100",
        image: "https://images.unsplash.com/photo-1546173159-315724a31696?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
        category: "Juice",
    },
    {
        id: 3,
        name: "Banana",
        price: "৳70/kg",
        image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=627",
        category: "Fruit",
    },
    {
        id: 4,
        name: "Strawberry",
        price: "৳80/kg",
        image: "https://images.unsplash.com/photo-1611526740984-fd3cbcebb806?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=765",
        category: "Fruit",
    },
];

export default function HomePage() {
    return (
        <div className="flex flex-col">
            {/* Hero Carousel (mobile-first) */}
            <section className="relative isolate bg-white">
                <div className="mx-auto max-w-[942px] px-4 pt-4 md:py-16">
                    <HeroCarousel />
                </div>
            </section>

            {/* Featured */}
            <section className="mx-auto max-w-6xl px-4 pb-12 md:pb-16">

                {/* Promo filter chips */}
                <div className="mt-6 flex flex-wrap gap-2 md:hidden">
                    {[
                        { label: "All" },
                        { label: "Delivery" },
                        { label: "Dine In" },
                        { label: "Self Collect" },
                    ].map((c, i) => (
                        <button
                            key={c.label}
                            className={`rounded-full border px-3 py-1.5 text-xs ${i === 0
                                ? "bg-red-700 text-white border-red-700"
                                : "bg-white text-stone-700"
                                }`}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>
                <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {products.map((item) => (
                        <Card key={item.id} className="hover:shadow-lg transition">
                            <CardHeader className="p-0">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    className="rounded-t-xl object-cover w-full h-44"
                                    width={500}
                                    height={500}
                                />
                            </CardHeader>
                            <CardContent className="p-4">
                                <CardTitle className="text-base">{item.name}</CardTitle>
                                <div className="mt-2 flex items-center justify-between">
                                    <span className="font-semibold text-red-700">
                                        {item.price}
                                    </span>
                                    <Button
                                        size="sm"
                                        className="bg-red-700 hover:bg-red-800 text-white"
                                    >
                                        Add
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
}

// function HeroCarousel() {
//     const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
//     const [selectedIndex, setSelectedIndex] = useState(0);
//     const slides = [
//         "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200",
//         "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200",
//         "https://plus.unsplash.com/premium_photo-1674106347866-8282d8c19f84?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
//         "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
//         "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
//     ];

//     const onSelect = useCallback(() => {
//         if (!emblaApi) return;
//         setSelectedIndex(emblaApi.selectedScrollSnap());
//     }, [emblaApi]);

//     useEffect(() => {
//         if (!emblaApi) return;
//         emblaApi.on("select", onSelect);
//         onSelect();
//     }, [emblaApi, onSelect]);

//     useEffect(() => {
//         if (!emblaApi) return;
//         const timer = setInterval(() => {
//             emblaApi.scrollNext();
//         }, 3500);
//         return () => clearInterval(timer);
//     }, [emblaApi]);

//     return (
//         <div className="order-1 md:order-2">
//             <div className="overflow-hidden rounded- border" ref={emblaRef}>
//                 <div className="flex">
//                     {slides.map((src) => (
//                         <div className="min-w-0 flex-[0_0_100%]" key={src}>
//                             <div className="relative h-48 md:h-80 w-full">
//                                 <Image src={src} alt="promo" fill className="object-cover" />
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//             <div className="mt-2 flex justify-center gap-1">
//                 {slides.map((_, i) => (
//                     <span
//                         key={i}
//                         className={`h-1.5 w-6 rounded-full ${i === selectedIndex ? "bg-stone-900" : "bg-stone-300"
//                             }`}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// }

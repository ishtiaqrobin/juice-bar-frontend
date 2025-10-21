"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
        Contact Us
      </h1>
      <p className="mt-2 text-stone-600">
        Questions or feedback? Send us a message.
      </p>

      <form className="mt-6 grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-medium text-stone-700">
            Name
          </label>
          <Input id="name" placeholder="Your name" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-medium text-stone-700">
            Email
          </label>
          <Input id="email" type="email" placeholder="you@example.com" />
        </div>
        <div className="grid gap-2">
          <label
            htmlFor="message"
            className="text-sm font-medium text-stone-700"
          >
            Message
          </label>
          <Textarea id="message" placeholder="How can we help?" rows={5} />
        </div>
        <Button className="bg-red-700 hover:bg-red-800 text-white">
          Send Message
        </Button>
      </form>

      <div className="mt-8 text-sm text-stone-700">
        <p>Address: 123 Market Road, Dhaka</p>
        <p>Phone: +880 1234-567890</p>
      </div>
    </div>
  );
}

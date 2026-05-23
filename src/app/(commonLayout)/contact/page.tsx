import ContactForm from "@/components/modules/contact/ContactForm"

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
        Contact Us
      </h1>
      <p className="mt-2 text-stone-600">
        Questions or feedback? Send us a message.
      </p>

      {/* Contact Form */}
      <ContactForm />

      <div className="mt-8 text-sm text-stone-700">
        <p>Address: 123 Market Road, Dhaka</p>
        <p>Phone: +880 1234-567890</p>
      </div>
    </div>
  );
}

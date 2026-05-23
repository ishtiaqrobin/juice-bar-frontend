import React from "react";
import { Shield, Lock, Eye, FileText, Database, Bell } from "lucide-react";
import { BreadcrumbWithCustomSeparator } from "@/components/layout/home/BreadcrumbWithCustomSeparator";

export default function PrivacyPolicyPage() {
    return (
        <div className="max-w-[972px] mx-auto px-4 py-8 md:py-12">
            <div className="mb-8">
                <BreadcrumbWithCustomSeparator />
            </div>

            <div className="space-y-12">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-2">
                        <Lock className="h-8 w-8" />
                    </div>
                    <h1 className="text-4xl font-black text-stone-900 tracking-tight">Privacy Policy</h1>
                    <p className="text-stone-500 max-w-2xl mx-auto">
                        At Friends Juice Bar, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information.
                    </p>
                    <p className="text-xs font-bold text-primary uppercase tracking-widest">Effective Date: February 9, 2024</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* Card 1: Information We Collect */}
                    <div className="p-8 rounded-3xl border border-stone-100 bg-white shadow-sm space-y-4 hover:shadow-md transition-shadow">
                        <div className="p-3 rounded-xl bg-orange-50 text-orange-600 w-fit">
                            <Database className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-stone-900">Information We Collect</h3>
                        <ul className="space-y-3 text-sm text-stone-600 list-disc list-inside">
                            <li>Name and contact details (email, phone number).</li>
                            <li>Delivery address for processing orders.</li>
                            <li>Account credentials via Better-Auth.</li>
                            <li>Order history and loyalty rewards points.</li>
                            <li>Payment details (processed securely via third-party providers).</li>
                        </ul>
                    </div>

                    {/* Card 2: How We Use Your Info */}
                    <div className="p-8 rounded-3xl border border-stone-100 bg-white shadow-sm space-y-4 hover:shadow-md transition-shadow">
                        <div className="p-3 rounded-xl bg-blue-50 text-blue-600 w-fit">
                            <Eye className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-stone-900">How We Use Your Info</h3>
                        <ul className="space-y-3 text-sm text-stone-600 list-disc list-inside">
                            <li>To process and deliver your juice and snack orders.</li>
                            <li>To manage your Friends Rewards account and points.</li>
                            <li>To send updates regarding your order status.</li>
                            <li>To improve our menu based on popular choices.</li>
                            <li>To send promotional offers (only if you opt-in).</li>
                        </ul>
                    </div>
                </div>

                {/* Detailed Sections */}
                <div className="prose prose-stone max-w-none space-y-8">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-3">
                            <Shield className="h-6 w-6 text-primary" />
                            Data Security
                        </h2>
                        <p className="text-stone-600 leading-relaxed">
                            We implement a variety of security measures to maintain the safety of your personal information. Your sensitive data (like passwords) is encrypted and managed through high-standard authentication systems. We do not store full credit card information on our servers.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-3">
                            <FileText className="h-6 w-6 text-primary" />
                            Third-Party Services
                        </h2>
                        <p className="text-stone-600 leading-relaxed">
                            We may share necessary data with trusted third parties to provide our services, such as delivery partners and payment processors. These parties are prohibited from using your personal information for any other purpose.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-3">
                            <Bell className="h-6 w-6 text-primary" />
                            Your Choices
                        </h2>
                        <p className="text-stone-600 leading-relaxed">
                            You can access and update your profile information at any time through your dashboard. You may also opt-out of receiving promotional emails by clicking the &quot;unsubscribe&quot; link at the bottom of any of our communications.
                        </p>
                    </section>
                </div>

                {/* Footer Note */}
                <div className="p-6 rounded-2xl bg-stone-50 border border-stone-100 text-center">
                    <p className="text-sm text-stone-500">
                        If you have any questions about this Privacy Policy, please contact us at: <br />
                        <span className="font-bold text-stone-900">privacy@friendsjuicebar.com</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

import React from "react";
import { Scale, CheckCircle2, AlertCircle, ShoppingBag, CreditCard, RefreshCcw } from "lucide-react";
import { BreadcrumbWithCustomSeparator } from "@/components/layout/home/BreadcrumbWithCustomSeparator";

export default function TermsAndConditionsPage() {
    return (
        <div className="max-w-[972px] mx-auto px-4 py-8 md:py-12">
            <div className="mb-8">
                <BreadcrumbWithCustomSeparator />
            </div>

            <div className="space-y-12">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-2">
                        <Scale className="h-8 w-8" />
                    </div>
                    <h1 className="text-4xl font-black text-stone-900 tracking-tight">Terms & Conditions</h1>
                    <p className="text-stone-500 max-w-2xl mx-auto">
                        Please read these terms and conditions carefully before using our services. By ordering from Friends Juice Bar, you agree to these terms.
                    </p>
                    <p className="text-xs font-bold text-primary uppercase tracking-widest">Last Updated: February 9, 2024</p>
                </div>

                {/* Key Policies Grid */}
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="p-6 rounded-2xl border border-stone-100 bg-white space-y-3">
                        <ShoppingBag className="h-6 w-6 text-primary" />
                        <h4 className="font-bold text-stone-900">Orders</h4>
                        <p className="text-xs text-stone-600">All orders are subject to availability and acceptance by our team.</p>
                    </div>
                    <div className="p-6 rounded-2xl border border-stone-100 bg-white space-y-3">
                        <CreditCard className="h-6 w-6 text-primary" />
                        <h4 className="font-bold text-stone-900">Payments</h4>
                        <p className="text-xs text-stone-600">Secure payments are required at the time of checkout for all online orders.</p>
                    </div>
                    <div className="p-6 rounded-2xl border border-stone-100 bg-white space-y-3">
                        <RefreshCcw className="h-6 w-6 text-primary" />
                        <h4 className="font-bold text-stone-900">Returns</h4>
                        <p className="text-xs text-stone-600">Perishable items like juices cannot be returned once delivered.</p>
                    </div>
                </div>

                {/* Detailed Terms */}
                <div className="space-y-10">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-3">
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                            1. Acceptance of Terms
                        </h2>
                        <p className="text-stone-600 leading-relaxed text-sm">
                            By accessing the Friends Juice Bar website and application, you confirm that you are at least 18 years of age or possess legal parental or guardian consent, and are fully able and competent to enter into the terms, conditions, obligations, affirmations, representations, and warranties set forth in these Terms.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-3">
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                            2. User Accounts
                        </h2>
                        <p className="text-stone-600 leading-relaxed text-sm">
                            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. We reserve the right to refuse service, terminate accounts, or cancel orders at our sole discretion.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-3">
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                            3. Loyalty Points & Rewards
                        </h2>
                        <p className="text-stone-600 leading-relaxed text-sm">
                            Friends Rewards points are earned on qualifying purchases. Points have no cash value and can only be redeemed for specified menu items. We reserve the right to change reward values or expire points with prior notice.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-3">
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                            4. Delivery Policy
                        </h2>
                        <p className="text-stone-600 leading-relaxed text-sm">
                            Delivery times provided at checkout are estimates. While we strive to deliver your juices fresh and on time, delays may occur due to traffic or weather conditions. Please ensure someone is available at the delivery location to receive the order.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-3">
                            <AlertCircle className="h-6 w-6 text-red-500" />
                            5. Limitation of Liability
                        </h2>
                        <p className="text-stone-600 leading-relaxed text-sm">
                            Friends Juice Bar shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our services, or for the cost of procurement of substitute goods.
                        </p>
                    </section>
                </div>

                {/* Footer Note */}
                <div className="p-8 rounded-3xl bg-primary text-white text-center space-y-4 shadow-xl shadow-primary/20">
                    <h3 className="text-xl font-bold">Have Questions About Our Terms?</h3>
                    <p className="max-w-md mx-auto opacity-90 text-sm">
                        Our team is here to help you understand your rights and responsibilities.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button className="px-6 py-2 bg-white text-primary rounded-full font-bold text-sm hover:bg-stone-50 transition-colors">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

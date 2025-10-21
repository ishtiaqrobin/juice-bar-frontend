import { Button } from "@/components/ui/button";

export default function RewardsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Rewards</h1>
      <p className="mt-3 text-stone-600">
        Join Friends Rewards to earn points on every order and redeem for free
        items.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Button className="bg-red-700 hover:bg-red-800 text-white">
          Join Now
        </Button>
        <Button variant="secondary">Sign In</Button>
      </div>
    </div>
  );
}

export function Footer({ className = "" }) {
  return (
    <footer className={`bg-gray-100 border-t border-border ${className}`}>
      <div className="max-w-[940px] mx-auto px-4 py-8 grid gap-6 md:grid-cols-4">
        <div>
          <h3 className="text-lg font-semibold text-stone-900">
            Friends Juice Bar
          </h3>
          <p className="mt-2 text-sm text-stone-600">
            Fresh juices and snacks made daily.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-stone-900">About Us</h4>
          <ul className="mt-2 space-y-2 text-sm text-stone-700">
            <li>
              <a href="/menu" className="hover:text-red-700">
                News
              </a>
            </li>
            <li>
              <a href="/promotions" className="hover:text-red-700">
                Promotions
              </a>
            </li>
            <li>
              <a href="/rewards" className="hover:text-red-700">
                Rewards
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-red-700">
                Join Us
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-stone-900">Links</h4>
          <ul className="mt-2 space-y-2 text-sm text-stone-700">
            <li>
              <a href="/menu" className="hover:text-red-700">
                Menu
              </a>
            </li>
            <li>
              <a href="/promotions" className="hover:text-red-700">
                Promotions
              </a>
            </li>
            <li>
              <a href="/rewards" className="hover:text-red-700">
                Rewards
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-red-700">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-stone-900">Contact</h4>
          <p className="mt-2 text-sm text-stone-700">123 Market Road, Dhaka</p>
          <p className="text-sm text-stone-700">Phone: +880 1234-567890</p>
        </div>
      </div>
      <div className="py-4 text-center text-xs text-stone-600">
        © {new Date().getFullYear()} Friends Juice Bar. All rights reserved.
      </div>
    </footer>
  );
}

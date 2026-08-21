import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border surface-panel">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-semibold">ZARA.</p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Considered audio, shipped fast. Free returns within 7 days, always.
          </p>
        </div>
        <FooterCol title="Shop" items={["All earbuds", "Best sellers", "New arrivals", "Gifting"]} />
        <FooterCol title="Support" items={["Track order", "Returns", "Warranty", "Contact us"]} />
        <div>
          <h3 className="text-sm font-semibold">Account</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/orders" className="transition hover:text-foreground">
                My orders
              </Link>
            </li>
            <li>
              <Link to="/cart" className="transition hover:text-foreground">
                Cart
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-6 py-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Zara Audio. Demo storefront — no real orders are processed.
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
        {items.map((i) => (
          <li key={i} className="cursor-default transition hover:text-foreground">
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

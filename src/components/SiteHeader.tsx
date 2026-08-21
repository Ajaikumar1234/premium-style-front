import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Heart, Package, Search, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useShop } from "@/lib/shop-store";

export function SiteHeader() {
  const { cartCount, wishlist, hydrated } = useShop();
  const navigate = useNavigate();
  const search = useRouterState({ select: (s) => s.location.search as { q?: string } });
  const [q, setQ] = useState("");

  useEffect(() => {
    setQ(search?.q ?? "");
  }, [search?.q]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 sm:gap-6 sm:px-6">
        <Link to="/" className="shrink-0 font-display text-2xl font-semibold tracking-tight">
          ZARA<span className="text-muted-foreground">.</span>
        </Link>

        <form
          className="hidden min-w-0 md:block"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/search", search: { q } });
          }}
        >
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for earbuds, headphones…"
              aria-label="Search products"
              className="h-11 w-full rounded-full border border-border bg-secondary/70 pr-4 pl-10 text-sm outline-none transition focus:border-foreground/30 focus:bg-background focus:ring-4 focus:ring-foreground/5"
            />
          </div>
        </form>

        <nav className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link
            to="/search"
            search={{ q: "" }}
            className="grid h-10 w-10 place-items-center rounded-full text-foreground transition hover:bg-secondary md:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Link>
          <Link
            to="/search"
            search={{ q: "" }}
            className="relative hidden h-10 w-10 place-items-center rounded-full transition hover:bg-secondary sm:grid"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
            {hydrated && wishlist.length > 0 && <Dot value={wishlist.length} />}
          </Link>
          <Link
            to="/orders"
            className="hidden h-10 w-10 place-items-center rounded-full transition hover:bg-secondary sm:grid"
            aria-label="My orders"
          >
            <Package className="h-5 w-5" />
          </Link>
          <Link
            to="/cart"
            className="relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-secondary"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {hydrated && cartCount > 0 && <Dot value={cartCount} />}
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Dot({ value }: { value: number }) {
  return (
    <span className="absolute top-0.5 right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
      {value}
    </span>
  );
}

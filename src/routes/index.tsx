import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, RotateCcw, Search, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";
import heroImg from "@/assets/hero.jpg";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zara — Premium Wireless Earbuds & Audio" },
      {
        name: "description",
        content:
          "Shop Zara wireless earbuds: adaptive noise cancellation, 48-hour battery and free delivery with cash on delivery.",
      },
      { property: "og:title", content: "Zara — Premium Wireless Earbuds & Audio" },
      {
        property: "og:description",
        content: "Considered audio, shipped fast. Explore ANC earbuds, sport buds and studio monitors.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const featured = products.slice(0, 4);

  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 pt-10 sm:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
          <div className="min-w-0">
            <span className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium">
              New season · up to 50% off
            </span>
            <h1 className="mt-5 text-4xl leading-[1.05] font-semibold sm:text-6xl">
              Sound worth
              <br />
              staying in for.
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground">
              Earbuds tuned in our own studio, tested by people who commute, run and take too many calls.
            </p>

            <form
              className="mt-8 flex max-w-md gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                navigate({ to: "/search", search: { q } });
              }}
            >
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Try “Earbuds”"
                  aria-label="Search products"
                  className="h-12 w-full rounded-full border border-border bg-background pr-4 pl-11 text-sm outline-none transition focus:border-foreground/30 focus:ring-4 focus:ring-foreground/5"
                />
              </div>
              <button
                type="submit"
                className="h-12 shrink-0 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Search
              </button>
            </form>

            <div className="mt-4 flex flex-wrap gap-2">
              {["Earbuds", "ANC", "Sports", "Studio"].map((t) => (
                <Link
                  key={t}
                  to="/search"
                  search={{ q: t }}
                  className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-border shadow-card">
            <img src={heroImg} alt="Zara audio product flat lay" width={1600} height={900} className="w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 grid max-w-6xl gap-4 px-6 sm:grid-cols-3">
        {[
          { icon: Truck, title: "Free delivery", body: "On every order above ₹999" },
          { icon: RotateCcw, title: "7-day returns", body: "No questions, no restocking fee" },
          { icon: ShieldCheck, title: "2-year warranty", body: "Covered by Zara Audio Care" },
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex items-start gap-3 rounded-2xl border border-border p-5 surface-panel">
            <Icon className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-xs text-muted-foreground">{body}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            <h2 className="text-2xl font-semibold sm:text-3xl">Best selling earbuds</h2>
            <p className="mt-1 text-sm text-muted-foreground">Loved by 30,000+ listeners this season.</p>
          </div>
          <Link
            to="/search"
            search={{ q: "Earbuds" }}
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold transition hover:gap-2.5"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

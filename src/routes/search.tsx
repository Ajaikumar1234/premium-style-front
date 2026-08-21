import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { SearchX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { ProductCard } from "@/components/ProductCard";
import { searchProducts } from "@/lib/products";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  sort: fallback(z.string(), "popular").default("popular"),
});

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Search earbuds — Zara" },
      { name: "description", content: "Compare Zara wireless earbuds by price, rating, discount and battery life." },
      { property: "og:title", content: "Search earbuds — Zara" },
      { property: "og:description", content: "Compare Zara wireless earbuds by price, rating and discount." },
    ],
  }),
  component: SearchPage,
});

const SORTS = [
  { value: "popular", label: "Popularity" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Customer rating" },
];

function SearchPage() {
  const { q, sort } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const [loading, setLoading] = useState(true);
  const [term, setTerm] = useState(q);

  useEffect(() => setTerm(q), [q]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, [q, sort]);

  const results = useMemo(() => {
    const list = [...searchProducts(q)];
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [q, sort]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <nav className="text-xs text-muted-foreground">
        <Link to="/" className="transition hover:text-foreground">
          Home
        </Link>
        <span className="px-1.5">/</span>
        <span className="text-foreground">Search</span>
      </nav>

      <form
        className="mt-5 md:hidden"
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ search: (prev) => ({ ...prev, q: term }) });
        }}
      >
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search for earbuds…"
          aria-label="Search products"
          className="h-11 w-full rounded-full border border-border bg-secondary/70 px-4 text-sm outline-none focus:bg-background"
        />
      </form>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold sm:text-3xl">
            {q ? `Results for “${q}”` : "All products"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? "Searching…" : `${results.length} product${results.length === 1 ? "" : "s"} found`}
          </p>
        </div>
        <label className="shrink-0 text-sm">
          <span className="sr-only">Sort by</span>
          <select
            value={sort}
            onChange={(e) => navigate({ search: (prev) => ({ ...prev, sort: e.target.value }) })}
            className="h-10 rounded-full border border-border bg-background px-4 text-sm outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-border">
              <div className="aspect-square w-full animate-pulse bg-secondary" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-4/5 animate-pulse rounded bg-secondary" />
                <div className="h-3 w-2/5 animate-pulse rounded bg-secondary" />
                <div className="h-9 w-full animate-pulse rounded-full bg-secondary" />
              </div>
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="mt-16 flex flex-col items-center rounded-3xl border border-border py-20 text-center surface-panel">
          <SearchX className="h-9 w-9 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">No matches for “{q}”</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Try a broader term like “earbuds”, or browse everything we carry.
          </p>
          <Link
            to="/search"
            search={{ q: "Earbuds", sort: "popular" }}
            className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Search “Earbuds”
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

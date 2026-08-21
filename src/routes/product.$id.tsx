import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { Check, Heart, Minus, Plus, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ProductCard } from "@/components/ProductCard";
import { Stars } from "@/components/Stars";
import { discountOf, formatPrice, getProduct, products } from "@/lib/products";
import { useShop } from "@/lib/shop-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Product unavailable — Zara" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.product;
    return {
      meta: [
        { title: `${p.name} — Zara` },
        { name: "description", content: `${p.tagline}. ${formatPrice(p.price)} with ${discountOf(p)}% off at Zara.` },
        { property: "og:title", content: `${p.name} — Zara` },
        { property: "og:description", content: p.tagline },
      ],
    };
  },
  notFoundComponent: ProductNotFound,
  component: ProductPage,
});

function ProductNotFound() {
  return (
    <div className="mx-auto max-w-md px-6 py-28 text-center">
      <h1 className="text-2xl font-semibold">We couldn’t find that product</h1>
      <p className="mt-2 text-sm text-muted-foreground">It may have sold out or been renamed.</p>
      <Link
        to="/search"
        search={{ q: "Earbuds", sort: "popular" }}
        className="mt-6 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
      >
        Browse earbuds
      </Link>
    </div>
  );
}

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addToCart, toggleWishlist, wishlist, hydrated } = useShop();
  const navigate = useNavigate();
  const [image, setImage] = useState(0);
  const [variant, setVariant] = useState(product.variants[0]!.value);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"overview" | "specs" | "reviews">("overview");

  const outOfStock = product.stock === 0;
  const wished = hydrated && wishlist.includes(product.id);
  const similar = products.filter((p) => p.id !== product.id).slice(0, 4);

  const buckets = [5, 4, 3, 2, 1].map((star) => ({
    star,
    pct: [62, 24, 8, 4, 2][5 - star]!,
  }));

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <nav className="text-xs text-muted-foreground">
        <Link to="/" className="transition hover:text-foreground">
          Home
        </Link>
        <span className="px-1.5">/</span>
        <Link to="/search" search={{ q: "Earbuds", sort: "popular" }} className="transition hover:text-foreground">
          Earbuds
        </Link>
        <span className="px-1.5">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-3xl border border-border surface-panel">
            <img
              src={product.images[image]}
              alt={`${product.name} view ${image + 1}`}
              width={1024}
              height={1024}
              className="aspect-square w-full object-cover"
            />
          </div>
          <div className="mt-3 flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setImage(i)}
                aria-label={`Show image ${i + 1}`}
                className={cn(
                  "h-20 w-20 overflow-hidden rounded-xl border transition",
                  i === image ? "border-foreground" : "border-border opacity-70 hover:opacity-100",
                )}
              >
                <img src={img} alt="" width={1024} height={1024} loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">{product.brand}</p>
          <h1 className="mt-2 text-3xl leading-tight font-semibold">{product.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{product.tagline}</p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <Stars rating={product.rating} size={16} />
            <span className="font-semibold">{product.rating}</span>
            <span className="text-muted-foreground">· {product.reviewCount.toLocaleString("en-IN")} reviews</span>
          </div>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            <span className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
            <span className="rounded-full bg-sale px-2.5 py-1 text-xs font-semibold text-primary-foreground">
              {discountOf(product)}% OFF
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</p>

          <p className={cn("mt-4 text-sm font-medium", outOfStock ? "text-sale" : "text-success")}>
            {outOfStock ? "Currently out of stock" : product.stock < 10 ? `Hurry — only ${product.stock} left` : "In stock, ships today"}
          </p>

          <div className="mt-6">
            <p className="text-sm font-semibold">Colour</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.value}
                  type="button"
                  onClick={() => setVariant(v.value)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition",
                    variant === v.value ? "border-foreground bg-primary text-primary-foreground" : "border-border hover:bg-secondary",
                  )}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full border border-border">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((n) => Math.max(1, n - 1))}
                className="grid h-11 w-11 place-items-center rounded-full transition hover:bg-secondary"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-semibold">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((n) => Math.min(10, n + 1))}
                className="grid h-11 w-11 place-items-center rounded-full transition hover:bg-secondary"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              <Heart className={cn("h-4 w-4", wished && "fill-sale text-sale")} />
              {wished ? "Saved" : "Save for later"}
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={outOfStock}
              onClick={() => {
                addToCart(product.id, variant, qty);
                toast.success("Added to cart", { description: `${qty} × ${product.name}` });
              }}
              className="h-12 flex-1 rounded-full border border-border text-sm font-semibold transition hover:bg-secondary disabled:opacity-40"
            >
              Add to Cart
            </button>
            <button
              type="button"
              disabled={outOfStock}
              onClick={() => {
                addToCart(product.id, variant, qty);
                navigate({ to: "/checkout" });
              }}
              className="h-12 flex-1 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
            >
              Buy Now
            </button>
          </div>

          <ul className="mt-6 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
            <li className="flex items-center gap-2">
              <Truck className="h-4 w-4 shrink-0" /> Free delivery
            </li>
            <li className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 shrink-0" /> 7-day returns
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0" /> 2-year warranty
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-16">
        <div className="flex gap-1 border-b border-border">
          {(["overview", "specs", "reviews"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "-mb-px border-b-2 px-4 py-3 text-sm font-semibold capitalize transition",
                tab === t ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="py-8">
          {tab === "overview" && (
            <div className="grid gap-8 md:grid-cols-2">
              <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
              <ul className="space-y-2.5">
                {product.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tab === "specs" && (
            <dl className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
              {product.specs.map((s) => (
                <div key={s.label} className="flex justify-between gap-4 bg-card px-5 py-4 text-sm">
                  <dt className="text-muted-foreground">{s.label}</dt>
                  <dd className="text-right font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {tab === "reviews" && (
            <div className="grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)]">
              <div className="rounded-2xl border border-border p-6 surface-panel">
                <p className="text-4xl font-bold">{product.rating}</p>
                <Stars rating={product.rating} size={16} className="mt-2" />
                <p className="mt-2 text-xs text-muted-foreground">
                  Based on {product.reviewCount.toLocaleString("en-IN")} reviews
                </p>
                <div className="mt-5 space-y-2">
                  {buckets.map((b) => (
                    <div key={b.star} className="flex items-center gap-2 text-xs">
                      <span className="w-3">{b.star}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                        <div className="h-full rounded-full bg-star" style={{ width: `${b.pct}%` }} />
                      </div>
                      <span className="w-8 text-right text-muted-foreground">{b.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <ul className="space-y-6">
                {product.reviews.map((r) => (
                  <li key={r.id} className="border-b border-border pb-6 last:border-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Stars rating={r.rating} />
                      <p className="text-sm font-semibold">{r.title}</p>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {r.author} · {r.date}
                      {r.verified && <span className="ml-2 font-medium text-success">Verified purchase</span>}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Similar earbuds</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {similar.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

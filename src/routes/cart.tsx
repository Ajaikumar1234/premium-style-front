import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/products";
import { lineTotals, useCartProducts, useShop } from "@/lib/shop-store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your cart — Zara" },
      { name: "description", content: "Review the earbuds in your Zara cart before checkout." },
      { property: "og:title", content: "Your cart — Zara" },
      { property: "og:description", content: "Review the earbuds in your Zara cart before checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, setQty, removeLine, hydrated } = useShop();
  const items = useCartProducts(cart);
  const totals = lineTotals(cart);

  if (!hydrated) {
    return <div className="mx-auto max-w-6xl px-6 py-20 text-sm text-muted-foreground">Loading your cart…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground" />
        <h1 className="mt-5 text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">Find a pair you'll actually want to wear all day.</p>
        <Link
          to="/search"
          search={{ q: "Earbuds", sort: "popular" }}
          className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Shop earbuds
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Your cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <ul className="space-y-4">
          {items.map(({ line, product }) => (
            <li
              key={product.id + line.variant}
              className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 rounded-2xl border border-border p-4 sm:grid-cols-[110px_minmax(0,1fr)]"
            >
              <Link to="/product/$id" params={{ id: product.id }} className="overflow-hidden rounded-xl surface-panel">
                <img src={product.images[0]} alt={product.name} width={1024} height={1024} loading="lazy" className="h-full w-full object-cover" />
              </Link>
              <div className="min-w-0">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
                  <div className="min-w-0">
                    <Link to="/product/$id" params={{ id: product.id }} className="line-clamp-2 text-sm font-semibold">
                      {product.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground capitalize">{line.variant}</p>
                  </div>
                  <button
                    type="button"
                    aria-label="Remove item"
                    onClick={() => removeLine(product.id, line.variant)}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center rounded-full border border-border">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQty(product.id, line.variant, line.qty - 1)}
                      className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-secondary"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{line.qty}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQty(product.id, line.variant, line.qty + 1)}
                      className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-secondary"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold">{formatPrice(product.price * line.qty)}</p>
                    <p className="text-xs text-muted-foreground line-through">
                      {formatPrice(product.originalPrice * line.qty)}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-border p-6 surface-panel lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <Row label="Price" value={formatPrice(totals.subtotal)} />
            <Row label="Discount" value={`− ${formatPrice(totals.discount)}`} accent />
            <Row label="Delivery" value={totals.delivery === 0 ? "Free" : formatPrice(totals.delivery)} />
            <div className="border-t border-border pt-3">
              <Row label="Total" value={formatPrice(totals.total)} bold />
            </div>
          </dl>
          <Link
            to="/checkout"
            className="mt-6 block rounded-full bg-primary py-3 text-center text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Proceed to checkout
          </Link>
          <p className="mt-3 text-center text-xs text-muted-foreground">You saved {formatPrice(totals.discount)} on this order</p>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, accent, bold }: { label: string; value: string; accent?: boolean; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className={bold ? "font-semibold" : "text-muted-foreground"}>{label}</dt>
      <dd className={bold ? "text-lg font-bold" : accent ? "font-medium text-success" : "font-medium"}>{value}</dd>
    </div>
  );
}

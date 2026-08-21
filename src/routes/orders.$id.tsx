import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { formatPrice } from "@/lib/products";
import { useCartProducts, useShop } from "@/lib/shop-store";

export const Route = createFileRoute("/orders/$id")({
  head: () => ({
    meta: [
      { title: "Order details — Zara" },
      { name: "description", content: "See items, delivery address and payment details for your Zara order." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Order details — Zara" },
      { property: "og:description", content: "See items and delivery details for your Zara order." },
    ],
  }),
  component: OrderDetail,
});

const STEPS = ["Confirmed", "Packed", "Shipped", "Delivered"];

function OrderDetail() {
  const { id } = Route.useParams();
  const { orders, hydrated } = useShop();
  const order = orders.find((o) => o.id === id);
  const items = useCartProducts(order?.lines ?? []);

  if (!hydrated) {
    return <div className="mx-auto max-w-3xl px-6 py-20 text-sm text-muted-foreground">Loading order…</div>;
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold">Order not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">We couldn’t find order {id} on this device.</p>
        <Link to="/orders" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
          Back to orders
        </Link>
      </div>
    );
  }

  const eta = new Date(order.eta).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> All orders
      </Link>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold">Order {order.id}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-success/10 px-3 py-1.5 text-xs font-semibold text-success">{order.status}</span>
      </div>

      <div className="mt-8 rounded-2xl border border-border p-6 surface-panel">
        <p className="text-sm font-semibold">Arriving by {eta}</p>
        <ol className="mt-5 grid grid-cols-4 gap-2 text-[11px]">
          {STEPS.map((s, i) => (
            <li key={s} className="min-w-0">
              <div className={`h-1.5 rounded-full ${i === 0 ? "bg-success" : "bg-border"}`} />
              <p className={`mt-2 truncate ${i === 0 ? "font-semibold" : "text-muted-foreground"}`}>{s}</p>
            </li>
          ))}
        </ol>
      </div>

      <section className="mt-8 rounded-2xl border border-border p-6">
        <h2 className="text-lg font-semibold">Items</h2>
        <ul className="mt-5 space-y-4">
          {items.map(({ line, product }) => (
            <li key={product.id + line.variant} className="flex items-center gap-3">
              <img
                src={product.images[0]}
                alt={product.name}
                width={1024}
                height={1024}
                loading="lazy"
                className="h-16 w-16 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <Link to="/product/$id" params={{ id: product.id }} className="line-clamp-2 text-sm font-semibold">
                  {product.name}
                </Link>
                <p className="text-xs text-muted-foreground">Qty {line.qty} · {line.variant}</p>
              </div>
              <p className="shrink-0 text-sm font-semibold">{formatPrice(product.price * line.qty)}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <section className="rounded-2xl border border-border p-6">
          <h2 className="text-sm font-semibold">Delivery address</h2>
          <address className="mt-3 text-sm leading-relaxed text-muted-foreground not-italic">
            {order.address.fullName}
            <br />
            {order.address.line1}
            <br />
            {order.address.city}, {order.address.state} {order.address.pincode}
            <br />
            {order.address.phone}
          </address>
        </section>

        <section className="rounded-2xl border border-border p-6">
          <h2 className="text-sm font-semibold">Payment</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Price</dt>
              <dd>{formatPrice(order.totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Discount</dt>
              <dd className="text-success">− {formatPrice(order.totals.discount)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery</dt>
              <dd>{order.totals.delivery === 0 ? "Free" : formatPrice(order.totals.delivery)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <dt className="font-semibold">Paid via COD</dt>
              <dd className="font-bold">{formatPrice(order.totals.total)}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { formatPrice } from "@/lib/products";
import { useCartProducts, useShop } from "@/lib/shop-store";

export const Route = createFileRoute("/order-confirmation/$id")({
  head: () => ({
    meta: [
      { title: "Order placed successfully — Zara" },
      { name: "description", content: "Your Zara order is confirmed. Track delivery from My Orders." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Order placed successfully — Zara" },
      { property: "og:description", content: "Your Zara order is confirmed." },
    ],
  }),
  component: Confirmation,
});

function Confirmation() {
  const { id } = Route.useParams();
  const { orders, hydrated } = useShop();
  const order = orders.find((o) => o.id === id);
  const items = useCartProducts(order?.lines ?? []);

  if (!hydrated) {
    return <div className="mx-auto max-w-md px-6 py-24 text-center text-sm text-muted-foreground">Confirming your order…</div>;
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold">Order not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">We couldn’t find order {id} on this device.</p>
        <Link to="/orders" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
          View my orders
        </Link>
      </div>
    );
  }

  const eta = new Date(order.eta).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success">
        <Check className="h-8 w-8 text-success-foreground" strokeWidth={3} />
      </div>
      <h1 className="mt-6 text-3xl font-semibold">Order Placed Successfully</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Thanks {order.address.fullName.split(" ")[0]} — we’ve emailed the receipt to {order.address.email}.
      </p>

      <div className="mt-10 space-y-4 rounded-2xl border border-border p-6 text-left surface-panel">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
          <span className="text-xs text-muted-foreground">Order ID</span>
          <span className="font-mono text-sm font-semibold">{order.id}</span>
        </div>

        <ul className="space-y-4">
          {items.map(({ line, product }) => (
            <li key={product.id + line.variant} className="flex items-center gap-3">
              <img
                src={product.images[0]}
                alt={product.name}
                width={1024}
                height={1024}
                loading="lazy"
                className="h-14 w-14 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-semibold">{product.name}</p>
                <p className="text-xs text-muted-foreground">Qty {line.qty} · {line.variant}</p>
              </div>
              <p className="shrink-0 text-sm font-semibold">{formatPrice(product.price * line.qty)}</p>
            </li>
          ))}
        </ul>

        <div className="flex justify-between border-t border-border pt-4">
          <span className="text-sm font-semibold">Total amount</span>
          <span className="text-lg font-bold">{formatPrice(order.totals.total)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Payment</span>
          <span className="font-medium">Cash on Delivery</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Estimated delivery</span>
          <span className="font-medium text-success">{eta}</span>
        </div>
        <p className="border-t border-border pt-4 text-xs text-muted-foreground">
          Shipping to {order.address.line1}, {order.address.city}, {order.address.state} {order.address.pincode}
        </p>
      </div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to="/orders/$id"
          params={{ id: order.id }}
          className="rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          View Order
        </Link>
        <Link
          to="/search"
          search={{ q: "Earbuds", sort: "popular" }}
          className="rounded-full border border-border px-7 py-3 text-sm font-semibold transition hover:bg-secondary"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

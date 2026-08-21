import { createFileRoute, Link } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { formatPrice, getProduct } from "@/lib/products";
import { useShop } from "@/lib/shop-store";

export const Route = createFileRoute("/orders/")({
  head: () => ({
    meta: [
      { title: "My orders — Zara" },
      { name: "description", content: "Track your Zara orders, delivery status and past purchases." },
      { property: "og:title", content: "My orders — Zara" },
      { property: "og:description", content: "Track your Zara orders and past purchases." },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const { orders, hydrated } = useShop();

  if (!hydrated) {
    return <div className="mx-auto max-w-4xl px-6 py-20 text-sm text-muted-foreground">Loading your orders…</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <Package className="mx-auto h-10 w-10 text-muted-foreground" />
        <h1 className="mt-5 text-2xl font-semibold">No orders yet</h1>
        <p className="mt-2 text-sm text-muted-foreground">When you place an order it will show up here.</p>
        <Link
          to="/search"
          search={{ q: "Earbuds", sort: "popular" }}
          className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-semibold">My orders</h1>
      <ul className="mt-8 space-y-4">
        {orders.map((order) => {
          const first = getProduct(order.lines[0]?.productId ?? "");
          return (
            <li key={order.id}>
              <Link
                to="/orders/$id"
                params={{ id: order.id }}
                className="grid grid-cols-[64px_minmax(0,1fr)] items-center gap-4 rounded-2xl border border-border p-4 transition hover:shadow-card sm:grid-cols-[72px_minmax(0,1fr)_auto]"
              >
                {first && (
                  <img
                    src={first.images[0]}
                    alt={first.name}
                    width={1024}
                    height={1024}
                    loading="lazy"
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{first?.name ?? "Order"}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {order.id} · {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  <span className="mt-2 inline-block rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success">
                    {order.status}
                  </span>
                </div>
                <p className="col-span-2 text-right text-base font-bold sm:col-span-1">{formatPrice(order.totals.total)}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

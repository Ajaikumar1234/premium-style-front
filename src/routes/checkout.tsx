import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BadgeCheck, Loader2, Lock, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { formatPrice } from "@/lib/products";
import { lineTotals, useCartProducts, useShop, type Address } from "@/lib/shop-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Zara" },
      { name: "description", content: "Enter delivery details and place your Zara order with cash on delivery." },
      { property: "og:title", content: "Checkout — Zara" },
      { property: "og:description", content: "Enter delivery details and place your Zara order." },
    ],
  }),
  component: CheckoutPage,
});

const empty: Address = { fullName: "", phone: "", email: "", line1: "", city: "", state: "", pincode: "" };

function validate(a: Address) {
  const e: Partial<Record<keyof Address, string>> = {};
  if (a.fullName.trim().length < 3) e.fullName = "Enter your full name";
  if (!/^\d{10}$/.test(a.phone.trim())) e.phone = "Enter a valid 10-digit phone number";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email.trim())) e.email = "Enter a valid email address";
  if (a.line1.trim().length < 8) e.line1 = "Enter your full street address";
  if (a.city.trim().length < 2) e.city = "Enter your city";
  if (a.state.trim().length < 2) e.state = "Enter your state";
  if (!/^\d{6}$/.test(a.pincode.trim())) e.pincode = "Enter a valid 6-digit PIN code";
  return e;
}

function CheckoutPage() {
  const { cart, hydrated, placeOrder, clearCart } = useShop();
  const items = useCartProducts(cart);
  const totals = lineTotals(cart);
  const navigate = useNavigate();

  const [address, setAddress] = useState<Address>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!hydrated) {
    return <div className="mx-auto max-w-6xl px-6 py-20 text-sm text-muted-foreground">Preparing checkout…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground" />
        <h1 className="mt-5 text-2xl font-semibold">Nothing to check out</h1>
        <p className="mt-2 text-sm text-muted-foreground">Add a product to your cart to continue.</p>
        <Link
          to="/search"
          search={{ q: "Earbuds", sort: "popular" }}
          className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Shop earbuds
        </Link>
      </div>
    );
  }

  const field = (key: keyof Address, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="block">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <input
        {...props}
        value={address[key]}
        onChange={(e) => {
          setAddress({ ...address, [key]: e.target.value });
          if (errors[key]) setErrors({ ...errors, [key]: undefined });
        }}
        className={cn(
          "mt-1.5 h-11 w-full rounded-xl border bg-background px-3.5 text-sm outline-none transition focus:ring-4 focus:ring-foreground/5",
          errors[key] ? "border-destructive" : "border-border focus:border-foreground/30",
        )}
      />
      {errors[key] && <span className="mt-1 block text-xs text-destructive">{errors[key]}</span>}
    </label>
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(address);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1100));
    const order = placeOrder(address, cart);
    clearCart();
    navigate({ to: "/order-confirmation/$id", params: { id: order.id } });
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Checkout</h1>
      <p className="mt-1 text-sm text-muted-foreground">Step 2 of 3 · Delivery details</p>

      <form onSubmit={onSubmit} className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-8">
          <section className="rounded-2xl border border-border p-6">
            <h2 className="text-lg font-semibold">Delivery address</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {field("fullName", "Full name", { placeholder: "Ajai Kumar", autoComplete: "name" })}
              {field("phone", "Phone number", { placeholder: "9876543210", inputMode: "numeric", maxLength: 10 })}
              <div className="sm:col-span-2">{field("email", "Email", { placeholder: "you@example.com", type: "email" })}</div>
              <div className="sm:col-span-2">
                {field("line1", "Address", { placeholder: "Flat / House no, street, area" })}
              </div>
              {field("city", "City", { placeholder: "Bengaluru" })}
              {field("state", "State", { placeholder: "Karnataka" })}
              {field("pincode", "PIN code", { placeholder: "560001", inputMode: "numeric", maxLength: 6 })}
            </div>
          </section>

          <section className="rounded-2xl border border-border p-6">
            <h2 className="text-lg font-semibold">Payment method</h2>
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-foreground/70 p-4">
              <span className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 border-foreground">
                <span className="h-2 w-2 rounded-full bg-foreground" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">Cash on Delivery</p>
                <p className="text-xs text-muted-foreground">Pay in cash or UPI when your order arrives.</p>
              </div>
              <BadgeCheck className="ml-auto h-5 w-5 shrink-0 text-success" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Card and netbanking are unavailable in this demo store.</p>
          </section>
        </div>

        <aside className="h-fit space-y-5 rounded-2xl border border-border p-6 surface-panel lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <ul className="space-y-4">
            {items.map(({ line, product }) => (
              <li key={product.id + line.variant} className="flex gap-3">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="h-14 w-14 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-xs font-semibold">{product.name}</p>
                  <p className="text-xs text-muted-foreground">Qty {line.qty} · {line.variant}</p>
                </div>
                <p className="shrink-0 text-sm font-semibold">{formatPrice(product.price * line.qty)}</p>
              </li>
            ))}
          </ul>

          <dl className="space-y-3 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Price ({items.length} item{items.length === 1 ? "" : "s"})</dt>
              <dd className="font-medium">{formatPrice(totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Discount</dt>
              <dd className="font-medium text-success">− {formatPrice(totals.discount)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery charge</dt>
              <dd className="font-medium">{totals.delivery === 0 ? "Free" : formatPrice(totals.delivery)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3">
              <dt className="font-semibold">Total payable</dt>
              <dd className="text-lg font-bold">{formatPrice(totals.total)}</dd>
            </div>
          </dl>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Placing order…
              </>
            ) : (
              "Place Order"
            )}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" /> Your details stay on this device
          </p>
        </aside>
      </form>
    </div>
  );
}

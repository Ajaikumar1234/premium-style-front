import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProduct, type Product } from "./products";

export type CartLine = { productId: string; variant: string; qty: number };

export type Address = {
  fullName: string;
  phone: string;
  email: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
};

export type Order = {
  id: string;
  createdAt: string;
  lines: CartLine[];
  address: Address;
  totals: { subtotal: number; discount: number; delivery: number; total: number };
  status: "Confirmed" | "Shipped" | "Delivered";
  eta: string;
};

type ShopState = {
  cart: CartLine[];
  wishlist: string[];
  orders: Order[];
  hydrated: boolean;
  addToCart: (productId: string, variant: string, qty?: number) => void;
  setQty: (productId: string, variant: string, qty: number) => void;
  removeLine: (productId: string, variant: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  placeOrder: (address: Address, lines: CartLine[]) => Order;
  cartCount: number;
};

const ShopContext = createContext<ShopState | null>(null);
const KEY = "zara-shop-v1";

export const DELIVERY_FREE_ABOVE = 999;
export const DELIVERY_FEE = 49;

export function lineTotals(lines: CartLine[]) {
  let subtotal = 0;
  let discount = 0;
  for (const l of lines) {
    const p = getProduct(l.productId);
    if (!p) continue;
    subtotal += p.originalPrice * l.qty;
    discount += (p.originalPrice - p.price) * l.qty;
  }
  const payable = subtotal - discount;
  const delivery = payable === 0 || payable >= DELIVERY_FREE_ABOVE ? 0 : DELIVERY_FEE;
  return { subtotal, discount, delivery, total: payable + delivery };
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const data = JSON.parse(raw);
        setCart(data.cart ?? []);
        setWishlist(data.wishlist ?? []);
        setOrders(data.orders ?? []);
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEY, JSON.stringify({ cart, wishlist, orders }));
  }, [cart, wishlist, orders, hydrated]);

  const addToCart = useCallback((productId: string, variant: string, qty = 1) => {
    setCart((prev) => {
      const i = prev.findIndex((l) => l.productId === productId && l.variant === variant);
      if (i === -1) return [...prev, { productId, variant, qty }];
      const next = [...prev];
      next[i] = { ...next[i], qty: Math.min(10, next[i].qty + qty) };
      return next;
    });
  }, []);

  const setQty = useCallback((productId: string, variant: string, qty: number) => {
    setCart((prev) =>
      prev.map((l) =>
        l.productId === productId && l.variant === variant ? { ...l, qty: Math.max(1, Math.min(10, qty)) } : l,
      ),
    );
  }, []);

  const removeLine = useCallback((productId: string, variant: string) => {
    setCart((prev) => prev.filter((l) => !(l.productId === productId && l.variant === variant)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((p) => p !== productId) : [...prev, productId]));
  }, []);

  const placeOrder = useCallback((address: Address, lines: CartLine[]) => {
    const totals = lineTotals(lines);
    const now = new Date();
    const eta = new Date(now.getTime() + 3 * 86400000);
    const order: Order = {
      id: "ZR" + now.getTime().toString().slice(-8),
      createdAt: now.toISOString(),
      lines,
      address,
      totals,
      status: "Confirmed",
      eta: eta.toISOString(),
    };
    setOrders((prev) => [order, ...prev]);
    return order;
  }, []);

  const value = useMemo<ShopState>(
    () => ({
      cart,
      wishlist,
      orders,
      hydrated,
      addToCart,
      setQty,
      removeLine,
      clearCart,
      toggleWishlist,
      placeOrder,
      cartCount: cart.reduce((s, l) => s + l.qty, 0),
    }),
    [cart, wishlist, orders, hydrated, addToCart, setQty, removeLine, clearCart, toggleWishlist, placeOrder],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
}

export function useCartProducts(lines: CartLine[]): { line: CartLine; product: Product }[] {
  return lines
    .map((line) => ({ line, product: getProduct(line.productId)! }))
    .filter((x) => Boolean(x.product));
}

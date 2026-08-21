import { Link, useNavigate } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { discountOf, formatPrice, type Product } from "@/lib/products";
import { useShop } from "@/lib/shop-store";
import { Stars } from "./Stars";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, wishlist, hydrated } = useShop();
  const navigate = useNavigate();
  const wished = hydrated && wishlist.includes(product.id);
  const outOfStock = product.stock === 0;
  const variant = product.variants[0]!.value;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card card-hover">
      <div className="relative surface-panel">
        <Link to="/product/$id" params={{ id: product.id }} className="block">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            width={1024}
            height={1024}
            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <span className="absolute top-3 left-3 rounded-full bg-sale px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">
          {discountOf(product)}% OFF
        </span>
        <button
          type="button"
          onClick={() => {
            toggleWishlist(product.id);
            toast(wished ? "Removed from wishlist" : "Saved to wishlist");
          }}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full border border-border bg-background/90 backdrop-blur transition hover:scale-105"
        >
          <Heart className={cn("h-4 w-4", wished && "fill-sale text-sale")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <Link to="/product/$id" params={{ id: product.id }} className="min-w-0">
          <h3 className="line-clamp-2 text-[15px] leading-snug font-semibold">{product.name}</h3>
        </Link>
        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{product.tagline}</p>

        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
          <Stars rating={product.rating} />
          <span className="font-semibold">{product.rating}</span>
          <span className="text-muted-foreground">({product.reviewCount.toLocaleString("en-IN")})</span>
        </div>

        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-bold">{formatPrice(product.price)}</span>
          <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
        </div>

        <p className={cn("mt-2 text-xs font-medium", outOfStock ? "text-sale" : product.stock < 10 ? "text-sale" : "text-success")}>
          {outOfStock ? "Out of stock" : product.stock < 10 ? `Only ${product.stock} left` : "In stock"}
        </p>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            disabled={outOfStock}
            onClick={() => {
              addToCart(product.id, variant);
              toast.success("Added to cart", { description: product.name });
            }}
            className="h-10 flex-1 rounded-full border border-border bg-background text-sm font-semibold transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
          >
            Add to Cart
          </button>
          <button
            type="button"
            disabled={outOfStock}
            onClick={() => {
              addToCart(product.id, variant);
              navigate({ to: "/checkout" });
            }}
            className="h-10 flex-1 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Buy Now
          </button>
        </div>
      </div>
    </article>
  );
}

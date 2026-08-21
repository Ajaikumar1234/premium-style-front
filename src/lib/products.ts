import black from "@/assets/earbuds-black.jpg";
import white from "@/assets/earbuds-white.jpg";
import blue from "@/assets/earbuds-blue.jpg";
import gold from "@/assets/earbuds-gold.jpg";

export type Review = {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  tagline: string;
  category: string;
  keywords: string[];
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  stock: number;
  images: string[];
  variants: { label: string; value: string }[];
  highlights: string[];
  description: string;
  specs: { label: string; value: string }[];
  reviews: Review[];
};

export const discountOf = (p: Product) =>
  Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);

export const formatPrice = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

const baseReviews = (names: string[]): Review[] =>
  names.map((n, i) => ({
    id: `r${i}`,
    author: n,
    rating: [5, 4, 5, 3, 4][i % 5]!,
    date: ["12 Aug 2026", "2 Aug 2026", "28 Jul 2026", "19 Jul 2026", "3 Jul 2026"][i % 5]!,
    title: [
      "Incredible sound for the price",
      "Battery life is the real winner",
      "Noise cancellation actually works",
      "Good, but the case scratches easily",
      "Comfortable for long calls",
    ][i % 5]!,
    body: [
      "Bass is tight and vocals are clean. I switched from a pair costing twice as much and honestly do not miss them.",
      "Six days of commuting on a single case charge. The fast-charge top up genuinely gives hours from ten minutes.",
      "On a flight the engine hum just disappears. Transparency mode is natural enough to order coffee without removing them.",
      "Sound and fit are excellent, but the glossy case picks up marks within a week. Worth knowing before you buy.",
      "Wore them through a four hour workday of calls with zero ear fatigue. Mic clarity got compliments on Zoom.",
    ][i % 5]!,
    verified: i % 4 !== 3,
  }));

export const products: Product[] = [
  {
    id: "zara-pulse-pro",
    name: "Zara Pulse Pro ANC Earbuds",
    brand: "Zara Audio",
    tagline: "Adaptive noise cancellation with 48h total playtime",
    category: "Earbuds",
    keywords: ["earbuds", "anc", "wireless", "tws", "headphones"],
    price: 4499,
    originalPrice: 8999,
    rating: 4.6,
    reviewCount: 12480,
    stock: 24,
    images: [black, white, gold],
    variants: [
      { label: "Midnight Black", value: "black" },
      { label: "Cloud White", value: "white" },
      { label: "Rose Gold", value: "gold" },
    ],
    highlights: [
      "Hybrid ANC up to 45dB",
      "48 hours playback with case",
      "Quad-mic ENC calling",
      "Low-latency 55ms game mode",
    ],
    description:
      "The Pulse Pro pairs a 12.4mm titanium-coated driver with adaptive hybrid noise cancellation that reads your surroundings 600 times a second. Tuned in-house for warm mids and controlled bass.",
    specs: [
      { label: "Driver", value: "12.4mm titanium coated" },
      { label: "Battery", value: "10h buds / 48h with case" },
      { label: "Charging", value: "USB-C + Wireless" },
      { label: "Bluetooth", value: "5.4 with multipoint" },
      { label: "Water resistance", value: "IPX5" },
      { label: "Weight", value: "4.2g per bud" },
    ],
    reviews: baseReviews(["Ananya R.", "Karthik M.", "Sneha P.", "Rohit V.", "Divya S."]),
  },
  {
    id: "zara-air-lite",
    name: "Zara Air Lite Wireless Earbuds",
    brand: "Zara Audio",
    tagline: "Featherweight daily buds with 36h battery",
    category: "Earbuds",
    keywords: ["earbuds", "wireless", "lightweight", "tws"],
    price: 1999,
    originalPrice: 3999,
    rating: 4.3,
    reviewCount: 8342,
    stock: 61,
    images: [white, black],
    variants: [
      { label: "Cloud White", value: "white" },
      { label: "Midnight Black", value: "black" },
    ],
    highlights: ["3.6g ultralight buds", "36h total playtime", "ENC calling", "Fast pair"],
    description:
      "Built for all-day wear. At 3.6g per bud you forget they are in, while the semi-open fit keeps you aware of the world around you.",
    specs: [
      { label: "Driver", value: "10mm dynamic" },
      { label: "Battery", value: "8h buds / 36h with case" },
      { label: "Charging", value: "USB-C" },
      { label: "Bluetooth", value: "5.3" },
      { label: "Water resistance", value: "IPX4" },
      { label: "Weight", value: "3.6g per bud" },
    ],
    reviews: baseReviews(["Meera J.", "Aditya K.", "Farah N.", "Sameer T.", "Priya G."]),
  },
  {
    id: "zara-sport-beat",
    name: "Zara SportBeat Hook Earbuds",
    brand: "Zara Audio",
    tagline: "Secure ear-hook fit, IPX7 sweatproof",
    category: "Earbuds",
    keywords: ["earbuds", "sports", "running", "gym", "wireless"],
    price: 2799,
    originalPrice: 5499,
    rating: 4.5,
    reviewCount: 5127,
    stock: 8,
    images: [blue, black],
    variants: [
      { label: "Deep Navy", value: "navy" },
      { label: "Midnight Black", value: "black" },
    ],
    highlights: ["IPX7 sweat & rain proof", "Locked-in hook design", "40h total", "Bass boost EQ"],
    description:
      "Flexible memory-alloy hooks hold through sprints and burpees. Tuned with a lifted low end so the tempo carries you through the last set.",
    specs: [
      { label: "Driver", value: "11mm bio-cellulose" },
      { label: "Battery", value: "9h buds / 40h with case" },
      { label: "Charging", value: "USB-C" },
      { label: "Bluetooth", value: "5.3" },
      { label: "Water resistance", value: "IPX7" },
      { label: "Weight", value: "6.1g per bud" },
    ],
    reviews: baseReviews(["Nikhil B.", "Tanvi A.", "Imran Q.", "Lakshmi D.", "Arjun S."]),
  },
  {
    id: "zara-luxe-gold",
    name: "Zara Luxe Rose Gold Earbuds",
    brand: "Zara Audio",
    tagline: "Metal finish buds with hi-res certified audio",
    category: "Earbuds",
    keywords: ["earbuds", "premium", "hi-res", "wireless"],
    price: 6999,
    originalPrice: 11999,
    rating: 4.7,
    reviewCount: 3204,
    stock: 0,
    images: [gold, white],
    variants: [{ label: "Rose Gold", value: "gold" }],
    highlights: ["Hi-Res Audio Wireless (LDAC)", "Anodised metal case", "42h total", "Spatial audio"],
    description:
      "A jewellery-grade anodised shell wrapped around a dual-driver array. LDAC support delivers detail that survives the wireless trip.",
    specs: [
      { label: "Driver", value: "Dual: 10mm + balanced armature" },
      { label: "Battery", value: "8h buds / 42h with case" },
      { label: "Charging", value: "USB-C + Wireless" },
      { label: "Bluetooth", value: "5.4 LDAC" },
      { label: "Water resistance", value: "IPX4" },
      { label: "Weight", value: "5.0g per bud" },
    ],
    reviews: baseReviews(["Ishita M.", "Varun L.", "Naomi F.", "Rahul C.", "Zoya H."]),
  },
  {
    id: "zara-core-anc",
    name: "Zara Core ANC Earbuds",
    brand: "Zara Audio",
    tagline: "Entry-level noise cancelling done right",
    category: "Earbuds",
    keywords: ["earbuds", "anc", "budget", "wireless"],
    price: 2499,
    originalPrice: 4999,
    rating: 4.1,
    reviewCount: 9611,
    stock: 3,
    images: [black, blue],
    variants: [
      { label: "Midnight Black", value: "black" },
      { label: "Deep Navy", value: "navy" },
    ],
    highlights: ["30dB ANC", "38h total playtime", "Game mode", "Touch controls"],
    description:
      "Real active noise cancellation without the premium tax. Great for open-plan offices and daily commutes.",
    specs: [
      { label: "Driver", value: "10mm dynamic" },
      { label: "Battery", value: "7h buds / 38h with case" },
      { label: "Charging", value: "USB-C" },
      { label: "Bluetooth", value: "5.3" },
      { label: "Water resistance", value: "IPX4" },
      { label: "Weight", value: "4.5g per bud" },
    ],
    reviews: baseReviews(["Deepak N.", "Ritu S.", "Om P.", "Kavya B.", "Yash R."]),
  },
  {
    id: "zara-studio-buds",
    name: "Zara Studio Buds Reference",
    brand: "Zara Audio",
    tagline: "Flat-tuned monitors for creators",
    category: "Earbuds",
    keywords: ["earbuds", "studio", "monitor", "wireless"],
    price: 5499,
    originalPrice: 9499,
    rating: 4.4,
    reviewCount: 1876,
    stock: 17,
    images: [white, gold],
    variants: [
      { label: "Cloud White", value: "white" },
      { label: "Rose Gold", value: "gold" },
    ],
    highlights: ["Reference flat tuning", "aptX Adaptive", "34h total", "Ultra-low latency"],
    description:
      "A deliberately neutral signature so mixes translate. Includes a wired USB-C monitoring mode with zero latency.",
    specs: [
      { label: "Driver", value: "11mm planar-assisted" },
      { label: "Battery", value: "7.5h buds / 34h with case" },
      { label: "Charging", value: "USB-C" },
      { label: "Bluetooth", value: "5.4 aptX Adaptive" },
      { label: "Water resistance", value: "IPX4" },
      { label: "Weight", value: "4.8g per bud" },
    ],
    reviews: baseReviews(["Gaurav T.", "Simran K.", "Neel A.", "Pooja W.", "Amit E."]),
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);

export function searchProducts(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter((p) =>
    [p.name, p.brand, p.category, p.tagline, ...p.keywords].join(" ").toLowerCase().includes(q),
  );
}

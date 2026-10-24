import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import baggyImage from "@/assets/baggy-sweatpants.png.asset.json";
import cropImage from "@/assets/crop-tee.png.asset.json";
import cropTopBlackImage from "@/assets/crop-top-black.png.asset.json";
import cropTopWhiteImage from "@/assets/crop-top-white.png.asset.json";
import hatImage from "@/assets/trucker-hat.png.asset.json";
import interiorImage from "@/assets/interior-tee.png.asset.json";
import logoImage from "@/assets/just-minimal-logo.png.asset.json";
import zipImage from "@/assets/quarter-zip.png.asset.json";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/south-africa")({
  head: () => ({ meta: [
    { title: "Just Minimal South Africa — Official Store" },
    { name: "description", content: "Explore Just Minimal South Africa. Streetwear with intention." },
    { property: "og:title", content: "Just Minimal South Africa — Official Store" },
    { property: "og:description", content: "Explore Just Minimal South Africa. Streetwear with intention." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: SouthAfricaStore,
});

const products = [
  { id: "baggy", name: "Baggy Sweatpants", category: "BOTTOMS", price: 650, description: "Relaxed baggy fit designed for everyday movement.", image: baggyImage.url, colors: ["Dark blue", "Grey", "Black"], sizes: ["M", "L", "XL"] },
  { id: "zip", name: "Quarter Zip", category: "OUTERWEAR", price: 650, description: "A clean layering piece built around the Just Minimal silhouette.", image: zipImage.url, colors: ["Black", "Grey"], sizes: ["M", "L", "XL"] },
  { id: "crop", name: "Crop Tee", category: "TOPS", price: 380, description: "Minimal cropped silhouette designed to be styled effortlessly.", image: cropImage.url, colors: ["White", "Black"], sizes: ["S", "M", "L", "XL"] },
  { id: "tee", name: "Regatta Tee", category: "TOPS", price: 290, description: "Minimal everyday tee designed for effortless daily styling.", image: interiorImage.url, colors: ["Black", "White"], sizes: ["S", "M", "L", "XL"] },
  { id: "hat", name: "Trucker Hat", category: "ACCESSORIES", price: 290, description: "The Just Minimal Trucker Hat.", image: hatImage.url, colors: ["Pink", "Black"], sizes: ["One size"] },
  { id: "crop-top", name: "Crop Top", category: "WOMEN", price: 185, description: "A limited-edition Just Minimal crop top.", image: cropTopBlackImage.url, images: { Black: cropTopBlackImage.url, White: cropTopWhiteImage.url }, colors: ["Black", "White"], sizes: ["S", "M"] },
];

const money = (value: number) => new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(value);

function SouthAfricaStore() {
  const [phone, setPhone] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("ALL");
  const [selected, setSelected] = useState<(typeof products)[number] | null>(null);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<{ id: string; size: string; color: string; quantity: number }[]>([]);

  function enterStore(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (!/^\d{9}$/.test(digits)) {
      setError("Enter a valid South African mobile number with 9 digits after +27.");
      return;
    }
    setError("");
    setUnlocked(true);
  }

  const categories = ["ALL", ...new Set(products.map((product) => product.category))];
  const visible = category === "ALL" ? products : products.filter((product) => product.category === category);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + (products.find((product) => product.id === item.id)?.price ?? 0) * item.quantity, 0);

  function addToCart() {
    if (!selected || !size || !color) return;
    setCart((items) => [...items, { id: selected.id, size, color, quantity }]);
    setSelected(null);
    setSize("");
    setColor("");
    setQuantity(1);
  }

  function sendOrder() {
    const lines = cart.map((item) => {
      const product = products.find((entry) => entry.id === item.id);
      return product ? `• ${product.name} — ${item.color} / ${item.size} × ${item.quantity} — ${money(product.price * item.quantity)}` : "";
    }).filter(Boolean).join("\n");
    const message = `JUST MINIMAL SOUTH AFRICA — ORDER\n\n${lines}\n\nTotal: ${money(total)}\nSouth African mobile: +27${phone.replace(/\D/g, "")}\n\nPlease confirm delivery and payment options.`;
    window.open(`https://wa.me/258851506799?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return <div className="min-h-screen bg-background text-foreground">
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 px-5 backdrop-blur-md md:px-10">
      <a href="#top" aria-label="Just Minimal South Africa home"><img src={logoImage.url} alt="Just Minimal" className="h-11 w-32 object-contain object-left" /></a>
      <div className="flex items-center gap-2"><a href="/" className="border border-border px-3 py-2 font-label text-[0.65rem] font-bold uppercase tracking-[0.1em]">Mozambique store</a>{unlocked && <Button onClick={() => document.getElementById("cart")?.scrollIntoView({ behavior: "smooth" })}>Cart ({count})</Button>}</div>
    </header>
    {!unlocked ? <main id="top" className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-center px-5 py-16 md:px-10">
      <span className="eyebrow">Just Minimal / South Africa</span>
      <h1 className="mt-7 max-w-3xl font-display text-5xl font-semibold leading-[0.98] md:text-7xl">What you wear speaks for you.</h1>
      <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">The Just Minimal collection, now for South Africa. Enter your South African mobile number to continue.</p>
      <form onSubmit={enterStore} className="mt-9 grid max-w-md gap-4">
        <label className="grid gap-2 font-label text-[0.65rem] font-bold uppercase tracking-[0.12em]">South African mobile number
          <div className="flex border border-border bg-background"><span className="flex items-center border-r border-border px-4 text-sm">🇿🇦 +27</span><input aria-label="South African mobile number" value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 9))} inputMode="numeric" autoComplete="tel-national" placeholder="82 123 4567" className="min-w-0 flex-1 bg-transparent px-4 py-3 outline-none" required /></div>
        </label>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" size="lg">Enter South Africa store</Button>
        <p className="text-xs leading-relaxed text-muted-foreground">Phone number validation only. This does not verify ownership by SMS.</p>
      </form>
    </main> : <main id="top">
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24"><span className="eyebrow">Just Minimal / South Africa</span><h1 className="mt-8 max-w-4xl font-display text-5xl font-semibold leading-none md:text-7xl">Wear less. Mean more.</h1><div className="mt-8 grid max-w-4xl gap-7 border-t border-border pt-6 md:grid-cols-2"><p className="max-w-lg leading-relaxed text-muted-foreground">Minimal design. Intentional details. Pieces made to express your identity.</p><p className="text-sm text-muted-foreground md:text-right">Prices in South African rand (ZAR).</p></div></section>
      <section className="border-y border-border bg-secondary"><div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-2 md:px-10"><div><span className="eyebrow">Made with intention</span><h2 className="mt-4 max-w-lg font-display text-4xl font-semibold leading-none md:text-6xl">You matter to the movement.</h2></div><p className="max-w-xl self-end text-lg leading-relaxed text-muted-foreground">Minimal streetwear. Authentic expression. A different way to show up.</p></div></section>
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-10"><div className="mb-9 flex flex-col justify-between gap-7 md:flex-row md:items-end"><div><span className="eyebrow">The collection / 02</span><h2 className="mt-3 font-display text-4xl font-semibold md:text-6xl">The Collection</h2></div><div className="flex flex-wrap gap-2" aria-label="Product categories">{categories.map((item) => <Button key={item} variant={category === item ? "solid" : "outline"} size="sm" onClick={() => setCategory(item)}>{item}</Button>)}</div></div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-5">{visible.map((product) => <article key={product.id}><button className="group block aspect-[4/5] w-full overflow-hidden bg-secondary text-left" onClick={() => { setSelected(product); setSize(product.sizes[0] ?? ""); setColor(product.colors[0] ?? ""); }}><img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]" /></button><button onClick={() => { setSelected(product); setSize(product.sizes[0] ?? ""); setColor(product.colors[0] ?? ""); }} className="w-full py-3 text-left"><span className="eyebrow text-muted-foreground">{product.category}</span><div className="mt-1 flex flex-col justify-between gap-1 md:flex-row"><h3 className="font-display font-semibold">{product.name}</h3><strong className="text-sm">{money(product.price)}</strong></div></button></article>)}</div>
      </section>
      <section id="cart" className="border-y border-border bg-secondary"><div className="mx-auto max-w-7xl px-5 py-12 md:px-10"><span className="eyebrow">Your selection</span><h2 className="mt-3 font-display text-3xl font-semibold">Cart ({count})</h2>{cart.length === 0 ? <p className="mt-4 text-muted-foreground">Your cart is empty.</p> : <><div className="mt-5 grid gap-3">{cart.map((item, index) => { const product = products.find((entry) => entry.id === item.id)!; return <div key={index} className="flex justify-between gap-4 border-b border-border py-3 text-sm"><span>{product.name} · {item.color} · {item.size} × {item.quantity}</span><strong>{money(product.price * item.quantity)}</strong></div>; })}</div><div className="mt-5 flex items-center justify-between text-lg font-bold"><span>Total</span><span>{money(total)}</span></div><Button className="mt-5" onClick={sendOrder}>Send order via WhatsApp</Button></>}</div></section>
    </main>}
    {selected && <div className="fixed inset-0 z-50 flex items-end justify-center bg-overlay p-0 md:items-center md:p-5" role="dialog" aria-modal="true" aria-label={selected.name}><div className="relative max-h-[94vh] w-full max-w-xl overflow-auto bg-background p-6 md:p-10"><Button variant="outline" className="float-right" onClick={() => setSelected(null)}>Close</Button><span className="eyebrow">{selected.category}</span><h2 className="mt-3 font-display text-3xl font-semibold">{selected.name}</h2><p className="mt-3 text-muted-foreground">{selected.description}</p><strong className="mt-4 block text-xl">{money(selected.price)}</strong><label className="mt-6 grid gap-2 font-label text-xs font-bold uppercase tracking-wider">Color<select value={color} onChange={(event) => setColor(event.target.value)} className="border border-border bg-background p-3">{selected.colors.map((item) => <option key={item}>{item}</option>)}</select></label><label className="mt-4 grid gap-2 font-label text-xs font-bold uppercase tracking-wider">Size<select value={size} onChange={(event) => setSize(event.target.value)} className="border border-border bg-background p-3">{selected.sizes.map((item) => <option key={item}>{item}</option>)}</select></label><label className="mt-4 grid gap-2 font-label text-xs font-bold uppercase tracking-wider">Quantity<input type="number" min={1} max={10} value={quantity} onChange={(event) => setQuantity(Math.max(1, Math.min(10, Number(event.target.value))))} className="border border-border bg-background p-3" /></label><Button className="mt-6 w-full" onClick={addToCart}>Add to cart</Button></div></div>}
    <footer className="border-t border-border px-5 py-10 md:px-10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 font-label text-xs font-bold uppercase tracking-[0.14em] md:flex-row"><span>Just Minimal / South Africa</span><span className="text-muted-foreground">What you wear speaks for you.</span></div></footer>
  </div>;
}

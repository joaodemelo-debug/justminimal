import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Minus, Plus, ShoppingBag, Users, X } from "lucide-react";
import { ProductGallery } from "@/components/ProductGallery";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { getStorefrontData, type Product } from "@/lib/storefront.functions";

type CartItem = { productId: string; size: string; color: string; quantity: number };

const WHATSAPP_NUMBER = "258851506799";

const money = (value: number) => `${new Intl.NumberFormat("en-US").format(value)} MZN`;
const APPOINTMENT_PRODUCT_IDS = new Set(["baggy", "zip", "hat"]);
const appointmentUrl = (product: Product) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello Just Minimal, I would like to enquire about the ${product.name} by appointment.`)}`;

export const Route = createFileRoute("/")({
  loader: async () => {
    const data = await getStorefrontData();
    return data;
  },
  head: () => ({ meta: [
    { title: "Just Minimal — Official Store" },
    { name: "description", content: "Explore the Just Minimal collection." },
    { property: "og:title", content: "Just Minimal — Official Store" },
    { property: "og:description", content: "Discover the Just Minimal collection." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Storefront,
});

function Storefront() {
  const { products, paymentDetails, communityUrl, logo } = Route.useLoaderData();
  const [category, setCategory] = useState("ALL");
  const [selected, setSelected] = useState<Product | null>(null);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [payment, setPayment] = useState("");
  const [notice, setNotice] = useState("");
  const [language, setLanguage] = useState<"EN" | "PT">("EN");
  const t = (en: string, pt: string) => language === "EN" ? en : pt;

  useEffect(() => {
    const saved = window.localStorage.getItem("jm_cart");
    if (!saved) return;
    try {
      const stored = JSON.parse(saved) as CartItem[];
      setCart(Array.isArray(stored) ? stored.filter((item) => products.some((product) => product.id === item.productId && !APPOINTMENT_PRODUCT_IDS.has(product.id))) : []);
    } catch { window.localStorage.removeItem("jm_cart"); }
  }, []);

  useEffect(() => { window.localStorage.setItem("jm_cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => {
    const locked = selected || cartOpen || checkoutOpen;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selected, cartOpen, checkoutOpen]);

  const filtered = category === "ALL" ? products : products.filter((product) => product.category === category);
  const categories = ["ALL", ...new Set(products.map((product) => product.category))];
  const totals = useMemo(() => cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return product ? { original: sum.original + product.original * item.quantity, total: sum.total + product.price * item.quantity } : sum;
  }, { original: 0, total: 0 }), [cart]);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  function openProduct(product: Product) { setSelected(product); setSize(product.sizes[0] ?? ""); setColor(product.colors[0] ?? ""); setQuantity(1); }
  function currentInCart(productId: string, itemSize: string, itemColor: string) { return cart.find((item) => item.productId === productId && item.size === itemSize && item.color === itemColor)?.quantity ?? 0; }
  function limitFor(product: Product, itemSize: string, itemColor: string) { return product.variantStock?.[`${itemColor}:${itemSize}`] ?? product.stock?.[itemSize] ?? (product.variantStock ? 0 : 99); }
  function addToCart() {
    if (!selected || !size || !color) return;
    const allowed = limitFor(selected, size, color) - currentInCart(selected.id, size, color);
    if (allowed < quantity) { setNotice("Only the listed stock is available."); return; }
    setCart((items) => {
      const exists = items.find((item) => item.productId === selected.id && item.size === size && item.color === color);
      return exists ? items.map((item) => item === exists ? { ...item, quantity: item.quantity + quantity } : item) : [...items, { productId: selected.id, size, color, quantity }];
    });
    setSelected(null); setCartOpen(true); setNotice("Added to cart"); setTimeout(() => setNotice(""), 1800);
  }
  function changeItem(item: CartItem, delta: number) {
    const product = products.find((entry) => entry.id === item.productId);
    if (!product) return;
    const next = item.quantity + delta;
    if (next > limitFor(product, item.size, item.color)) { setNotice("Stock limit reached"); setTimeout(() => setNotice(""), 1800); return; }
    setCart((items) => next <= 0 ? items.filter((entry) => entry !== item) : items.map((entry) => entry === item ? { ...entry, quantity: next } : entry));
  }
  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const lines = cart.map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      return product ? `• ${product.name} — ${item.color} / ${item.size} × ${item.quantity} — ${money(product.price * item.quantity)}` : "";
    }).filter(Boolean).join("\n");
    const message = `JUST MINIMAL — ORDER\n\n${lines}\n\nTotal: ${money(totals.total)}\n\nName: ${form.get("name")}\nWhatsApp: ${form.get("phone")}\nLocation: ${form.get("location")}\nPayment: ${form.get("payment")}\nStatus: ${form.get("status")}\nNote: ${form.get("note") || "—"}\n\nOrder confirmation is subject to payment verification by Just Minimal.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-2 border-b border-border bg-background/90 px-3 py-2 backdrop-blur-md sm:px-5 md:px-10">
        <a href="#top" aria-label="Just Minimal home"><img src={logo} alt="Just Minimal" width={768} height={768} className="h-9 w-24 object-contain object-left sm:h-11 sm:w-32" /></a>
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2"><div className="flex rounded-full border border-border p-0.5" aria-label="Language"><button onClick={() => setLanguage("EN")} className={`rounded-full px-2 py-1 text-[0.62rem] font-bold ${language === "EN" ? "bg-primary text-primary-foreground" : ""}`}>EN</button><button onClick={() => setLanguage("PT")} className={`rounded-full px-2 py-1 text-[0.62rem] font-bold ${language === "PT" ? "bg-primary text-primary-foreground" : ""}`}>PT</button></div><a href="/south-africa" className="hidden border border-border px-3 py-2 font-label text-[0.65rem] font-bold uppercase tracking-[0.1em] md:inline-block">{t("South Africa store", "Loja África do Sul")}</a><Button variant="outline" size="sm" asChild><a href={communityUrl} target="_blank" rel="noreferrer"><Users size={14} /> <span className="hidden sm:inline">{t("Join community", "Entrar na comunidade")}</span><ExternalLink size={12} /></a></Button><Button onClick={() => setCartOpen(true)} className="gap-2"><ShoppingBag size={15} /> {t("Cart", "Carrinho")} <span className="flex size-5 items-center justify-center bg-primary-foreground text-primary">{count}</span></Button></div>
      </header>

      <main id="top">
        <section className="mx-auto flex max-w-7xl flex-col justify-center px-4 py-12 sm:px-5 sm:py-16 md:px-10 md:py-24">
          <span className="eyebrow">Just Minimal / 01</span>
          <div className="mt-8 grid max-w-4xl gap-7 border-t border-border pt-6 md:grid-cols-2">
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground">{t("Explore the Just Minimal collection. Choose your fit and send your order directly to us on WhatsApp.", "Explore a coleção Just Minimal. Escolha o seu tamanho e envie o pedido diretamente pelo WhatsApp.")}</p>
            <div className="flex flex-wrap items-start gap-3 md:justify-end"><a href="#shop" className="bg-primary px-5 py-3 font-label text-[0.68rem] font-bold uppercase tracking-[0.12em] text-primary-foreground">{t("Explore collection", "Explorar coleção")}</a></div>
          </div>
        </section>

        <section className="border-y border-border bg-secondary"><div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-2 md:px-10"><div><span className="eyebrow">{t("Made with intention", "Feito com intenção")}</span><h2 className="mt-4 max-w-lg font-display text-4xl font-semibold leading-none md:text-6xl">{t("You matter to the movement.", "Tu fazes parte do movimento.")}</h2></div><p className="max-w-xl self-end text-lg leading-relaxed text-muted-foreground">{t("Minimal design. Intentional details. Pieces made to express your identity.", "Design minimalista. Detalhes intencionais. Peças que expressam a tua identidade.")}</p></div></section>

        <section id="shop" className="mx-auto max-w-7xl px-4 py-14 sm:px-5 sm:py-20 md:px-10">
          <div className="mb-7 flex flex-col justify-between gap-5 sm:mb-9 md:flex-row md:items-end"><div><span className="eyebrow">{t("The collection / 02", "A coleção / 02")}</span><h2 className="mt-3 font-display text-4xl font-semibold md:text-6xl">{t("The Collection", "A Coleção")}</h2></div><div className="flex max-w-full gap-2 overflow-x-auto pb-2" aria-label="Product categories">{categories.map((item) => <Button key={item} variant={category === item ? "solid" : "outline"} size="sm" onClick={() => setCategory(item)}>{item}</Button>)}</div></div>
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-7 sm:gap-x-4 sm:gap-y-10 md:grid-cols-3 md:gap-x-5">
             {filtered.map((product) => <article key={product.id}>{APPOINTMENT_PRODUCT_IDS.has(product.id) ? <a href={appointmentUrl(product)} target="_blank" rel="noreferrer" aria-label={`Enquire about ${product.name} on WhatsApp`} className="group relative block aspect-[4/5] w-full overflow-hidden rounded-[1.25rem] bg-secondary text-left"><img src={product.image} alt={product.name} width={1024} height={1280} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]" /><span className="absolute inset-x-3 bottom-3 rounded-full bg-primary px-3 py-2 text-center font-label text-[0.62rem] font-bold uppercase tracking-[0.1em] text-primary-foreground backdrop-blur">By Appointment ↗</span></a> : <button className="group relative block aspect-[4/5] w-full overflow-hidden rounded-[1.25rem] bg-secondary text-left" onClick={() => openProduct(product)} aria-label={`View ${product.name}`}><img src={product.image} alt={product.name} width={1024} height={1280} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]" /><span className="absolute inset-x-3 bottom-3 translate-y-2 rounded-full bg-background/90 px-3 py-2 text-center font-label text-[0.62rem] font-bold uppercase tracking-[0.1em] opacity-0 backdrop-blur transition-all group-hover:translate-y-0 group-hover:opacity-100">Select options</span></button>}<div className="flex min-w-0 items-start justify-between gap-2 py-2"><h3 className="min-w-0 break-words font-display text-sm font-semibold sm:text-base md:text-lg">{product.name}</h3>{!APPOINTMENT_PRODUCT_IDS.has(product.id) && <strong className="shrink-0 pt-0.5 text-xs sm:text-sm">{money(product.price)}</strong>}</div></article>)}
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-5 py-10 md:px-10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 font-label text-xs font-bold uppercase tracking-[0.14em] md:flex-row"><span>Just Minimal</span><span className="text-muted-foreground">{t("What you wear speaks for you.", "O que vestes fala por ti.")}</span></div></footer>

      {selected && <div className="ios-product-backdrop fixed inset-0 z-50 flex items-end justify-center bg-overlay/80 p-2 backdrop-blur-sm sm:p-4 md:items-center md:p-5" role="dialog" aria-modal="true" aria-label={selected.name}><div className="ios-product-popup relative grid max-h-[94dvh] w-full max-w-4xl overflow-y-auto overscroll-contain rounded-[28px] border border-border bg-background shadow-2xl md:grid-cols-2"><Button variant="icon" className="absolute right-3 top-3 z-10 bg-background" onClick={() => setSelected(null)} aria-label="Close product"><X size={20} /></Button><ProductGallery key={`${selected.id}-${color}`} name={selected.name} photos={[...new Set([selected.images?.[color] ?? selected.image, ...(selected.gallery ?? []), ...Object.values(selected.images ?? {})])]} /><div className="flex flex-col justify-center p-4 sm:p-6 md:p-10"><span className="eyebrow">{selected.category}</span><h2 className="mt-3 font-display text-4xl font-semibold">{selected.name}</h2><p className="mt-4 leading-relaxed text-muted-foreground">{selected.description}</p>{APPOINTMENT_PRODUCT_IDS.has(selected.id) ? <a href={appointmentUrl(selected)} target="_blank" rel="noreferrer" className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-primary px-5 py-4 font-label text-xs font-bold uppercase tracking-[0.12em] text-primary-foreground">By Appointment ↗</a> : <><div className="mt-5 flex items-center gap-3"><strong className="text-xl">{money(selected.price)}</strong></div><div className="mt-7"><p className="eyebrow mb-3">{t("Select color", "Selecionar cor")}</p><div className="flex flex-wrap gap-2">{selected.colors.map((item) => <Button key={item} variant={color === item ? "solid" : "outline"} onClick={() => { setColor(item); setQuantity(1); }}>{item}</Button>)}</div></div><div className="mt-6"><p className="eyebrow mb-3">{t("Select size", "Selecionar tamanho")}</p><div className="flex flex-wrap gap-2">{selected.sizes.map((item) => { const available = limitFor(selected, item, color); return <Button key={item} variant={size === item ? "solid" : "outline"} disabled={available <= 0} onClick={() => { setSize(item); setQuantity(1); }}>{item}{selected.stock?.[item] !== undefined || selected.variantStock ? ` · ${available} left` : ""}</Button>; })}</div></div><div className="mt-7 flex items-center justify-between border-y border-border py-4"><span className="eyebrow">{t("Quantity", "Quantidade")}</span><div className="flex items-center"><Button variant="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease"><Minus size={16} /></Button><span className="w-10 text-center font-bold">{quantity}</span><Button variant="icon" onClick={() => setQuantity(Math.min(limitFor(selected, size, color) - currentInCart(selected.id, size, color), quantity + 1))} aria-label="Increase"><Plus size={16} /></Button></div></div><Button size="lg" className="mt-6 w-full" onClick={addToCart} disabled={limitFor(selected, size, color) - currentInCart(selected.id, size, color) <= 0}>{t("Add to cart", "Adicionar ao carrinho")}</Button></>}</div></div></div>}

      {cartOpen && <><button className="fixed inset-0 z-40 bg-overlay backdrop-blur-sm" onClick={() => setCartOpen(false)} aria-label="Close cart" /><aside role="dialog" aria-modal="true" aria-label="Your cart" className="ios-popup fixed inset-x-3 bottom-3 z-50 flex max-h-[88dvh] w-auto flex-col overflow-hidden rounded-[28px] border border-border bg-background shadow-2xl sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[min(92vw,32rem)] sm:-translate-x-1/2 sm:-translate-y-1/2"><div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5"><div><p className="eyebrow text-muted-foreground">Just Minimal</p><h2 className="font-display text-xl font-semibold">{t("Your Cart", "O teu carrinho")} ({count})</h2></div><Button variant="icon" className="rounded-full" onClick={() => setCartOpen(false)} aria-label="Close cart"><X size={20} /></Button></div><div className="min-h-0 flex-1 overflow-auto p-5">{cart.length === 0 ? <div className="grid h-full place-content-center text-center"><ShoppingBag className="mx-auto mb-4 text-muted-foreground" /><p className="text-muted-foreground">{t("Your cart is empty.", "O teu carrinho está vazio.")}</p></div> : <div className="space-y-5">{cart.map((item) => { const product = products.find((entry) => entry.id === item.productId); if (!product) return null; return <div key={`${item.productId}-${item.color}-${item.size}`} className="grid grid-cols-[56px_minmax(0,1fr)] gap-3 border-b border-border pb-5 sm:grid-cols-[80px_minmax(0,1fr)_auto]"><img src={product.images?.[item.color] ?? product.image} alt="" width={80} height={100} className="aspect-[4/5] object-cover" /><div><h3 className="font-display font-semibold">{product.name}</h3><p className="mt-1 text-xs text-muted-foreground">{item.color} · Size {item.size} · {money(product.price)}</p><div className="mt-3 flex items-center gap-1"><Button variant="outline" size="icon" className="size-7" onClick={() => changeItem(item, -1)} aria-label="Decrease quantity"><Minus size={12} /></Button><span className="w-7 text-center text-xs font-bold">{item.quantity}</span><Button variant="outline" size="icon" className="size-7" onClick={() => changeItem(item, 1)} aria-label="Increase quantity"><Plus size={12} /></Button></div></div><strong className="col-start-2 text-sm sm:col-start-auto sm:row-auto">{money(product.price * item.quantity)}</strong></div>; })}</div>}</div><div className="border-t border-border p-5"><div className="space-y-2 text-sm"><div className="flex justify-between border-t border-border pt-4 text-xl font-bold"><span>{t("Total", "Total")}</span><span>{money(totals.total)}</span></div></div><Button size="lg" className="mt-5 w-full" disabled={!cart.length} onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}>{t("Proceed to checkout", "Continuar para finalizar")}</Button><Button variant="outline" className="mt-3 w-full rounded-2xl" onClick={() => setCartOpen(false)}>{t("Select more products", "Selecionar mais produtos")}</Button></div></aside></>}

      {checkoutOpen && <div className="fixed inset-0 z-50 flex items-end justify-center bg-overlay md:items-center md:p-5" role="dialog" aria-modal="true" aria-label="Checkout"><div className="relative max-h-[96dvh] w-full max-w-xl overflow-y-auto overscroll-contain bg-background p-4 sm:p-6 md:p-10"><Button variant="icon" className="absolute right-3 top-3" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout"><X size={20} /></Button><span className="eyebrow">{t("Checkout / final step", "Finalização / último passo")}</span><h2 className="mt-3 font-display text-4xl font-semibold">{t("Complete your order.", "Finaliza o teu pedido.")}</h2><div className="mt-6 space-y-2 border-y border-border py-4 text-sm">{cart.map((item) => { const product = products.find((entry) => entry.id === item.productId); return product ? <div key={`${item.productId}-${item.color}-${item.size}`} className="flex justify-between gap-4"><span>{product.name} / {item.color} / {item.size} × {item.quantity}</span><span>{money(product.price * item.quantity)}</span></div> : null; })}<div className="flex justify-between pt-3 font-bold"><span>Total</span><span>{money(totals.total)}</span></div></div><form className="mt-6 grid gap-4" onSubmit={submitOrder}><Field label="Full name"><input required name="name" maxLength={100} /></Field><Field label="WhatsApp number"><input required name="phone" maxLength={30} placeholder="+258 84 xxx xxxx" /></Field><Field label="Location / delivery area"><input required name="location" maxLength={150} /></Field><Field label="Payment method"><select required name="payment" value={payment} onChange={(event) => setPayment(event.target.value)}><option value="">Select</option>{Object.keys(paymentDetails).map((method) => <option key={method}>{method}</option>)}</select></Field>{payment && <div className="bg-secondary p-4 text-sm leading-relaxed"><span className="eyebrow">{t("Payment details", "Dados de pagamento")}</span><div className="mt-2">{(paymentDetails[payment] ?? []).map((line) => <p key={line}>{line}</p>)}</div><p className="mt-3 text-muted-foreground">{t("Keep your proof of payment. Your order is confirmed after receipt is verified.", "Guarda o comprovativo. O pedido será confirmado após a verificação do pagamento.")}</p></div>}<Field label="Payment status"><select required name="status"><option value="">Select</option><option>{t("I have already paid", "Já efectuei o pagamento")}</option><option>{t("I will pay after sending the order", "Pagarei depois de enviar o pedido")}</option></select></Field><Field label="Note (optional)"><textarea name="note" rows={3} maxLength={500} /></Field><Button size="lg" className="mt-2 w-full" type="submit">{t("Send order to WhatsApp", "Enviar pedido pelo WhatsApp")}</Button></form></div></div>}
      {notice && <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 bg-primary px-5 py-3 font-label text-xs font-bold uppercase tracking-[0.1em] text-primary-foreground">{notice}</div>}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-2 font-label text-[0.65rem] font-bold uppercase tracking-[0.12em]">{label}<div className="field-control">{children}</div></label>;
}

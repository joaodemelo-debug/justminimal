import { useRef, useState } from "react";

export function ProductGallery({ name, photos }: { name: string; photos: string[] }) {
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const go = (next: number) => { const el = ref.current; if (!el) return; const i = Math.max(0, Math.min(photos.length - 1, next)); el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" }); };
  return (
    <div className="relative bg-secondary">
      <div ref={ref} onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))} className="flex h-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label={`${name} photos`}>
        {photos.map((src, i) => <img key={src} src={src} alt={`${name} photo ${i + 1}`} width={1024} height={1280} className="aspect-[4/5] w-full shrink-0 snap-center object-cover md:aspect-auto md:h-full" />)}
      </div>
      {photos.length > 1 && <>
        <button onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous photo" className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/90 px-3 py-2 font-bold disabled:opacity-0">‹</button>
        <button onClick={() => go(index + 1)} disabled={index === photos.length - 1} aria-label="Next photo" className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/90 px-3 py-2 font-bold disabled:opacity-0">›</button>
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">{photos.map((src, i) => <button key={src} onClick={() => go(i)} aria-label={`Photo ${i + 1}`} className={`h-1.5 w-6 ring-1 ${i === index ? "bg-primary ring-background/70" : "bg-background/80 ring-black/25"}`} />)}</div>
      </>}
    </div>
  );
}

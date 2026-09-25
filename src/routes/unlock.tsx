import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { FormEvent, useState } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { unlockStore } from "@/lib/storefront.functions";
import logoImage from "@/assets/just-minimal-logo.png.asset.json";

export const Route = createFileRoute("/unlock")({
  head: () => ({ meta: [
    { title: "Private Access — Just Minimal" },
    { name: "description", content: "Private access to the Just Minimal community collection." },
    { property: "og:title", content: "Private Access — Just Minimal" },
    { property: "og:description", content: "Private access to the Just Minimal community collection." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: UnlockPage,
});

function UnlockPage() {
  const unlock = useServerFn(unlockStore);
  const router = useRouter();
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const password = String(new FormData(event.currentTarget).get("password") ?? "");
    const result = await unlock({ data: { password } });
    if (result.ok) await router.navigate({ to: "/" });
    else { setError(true); setBusy(false); }
  }

  return <main className="grid min-h-screen place-items-center bg-background px-5 py-12 text-foreground">
    <div className="w-full max-w-md border-y border-border py-10 text-center">
      <img src={logoImage.url} alt="Just Minimal" width={768} height={768} className="mx-auto mb-10 h-24 w-auto object-contain" />
      <LockKeyhole className="mx-auto size-6" aria-hidden="true" />
      <span className="eyebrow mt-5 block">Community access</span>
      <h1 className="mt-3 font-display text-4xl font-semibold">Private collection.</h1>
      <form className="mt-8 grid gap-3" onSubmit={submit}>
        <label className="text-left font-label text-[0.65rem] font-bold uppercase tracking-[0.12em]">Access password<div className="field-control mt-2"><input name="password" type="password" autoComplete="current-password" required maxLength={100} autoFocus /></div></label>
        {error && <p className="text-left text-sm text-destructive">Incorrect password. Try again.</p>}
        <Button size="lg" className="mt-2 w-full gap-2" type="submit" disabled={busy}>{busy ? "Opening…" : "Enter collection"}<ArrowRight size={16} /></Button>
      </form>
    </div>
  </main>;
}
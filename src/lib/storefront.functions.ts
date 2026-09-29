import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";
import baggyImage from "@/assets/baggy-sweatpants.png.asset.json";
import cropImage from "@/assets/crop-tee.png.asset.json";
import cropTopBlackImage from "@/assets/crop-top-black.png.asset.json";
import cropTopWhiteImage from "@/assets/crop-top-white.png.asset.json";
import hatImage from "@/assets/trucker-hat.png.asset.json";
import interiorImage from "@/assets/interior-tee.png.asset.json";
import logoImage from "@/assets/just-minimal-logo.png.asset.json";
import zipImage from "@/assets/quarter-zip.png.asset.json";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  original: number;
  discount: number;
  description: string;
  image: string;
  images?: Record<string, string>;
  colors: string[];
  sizes: string[];
  stock?: Record<string, number>;
  variantStock?: Record<string, number>;
};

type GateSession = { unlocked?: boolean };

function sessionConfig() {
  return {
    password: process.env['SESSION_SECRET']!,
    name: "just-minimal-access",
    maxAge: 60 * 60 * 24 * 30,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

function passwordMatches(input: string, expected: string) {
  const inputHash = createHash("sha256").update(input, "utf8").digest();
  const expectedHash = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(inputHash, expectedHash);
}

async function requireUnlocked() {
  const session = await useSession<GateSession>(sessionConfig());
  if (!session.data.unlocked) throw redirect({ to: "/unlock" });
}

export const unlockStore = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => ({ password: String(data.password).slice(0, 100) }))
  .handler(async ({ data }) => {
    const expected = process.env['SITE_PASSWORD'];
    if (!expected || !passwordMatches(data.password, expected)) return { ok: false as const };
    const session = await useSession<GateSession>(sessionConfig());
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const getStorefrontData = createServerFn({ method: "GET" }).handler(async () => {
  await requireUnlocked();
  const products: Product[] = [
    { id: "baggy", name: "Baggy Sweatpants", category: "BOTTOMS", price: 1800, original: 2400, discount: 25, description: "Relaxed baggy fit designed for everyday movement.", image: baggyImage.url, colors: ["Azul escuro", "Cinza", "Preto"], sizes: ["M", "L", "XL"], stock: { M: 2, L: 3, XL: 1 } },
    { id: "zip", name: "Quarter Zip", category: "OUTERWEAR", price: 1800, original: 2400, discount: 25, description: "A clean layering piece built around the Just Minimal silhouette.", image: zipImage.url, colors: ["Preto", "Cinza"], sizes: ["M", "L", "XL"] },
    { id: "crop", name: "Crop Tee", category: "TOPS", price: 940, original: 1400, discount: 33, description: "Minimal cropped silhouette designed to be styled effortlessly.", image: cropImage.url, colors: ["Branco", "Preto"], sizes: ["S", "M", "L", "XL"] },
    { id: "interior", name: "Regatta Tee", category: "TOPS", price: 780, original: 1080, discount: 27.7, description: "Minimal everyday tee with a community-only price.", image: interiorImage.url, colors: ["Preto", "Branco"], sizes: ["S", "M", "L", "XL"] },
    { id: "hat", name: "Trucker Hat", category: "ACCESSORIES", price: 680, original: 1080, discount: 40, description: "The Just Minimal Trucker Hat. Community offer.", image: hatImage.url, colors: ["Rosa", "Preto"], sizes: ["ONE SIZE"] },
    { id: "crop-top", name: "Crop Top Feminino", category: "WOMEN", price: 400, original: 680, discount: 41, description: "Crop top feminino Just Minimal, disponível em edição limitada.", image: cropTopBlackImage.url, images: { Preto: cropTopBlackImage.url, Branco: cropTopWhiteImage.url }, colors: ["Preto", "Branco"], sizes: ["S", "M"], variantStock: { "Preto:S": 1, "Preto:M": 1, "Branco:M": 2 } },
  ];
  return {
    products,
    logo: logoImage.url,
    communityUrl: "https://chat.whatsapp.com/CnEffGahKia2F0Y2F2mE6i?mode=gi_t",
    paymentDetails: {
      "M-Pesa": ["M-Pesa: 85 150 6799", "Account name: João Massingue"],
      "e-Mola": ["e-Mola: 87 467 7196", "Account name: João de Melo *******"],
      "Bank Transfer": ["Bank: MILLENIUMBIM", "Account: 1253924142", "NIB: 000100000125392414257", "Account name: João De Melo"],
    } as Record<string, string[]>,
  };
});
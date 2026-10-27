import { createServerFn } from "@tanstack/react-start";
import baggyImage from "@/assets/baggy-sweatpants.png.asset.json";
import sweatpantsImage from "@/assets/sweatpants.jpg.asset.json";
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

export const getStorefrontData = createServerFn({ method: "GET" }).handler(async () => {
  const products: Product[] = [
    { id: "baggy", name: "Baggy Sweatpants", category: "BOTTOMS", price: 2400, original: 2400, discount: 0, description: "Relaxed baggy fit designed for everyday movement.", image: baggyImage.url, colors: ["Azul escuro", "Cinza", "Preto"], sizes: ["M", "L", "XL"], stock: { M: 2, L: 3, XL: 1 } },
    { id: "sweatpants", name: "Sweatpants", category: "BOTTOMS", price: 2000, original: 2000, discount: 0, description: "Minimal sweatpants designed for everyday comfort and effortless styling.", image: sweatpantsImage.url, colors: ["Preto"], sizes: ["S", "M", "L", "XL", "2XL"] },
    { id: "zip", name: "Quarter Zip", category: "OUTERWEAR", price: 2400, original: 2400, discount: 0, description: "A clean layering piece built around the Just Minimal silhouette.", image: zipImage.url, colors: ["Preto", "Cinza"], sizes: ["M", "L", "XL"] },
    { id: "crop", name: "Boxy Crop Tee", category: "TOPS", price: 1400, original: 1400, discount: 0, description: "Minimal cropped silhouette designed to be styled effortlessly.", image: cropImage.url, colors: ["Branco", "Preto"], sizes: ["S", "M", "L", "XL"] },
    { id: "interior", name: "Regatta Tee", category: "TOPS", price: 1080, original: 1080, discount: 0, description: "Minimal everyday tee designed for effortless daily styling.", image: interiorImage.url, colors: ["Preto", "Branco"], sizes: ["S", "M", "L", "XL"] },
    { id: "hat", name: "Trucker Hat", category: "ACCESSORIES", price: 1080, original: 1080, discount: 0, description: "The Just Minimal Trucker Hat.", image: hatImage.url, colors: ["Rosa", "Preto"], sizes: ["ONE SIZE"] },
    { id: "crop-top", name: "Crop Top Feminino", category: "WOMEN", price: 680, original: 680, discount: 0, description: "Crop top feminino Just Minimal, disponível em edição limitada.", image: cropTopBlackImage.url, images: { Preto: cropTopBlackImage.url }, colors: ["Preto"], sizes: ["S", "M", "XL"], stock: { S: 4, M: 1, XL: 1 }, variantStock: { "Preto:S": 4, "Preto:M": 1, "Preto:XL": 1 } },
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
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline" | "ghost" | "icon";
};

export function Button({ className, variant = "solid", ...props }: ButtonProps) {
  const variants = {
    solid: "bg-primary text-primary-foreground hover:bg-primary/85",
    outline: "border border-border bg-transparent text-foreground hover:bg-secondary",
    ghost: "bg-transparent text-foreground hover:bg-secondary",
    icon: "size-10 bg-transparent text-foreground hover:bg-secondary",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-label text-[0.68rem] font-bold uppercase tracking-[0.14em] transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
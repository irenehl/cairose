import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type CairoseWordmarkProps = {
  href?: string;
  className?: string;
  markSize?: number;
};

export function CairoseWordmark({
  href = "/",
  className,
  markSize = 36,
}: CairoseWordmarkProps) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <Image
        src="/isotipo-provisional-I1a.svg"
        alt=""
        width={markSize}
        height={markSize}
        priority
      />
      <span className="font-[family-name:var(--cao-font-display)] text-[1.35rem] font-extrabold tracking-tight text-[var(--cao-color-ink)]">
        cairose
      </span>
    </Link>
  );
}

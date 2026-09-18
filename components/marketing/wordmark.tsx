import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const WORDMARK = {
  "on-light": "/cairose-wordmark-on-light.svg",
  "on-dark": "/cairose-wordmark-on-dark.svg",
} as const;

type CairoseWordmarkProps = {
  href?: string;
  className?: string;
  variant?: keyof typeof WORDMARK;
};

export function CairoseWordmark({
  href = "/",
  className,
  variant = "on-light",
}: CairoseWordmarkProps) {
  return (
    <Link href={href} className={cn("inline-flex items-center", className)}>
      <Image
        src={WORDMARK[variant]}
        alt="cairose"
        width={140}
        height={32}
        priority
        className="h-8 w-auto"
      />
    </Link>
  );
}

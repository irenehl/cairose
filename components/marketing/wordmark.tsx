import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type CairoseWordmarkProps = {
  href?: string;
  className?: string;
};

export function CairoseWordmark({
  href = "/",
  className,
}: CairoseWordmarkProps) {
  return (
    <Link href={href} className={cn("inline-flex items-center", className)}>
      <Image
        src="/cairose-wordmark-on-light.svg"
        alt="cairose"
        width={140}
        height={32}
        priority
        className="h-8 w-auto"
      />
    </Link>
  );
}

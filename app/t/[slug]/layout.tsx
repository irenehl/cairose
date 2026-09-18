import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { DEMO_SLUG, casaLimonCopy } from "@/lib/storefront-copy";
import { StorefrontShell } from "./storefront-shell";

type Props = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug === DEMO_SLUG) {
    return { title: casaLimonCopy.shopName };
  }
  return { title: slug };
}

export default async function TenantLayout({ children, params }: Props) {
  const { slug } = await params;
  if (slug === "demo-amss") {
    notFound();
  }
  return <StorefrontShell>{children}</StorefrontShell>;
}

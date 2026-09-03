"use client";

import Image from "next/image";
import { useBrand } from "@/components/brand/BrandProvider";

export const BRAND_LOGO = "/brand/klick-berlin.png";

export function BrandMark({
  size = 36,
  showName = true,
  nameClassName,
  className,
}: {
  size?: number;
  showName?: boolean;
  nameClassName?: string;
  className?: string;
}) {
  const brand = useBrand();

  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <Image
        src={BRAND_LOGO}
        alt={brand.studioName}
        width={size}
        height={size}
        className="rounded-full bg-[#f3efe6] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
        priority
      />
      {showName ? (
        <span className={nameClassName}>{brand.studioName}</span>
      ) : null}
    </span>
  );
}

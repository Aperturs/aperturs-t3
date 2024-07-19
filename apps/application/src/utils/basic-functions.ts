import type { PostContentType } from "@aperturs/validators/post";
import { SocialTypes } from "@aperturs/validators/post";

export function defaultContent(content: string): PostContentType[] {
  return [
    {
      id: SocialTypes.DEFAULT,
      name: SocialTypes.DEFAULT,
      socialType: SocialTypes.DEFAULT,
      content: content,
      unique: true,
      files: [],
      uploadedFiles: [],
    },
  ];
}

export function formatPrice(priceInCents: string) {
  const price = parseFloat(priceInCents);
  const dollars = price / 100;

  return new Intl.NumberFormat("en-US", {
    // style: "currency",
    // currency: "USD",
    // Use minimumFractionDigits to handle cases like $59.00 -> $59
    minimumFractionDigits: dollars % 1 !== 0 ? 2 : 0,
  }).format(dollars);
}

export function formatDate(date: string | number | Date | null | undefined) {
  if (!date) return "";

  return new Date(date).toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

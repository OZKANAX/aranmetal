import { notFound } from "next/navigation";

// Eşleşmeyen tüm yollar dil layout'u içinde 404 gösterir.
export default function CatchAll() {
  notFound();
}

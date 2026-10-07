import "server-only";
import { revalidatePath } from "next/cache";

/** Sitenin tüm dil sayfalarını ve admin görünümlerini yeniler. */
export function revalidateSite() {
  revalidatePath("/[locale]", "layout");
  revalidatePath("/admin", "layout");
}

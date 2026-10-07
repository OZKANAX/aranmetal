import { Badge } from "@/components/ui/badge";
import { QUOTE_STATUS_LABELS, type QuoteStatus } from "@/lib/quote-status";

const styles: Record<QuoteStatus, string> = {
  new: "bg-primary/15 text-primary border-primary/30",
  in_progress: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  done: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

export function QuoteStatusBadge({ status }: { status: string }) {
  const s = (status in styles ? status : "new") as QuoteStatus;
  return (
    <Badge variant="outline" className={styles[s]}>
      {QUOTE_STATUS_LABELS[s]}
    </Badge>
  );
}

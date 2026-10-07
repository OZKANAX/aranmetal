import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus } from "lucide-react";
import { db } from "@/lib/db";
import { moveSlide, toggleSlidePublished } from "@/lib/actions/admin/slides";
import { PageHeader } from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Slider" };

export default async function SlidesAdminPage() {
  const slides = await db.slide.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });

  return (
    <>
      <PageHeader title="Slider" description="Anasayfanın en üstündeki slaytlar. Yukarıdaki slayt önce gösterilir.">
        <Link href="/admin/slides/new" className={buttonVariants({ size: "lg" })}>
          <Plus />
          Yeni Slayt
        </Link>
      </PageHeader>

      {slides.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">
          Henüz slayt yok. Slayt eklenene kadar anasayfada “Hero Şeridi” içeriği tek görsel olarak gösterilir.
        </Card>
      ) : (
        <div className="grid gap-3">
          {slides.map((s, i) => (
            <Card key={s.id} className="flex flex-row items-center gap-4 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.image} alt="" className="h-20 w-36 shrink-0 rounded object-cover" />
              <div className="min-w-0 flex-1">
                <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {String(i + 1).padStart(2, "0")} · {s.eyebrowTr || "—"}
                </div>
                <Link href={`/admin/slides/${s.id}`} className="block truncate font-medium hover:text-primary">
                  {s.titleTr} <span className="text-primary">{s.highlightTr}</span>
                </Link>
                <div className="truncate text-xs text-muted-foreground">
                  {s.titleEn} {s.highlightEn}
                </div>
              </div>
              <div className="hidden sm:block">
                {s.published ? <Badge>Yayında</Badge> : <Badge variant="secondary">Gizli</Badge>}
              </div>
              <div className="flex items-center gap-1">
                <form action={moveSlide}>
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="dir" value="up" />
                  <Button type="submit" variant="ghost" size="icon-sm" disabled={i === 0} aria-label="Yukarı taşı">
                    <ArrowUp />
                  </Button>
                </form>
                <form action={moveSlide}>
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="dir" value="down" />
                  <Button type="submit" variant="ghost" size="icon-sm" disabled={i === slides.length - 1} aria-label="Aşağı taşı">
                    <ArrowDown />
                  </Button>
                </form>
                <form action={toggleSlidePublished}>
                  <input type="hidden" name="id" value={s.id} />
                  <Button type="submit" variant="ghost" size="icon-sm" aria-label={s.published ? "Gizle" : "Yayınla"}>
                    {s.published ? <EyeOff /> : <Eye />}
                  </Button>
                </form>
                <Link href={`/admin/slides/${s.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                  <Pencil />
                  <span className="hidden md:inline">Düzenle</span>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

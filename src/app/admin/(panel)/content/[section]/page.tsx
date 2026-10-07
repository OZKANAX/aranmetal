import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isSectionKey, sections } from "@/lib/content/schema";
import { getStoredSection } from "@/lib/content/queries";
import { PageHeader } from "@/components/admin/PageHeader";
import { SectionForm } from "@/components/admin/SectionForm";

export async function generateMetadata({ params }: PageProps<"/admin/content/[section]">): Promise<Metadata> {
  const { section } = await params;
  return { title: isSectionKey(section) ? sections[section].title : "İçerik" };
}

export default async function SectionEditPage({ params }: PageProps<"/admin/content/[section]">) {
  const { section } = await params;
  if (!isSectionKey(section)) notFound();

  const def = sections[section];
  const stored = await getStoredSection(section);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title={def.title} description={def.description} />
      <SectionForm sectionKey={section} fields={def.fields} stored={stored} />
    </div>
  );
}

import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { PageHeader } from "@/components/admin/PageHeader";
import { AccountForm } from "@/components/admin/AccountForm";

export const metadata: Metadata = { title: "Hesap" };

export default async function AccountPage() {
  const session = await requireAdmin();
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Hesap" description={session.email} />
      <AccountForm name={session.name} />
    </div>
  );
}

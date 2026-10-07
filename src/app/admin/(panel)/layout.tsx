import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AppSidebar } from "@/components/admin/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const newQuotes = await db.quoteRequest.count({ where: { status: "new" } });

  return (
    <SidebarProvider>
      <AppSidebar user={{ name: session.name, email: session.email }} newQuotes={newQuotes} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <AdminBreadcrumb />
        </header>
        <div className="flex-1 p-4 md:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Giriş" };

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { next } = await searchParams;

  return (
    <div className="relative min-h-svh flex items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(223,115,49,0.18),transparent)]" />
      <svg
        className="absolute -right-24 top-0 h-full w-1/2 text-primary opacity-10 pointer-events-none"
        viewBox="0 0 400 600"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <polygon fill="currentColor" points="200,0 400,0 280,380 180,380" />
        <polygon fill="currentColor" points="80,0 190,0 340,550 240,550" />
      </svg>

      <div className="relative w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-dark.svg" alt="Aran Metal" className="h-16 w-auto" />
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {"// "}Yönetim Paneli
          </p>
        </div>
        <LoginForm next={typeof next === "string" ? next : ""} />
      </div>
    </div>
  );
}

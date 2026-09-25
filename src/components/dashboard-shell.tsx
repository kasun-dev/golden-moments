import { Link, useNavigate } from "@tanstack/react-router";
import { CalendarDays, LayoutDashboard, LogOut, Sparkles, Users } from "lucide-react";
import type { ReactNode } from "react";
import { Brand } from "./brand";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";

export function DashboardShell({ children, eyebrow, title, portal = false }: { children: ReactNode; eyebrow: string; title: string; portal?: boolean }) {
  const navigate = useNavigate();
  async function signOut() {
    await supabase.auth.signOut();
    await navigate({ to: "/auth", replace: true });
  }
  return (
    <div className="min-h-screen bg-canvas text-foreground lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="border-b border-border bg-sidebar px-5 py-5 lg:min-h-screen lg:border-b-0 lg:border-r">
        <Brand />
        <nav className="mt-8 flex gap-2 lg:flex-col">
          <Link to={portal ? "/portal/$eventId" : "/dashboard"} params={portal ? { eventId: "8d76b92e-25e8-4f76-b7e0-b6d974a66e41" } : undefined} className="nav-item" activeProps={{ className: "nav-item nav-item-active" }}>
            <LayoutDashboard /> Overview
          </Link>
          {!portal && <Link to="/dashboard/events/$id" params={{ id: "8d76b92e-25e8-4f76-b7e0-b6d974a66e41" }} className="nav-item"><Users /> Guest list</Link>}
        </nav>
        <div className="mt-7 border-t border-border pt-5 lg:absolute lg:bottom-6">
          <Button variant="ghost" size="sm" onClick={signOut}><LogOut /> Sign out</Button>
        </div>
      </aside>
      <main>
        <header className="flex items-center justify-between border-b border-border px-5 py-5 sm:px-8 lg:px-12">
          <div><p className="eyebrow">{eyebrow}</p><h1 className="mt-1 font-display text-3xl sm:text-4xl">{title}</h1></div>
          <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex"><CalendarDays className="size-4 text-gold" /> Friday, 25 September</div>
        </header>
        <div className="p-5 sm:p-8 lg:p-12">{children}</div>
      </main>
    </div>
  );
}

export function Metric({ label, value, note, icon = "sparkles" }: { label: string; value: string; note: string; icon?: "sparkles" | "users" }) {
  const Icon = icon === "users" ? Users : Sparkles;
  return <div className="metric"><div className="flex items-center justify-between"><span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</span><Icon className="size-4 text-gold" /></div><strong className="mt-5 block font-display text-4xl font-normal">{value}</strong><span className="mt-1 block text-xs text-muted-foreground">{note}</span></div>;
}
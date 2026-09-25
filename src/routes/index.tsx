import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarHeart, Check, ChevronDown, Gem, MessageCircle, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Brand, Mandala } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { templates } from "@/lib/moments-data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Moments by Studio Click.ed — Digital Wedding Invitations Sri Lanka" },
    { name: "description", content: "Beautiful digital wedding invitations, household RSVPs and guest management made for Sri Lankan celebrations." },
    { property: "og:title", content: "Moments by Studio Click.ed" },
    { property: "og:description", content: "An exquisite digital beginning to your wedding celebration." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}), component: Storefront,
});

function Storefront() {
  const [guests, setGuests] = useState(150);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const price = useMemo(() => 29500 + Math.max(0, guests - 100) * 85, [guests]);
  async function submitLead(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSending(true);
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const dates = String(form.get("dates") ?? "");
    const count = Number(form.get("guests") ?? 0);
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now().toString().slice(-5)}`;
    const { error } = await supabase.from("events").insert({ title: `${name}'s Wedding`, contact_name: name, slug, event_dates: dates ? [{ date: dates }] : [], estimated_guests: count, status: "lead" });
    setSending(false); if (!error) setSubmitted(true);
  }
  return <main className="bg-background text-foreground">
    <section className="relative min-h-[92svh] overflow-hidden bg-primary text-primary-foreground">
      <Mandala className="pointer-events-none absolute -right-32 top-20 w-[38rem] text-gold opacity-15" />
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8"><Brand light /><div className="flex items-center gap-2"><Link to="/auth" className="hidden px-4 py-2 text-xs uppercase tracking-[0.14em] sm:block">Client sign in</Link><a href="#consultation" className="border border-gold px-4 py-2 text-xs uppercase tracking-[0.14em] text-gold">Enquire</a></div></nav>
      <div className="relative z-10 mx-auto flex min-h-[72svh] max-w-7xl items-center px-5 py-12 sm:px-8">
        <div className="max-w-4xl reveal"><p className="eyebrow">Digital invitations, beautifully considered</p><h1 className="mt-7 max-w-3xl font-display text-6xl leading-[1.02] sm:text-7xl lg:text-8xl">Your celebration,<br/><em className="font-normal text-gold">thoughtfully told.</em></h1><p className="mt-7 max-w-xl text-base leading-7 text-primary-foreground/65">Couture digital invitations and effortless guest management for Sri Lanka’s most meaningful celebrations.</p><div className="mt-10 flex flex-wrap gap-3"><a href="#templates"><Button variant="gold" size="xl">Explore designs <ArrowRight /></Button></a><a href="#pricing"><Button variant="outline" size="xl" className="border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">Calculate price</Button></a></div></div>
      </div>
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 border-t border-primary-foreground/10 px-5 sm:grid-cols-3 sm:px-8">{[[CalendarHeart,"Multi-day ready","One invitation for every ceremony."],[Users,"Household RSVP","Every guest, beautifully accounted for."],[MessageCircle,"WhatsApp delivery","Personal invitations, sent with ease."]].map(([Icon,title,note])=><div key={String(title)} className="flex gap-4 border-primary-foreground/10 py-6 sm:border-r sm:px-6 first:pl-0 last:border-0"><Icon className="mt-1 size-5 text-gold"/><div><strong className="font-display text-lg font-normal">{String(title)}</strong><p className="mt-1 text-xs text-primary-foreground/55">{String(note)}</p></div></div>)}</div>
    </section>

    <section id="templates" className="mx-auto max-w-7xl px-5 py-24 sm:px-8"><div className="mb-12 flex items-end justify-between"><div><p className="eyebrow">The invitation collection</p><h2 className="mt-4 font-display text-4xl sm:text-5xl">Three distinct expressions</h2></div><span className="hidden text-xs text-muted-foreground sm:block">01 — 03</span></div><div className="grid gap-5 md:grid-cols-3">{templates.map((item,index)=><article key={item.id} className="group"><div className={`${item.className} relative aspect-[3/4] overflow-hidden p-7`}><Mandala className="absolute left-1/2 top-1/2 w-64 -translate-x-1/2 -translate-y-1/2 opacity-20 transition-transform duration-700 group-hover:scale-110"/><div className="relative flex h-full flex-col items-center justify-between border border-current/30 p-5 text-center"><span className="text-[9px] uppercase tracking-[.2em]">Studio Click.ed presents</span><div><p className="font-invitation text-xl italic">Together with their families</p><h3 className="my-4 font-display text-4xl">A & D</h3><span className="text-xs uppercase tracking-[.18em]">28 • 11 • 2026</span></div><span className="text-[9px] uppercase tracking-[.2em]">Kandy, Sri Lanka</span></div></div><div className="pt-5"><span className="text-xs text-muted-foreground">0{index+1}</span><h3 className="mt-1 font-display text-2xl">{item.name}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.note}</p></div></article>)}</div></section>

    <section id="pricing" className="bg-primary py-24 text-primary-foreground"><div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Transparent pricing</p><h2 className="mt-4 font-display text-5xl">One celebration.<br/>No surprises.</h2><p className="mt-6 max-w-md text-sm leading-7 text-primary-foreground/60">Your complete invitation experience includes design, guest import, household RSVPs and WhatsApp-ready links.</p></div><div className="border border-primary-foreground/15 p-7 sm:p-10"><div className="flex items-end justify-between"><label htmlFor="guest-count" className="text-xs uppercase tracking-[.16em]">Invited guests</label><strong className="font-display text-4xl font-normal text-gold">{guests}</strong></div><input id="guest-count" type="range" min="50" max="500" step="10" value={guests} onChange={e=>setGuests(Number(e.target.value))} className="mt-8 w-full accent-[var(--gold)]"/><div className="mt-4 flex justify-between text-xs text-primary-foreground/40"><span>50</span><span>500</span></div><div className="mt-9 flex items-end justify-between border-t border-primary-foreground/15 pt-8"><div><span className="text-xs uppercase tracking-[.16em] text-primary-foreground/50">Estimated investment</span><p className="mt-2 text-xs text-primary-foreground/40">All essentials included</p></div><div className="text-right"><span className="font-display text-4xl text-gold">LKR {price.toLocaleString()}</span><span className="block text-[10px] text-primary-foreground/40">starting from</span></div></div></div></div></section>

    <section id="consultation" className="relative overflow-hidden px-5 py-24 sm:px-8"><Mandala className="absolute -bottom-40 -left-40 w-[34rem] text-gold opacity-10"/><div className="relative mx-auto grid max-w-5xl gap-14 lg:grid-cols-2"><div><p className="eyebrow">Begin your story</p><h2 className="mt-4 font-display text-5xl">Let’s create something unforgettable.</h2><p className="mt-6 text-sm leading-7 text-muted-foreground">Tell us a little about your celebration. We’ll be in touch with a considered recommendation.</p></div>{submitted?<div className="grid min-h-80 place-items-center border border-border bg-card p-10 text-center"><div><span className="mx-auto grid size-14 place-items-center rounded-full bg-primary text-primary-foreground"><Check/></span><h3 className="mt-6 font-display text-3xl">Your story starts here.</h3><p className="mt-3 text-sm text-muted-foreground">We’ll be in touch shortly.</p></div></div>:<form onSubmit={submitLead} className="space-y-7 border-t border-border pt-2"><label className="block text-xs uppercase tracking-[.14em]">Your name<input required name="name" className="field" placeholder="e.g. Amaya Perera"/></label><label className="block text-xs uppercase tracking-[.14em]">Celebration date<input required name="dates" type="date" className="field"/></label><label className="block text-xs uppercase tracking-[.14em]">Estimated guests<input required name="guests" type="number" min="10" className="field" placeholder="150"/></label><Button disabled={sending} variant="gold" size="xl" className="w-full">{sending?"Sending…":"Request a consultation"}<ArrowRight/></Button></form>}</div></section>
    <footer className="border-t border-border px-5 py-8 sm:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><Brand/><p className="text-xs text-muted-foreground">Designed for distinction in Colombo, Sri Lanka.</p><a href="mailto:hello@studioclicked.lk" className="text-xs">hello@studioclicked.lk</a></div></footer>
  </main>;
}
import { useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
import SplitText from "@/components/SplitText";
import CountUp from "@/components/CountUp";
import HoloCard from "@/components/HoloCard";
import Tile from "@/components/Tile";
import { byId, STOCK } from "@/data/stock";
import { useStore } from "@/lib/store";

gsap.registerPlugin(ScrollTrigger);

const HERO = ["sv3pt5-200", "sv8pt5-161", "sv3pt5-199"].map((id) => byId(id)!);
const PACK = ["sv3pt5-198", "swsh7-215", "sv4pt5-232", "swsh4-188", "sv3-223"].map((id) => byId(id)!);
const TOP = [...STOCK].sort((a, b) => b.usd - a.usd).slice(0, 8);
const COPIES = STOCK.reduce((s, c) => s + c.qty, 0);
const SETS = new Set(STOCK.map((c) => c.set)).size;
const OLDEST = Math.min(...STOCK.map((c) => c.year));

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  const { price } = useStore();
  const lead = HERO[1];

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // one entrance: the copy and the mat rise together
      gsap.from(".hero-in", { y: 10, opacity: 0, duration: 0.5, stagger: 0.05, delay: 0.3 });
      gsap.from(".hero-card", { y: 24, opacity: 0, duration: 0.6, stagger: 0.06, delay: 0.2 });

      // the pack opens as you scroll: the story of the shop in one moment
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: ".pack-stage", start: "top top", end: "+=1600", scrub: 0.6, pin: true },
      });
      tl.to(".pack-crimp", { yPercent: -120, rotate: -6, opacity: 0, duration: 1 })
        .to(".pack-body", { yPercent: 60, opacity: 0, duration: 1 }, 0.5)
        .fromTo(".pack-card", { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.8 }, 0.6)
        .to(".pack-card", {
          x: (i) => `${(i - 2) * 108}%`,
          rotate: (i) => (i - 2) * 4,
          y: (i) => Math.abs(i - 2) * 16,
          duration: 1.4, ease: "power2.inOut",
        }, ">-0.1")
        .from(".pack-caption", { opacity: 0, y: 8, duration: 0.5 }, "<0.8");
    });
  }, { scope: root });

  return (
    <div ref={root}>
      {/* ---------- hero: copy on the left, the play mat on the right ---------- */}
      <section className="mx-auto grid min-h-[100svh] max-w-[1280px] items-center gap-12 px-6 pb-16 pt-28 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div>
          <p className="hero-in font-mono text-[12px] text-ink-3">{STOCK.length} cards in stock · {OLDEST} to today</p>
          <SplitText
            tag="h1"
            text="Single Pokémon cards, checked and sleeved"
            className="mt-4 max-w-[13ch] font-serif text-[44px] leading-[1.04] tracking-[-0.02em] sm:text-[64px] sm:tracking-[-0.03em]"
            splitType="words"
            effect="fade"
            trigger="load"
            delay={40}
            duration={0.5}
            textAlign="left"
          />
          <p className="hero-in mt-6 max-w-[36rem] text-[18px] leading-[28px] text-ink-2">
            Raw and graded singles, from Base Set holos to this year’s illustration rares. Every card ships in a penny sleeve and top-loader, priced in rupees, dollars, euros or pounds.
          </p>
          <div className="hero-in mt-8 flex flex-wrap gap-3">
            <Link to="/shop" className="btn btn-primary">
              Shop all cards
              <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
            <a href="#pack" className="btn btn-secondary">Open a pack</a>
          </div>
        </div>

        <div className="relative rounded-[20px] bg-felt p-8 sm:p-12">
          <div aria-hidden className="absolute inset-0 rounded-[20px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06),inset_0_24px_48px_-24px_rgba(0,0,0,0.35)]" />
          <div className="relative grid grid-cols-[1fr_1.25fr_1fr] items-end gap-3 sm:gap-5">
            {HERO.map((card, i) => (
              <Link key={card.id} to={`/card/${card.id}`} className={`hero-card relative block ${i === 1 ? "" : "mb-6"}`}>
                <HoloCard card={card} eager large={i === 1} />
                {i === 1 && (
                  <span className="sticker absolute -bottom-2 right-3">
                    {price(card.usd)}
                    <small>NM</small>
                  </span>
                )}
              </Link>
            ))}
          </div>
          <div className="relative mt-8 flex items-baseline justify-between gap-4 text-[13px] text-white/70">
            <span>{lead.name} · {lead.set}</span>
            <span className="font-mono">{lead.rarity}</span>
          </div>
        </div>
      </section>

      {/* ---------- pack opening ---------- */}
      <section id="pack" className="pack-stage relative flex h-[100svh] flex-col items-center justify-center overflow-hidden border-y border-hair bg-raised">
        <p className="absolute top-24 text-[14px] text-ink-2">Scroll to open</p>
        <div className="relative h-[300px] w-[186px] sm:h-[400px] sm:w-[248px]">
          {PACK.map((card, i) => (
            <div key={card.id} className="pack-card absolute inset-x-0 top-0 opacity-0" style={{ zIndex: i }}>
              <HoloCard card={card} interactive={false} />
            </div>
          ))}
          <div className="pack-body absolute inset-0 z-10 flex flex-col items-center justify-end overflow-hidden rounded-[10px] bg-[linear-gradient(180deg,#22654f,#1a4f40)] pb-10 text-white shadow-[0_12px_28px_-14px_rgba(31,27,22,0.4)]">
            <span aria-hidden className="mb-4 h-[36px] w-[26px] rounded-[4px] bg-white/90" />
            <p className="font-serif text-[36px] leading-none">Holofoil</p>
            <p className="mt-3 font-mono text-[12px] text-white/70">5 cards · all hits</p>
          </div>
          <div className="pack-crimp absolute inset-x-0 top-0 z-20 h-10 rounded-t-[10px] bg-[#1a4f40] [clip-path:polygon(0_0,100%_0,100%_75%,95%_100%,90%_75%,85%_100%,80%_75%,75%_100%,70%_75%,65%_100%,60%_75%,55%_100%,50%_75%,45%_100%,40%_75%,35%_100%,30%_75%,25%_100%,20%_75%,15%_100%,10%_75%,5%_100%,0_75%)]" />
        </div>
        <p className="pack-caption absolute bottom-16 max-w-sm px-6 text-center text-[15px] text-ink-2">
          Five cards from the case, no bulk. Each one is in stock now.
        </p>
      </section>

      {/* ---------- stock figures ---------- */}
      <section className="mx-auto mt-24 grid max-w-[1280px] gap-4 px-6 sm:grid-cols-3 sm:px-8">
        {[
          { to: COPIES, label: "copies in stock" },
          { to: SETS, label: "sets represented" },
          { to: OLDEST, label: "oldest card, Base Set", plain: true },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-card p-6 shadow-[inset_0_0_0_1px_var(--color-hair)]">
            <CountUp to={s.to} from={s.plain ? s.to - 20 : 0} separator={s.plain ? "" : ","} duration={1.2} className="tnum font-serif text-[48px] leading-none" />
            <p className="mt-3 text-[14px] text-ink-2">{s.label}</p>
          </div>
        ))}
      </section>

      {/* ---------- most valuable ---------- */}
      <section className="mx-auto mt-24 max-w-[1280px] px-6 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-[40px] leading-[1.1] tracking-[-0.02em]">The top of the case</h2>
            <p className="mt-2 text-ink-2">The eight most valuable cards in stock right now</p>
          </div>
          <Link to="/shop" className="btn btn-secondary btn-sm">See all {STOCK.length} cards</Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {TOP.map((card) => <Tile key={card.id} card={card} />)}
        </div>
      </section>
    </div>
  );
}

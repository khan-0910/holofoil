import { useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitText from "@/components/SplitText";
import Magnet from "@/components/Magnet";
import CountUp from "@/components/CountUp";
import ScrollVelocity from "@/components/ScrollVelocity";
import HoloCard from "@/components/HoloCard";
import { byId, CARDS, money } from "@/lib/cards";
import { useStore } from "@/lib/store";

gsap.registerPlugin(ScrollTrigger);

const HERO = ["umbreon-vmax", "charizard-ex", "pikachu-vmax", "gengar-vmax", "rayquaza-vmax"].map((id) => byId(id)!);
const PACK = ["blastoise-ex", "mewtwo-gx", "leafeon-vmax", "darkrai-vstar", "gardevoir-ex"].map((id) => byId(id)!);
const FEATURED = CARDS.filter((c) => c.rarity === "Secret Rare").slice(0, 6);

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  const { add, notify } = useStore();

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // hero: cards deal in from below and fan out
      gsap.from(".hero-card", {
        y: 420, rotate: 0, opacity: 0, duration: 1.4, stagger: 0.09, ease: "expo.out", delay: 0.25,
      });
      gsap.from(".hero-sub", { y: 24, opacity: 0, duration: 0.9, delay: 0.8, stagger: 0.1, ease: "power3.out" });
      // fan drifts apart as you scroll away
      gsap.to(".hero-fan", {
        yPercent: 18, scale: 0.92, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });

      // pinned pack opening
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ".pack-stage", start: "top top", end: "+=1800", scrub: 1, pin: true },
      });
      tl.to(".pack-top", { yPercent: -140, rotate: -14, opacity: 0, duration: 1, ease: "power2.in" })
        .to(".pack-body", { yPercent: 70, opacity: 0, duration: 1 }, 0.6)
        .fromTo(".pack-card", { y: 60, scale: 0.6, opacity: 0 }, { y: 0, scale: 1, opacity: 1, stagger: 0.15, duration: 1 }, 0.7)
        .to(".pack-card", {
          x: (i) => (i - 2) * 190,
          rotate: (i) => (i - 2) * 8,
          y: (i) => Math.abs(i - 2) * 24,
          stagger: 0.05, duration: 1.4, ease: "power3.inOut",
        }, ">-0.2")
        .from(".pack-caption", { opacity: 0, y: 30, duration: 0.6 }, "<0.6");

      // featured grid
      gsap.utils.toArray<HTMLElement>(".feat").forEach((el, i) => {
        gsap.from(el, {
          y: 120, rotate: i % 2 ? 6 : -6, opacity: 0, duration: 1.1, ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });
    });
    // smaller screens: pack cards fan tighter
    mm.add("(max-width: 700px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.set(".pack-row", { scale: 0.55 });
    });
  }, { scope: root });

  return (
    <div ref={root}>
      {/* ---------- hero ---------- */}
      <section className="hero relative flex min-h-[100svh] flex-col items-center overflow-hidden px-4 pt-32 text-center">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_20%,rgba(179,136,255,.22),transparent_70%),radial-gradient(40%_40%_at_80%_70%,rgba(95,212,255,.14),transparent),radial-gradient(40%_40%_at_15%_80%,rgba(255,95,162,.14),transparent)]" />
        <p className="hero-sub relative font-mono text-xs uppercase tracking-[0.3em] text-dim">Graded · Raw · Sealed-fresh pulls</p>
        <SplitText
          tag="h1"
          text="Pull the card, skip the pack."
          className="relative mt-5 max-w-4xl font-display text-[clamp(44px,9vw,120px)] font-extrabold leading-[0.92] tracking-[-0.04em]"
          splitType="chars"
          effect="rise"
          trigger="load"
          delay={30}
          duration={0.9}
          hoverEffect="wave"
        />
        <p className="hero-sub relative mt-6 max-w-lg text-lg text-dim">
          Hand-checked singles from the newest sets and the classics. Tilt a card to see the foil, then add it to your binder.
        </p>
        <div className="hero-sub relative mt-8 flex gap-3">
          <Magnet padding={60} magnetStrength={3}>
            <Link to="/shop" className="btn btn-lime text-lg">Shop all {CARDS.length} cards</Link>
          </Magnet>
          <a href="#pack" className="btn btn-ghost">Open a pack</a>
        </div>

        <div className="hero-fan relative mt-14 flex h-[340px] w-full max-w-4xl items-end justify-center sm:h-[400px]">
          {HERO.map((card, i) => (
            <div
              key={card.id}
              className="hero-card absolute bottom-0 w-[150px] sm:w-[210px]"
              style={{
                transform: `translateX(${(i - 2) * 64}%) rotate(${(i - 2) * 9}deg) translateY(${Math.abs(i - 2) * 22}px)`,
                zIndex: 10 - Math.abs(i - 2),
              }}
            >
              <Link to={`/card/${card.id}`} aria-label={card.name}>
                <HoloCard card={card} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- marquee ---------- */}
      <section className="border-y border-line bg-night-2 py-6" aria-hidden>
        <ScrollVelocity
          texts={["Charizard ex ✦ Umbreon VMAX ✦ Pikachu VMAX ✦ Rayquaza ✦ ", "PSA 10 ✦ Secret Rare ✦ Near Mint ✦ Alt Art ✦ "]}
          velocity={60}
          fontSize="clamp(28px,5vw,64px)"
          fontWeight={800}
          outlineAlternate
          gap={24}
          className="font-display tracking-tight"
        />
      </section>

      {/* ---------- pack opening ---------- */}
      <section id="pack" className="pack-stage relative flex h-[100svh] flex-col items-center justify-center overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_55%,rgba(212,255,58,.12),transparent_70%)]" />
        <p className="absolute top-28 font-mono text-xs uppercase tracking-[0.3em] text-dim">Keep scrolling to tear it open</p>
        <div className="pack-row relative flex h-[420px] w-[260px] items-center justify-center">
          {PACK.map((card, i) => (
            <div key={card.id} className="pack-card absolute w-[200px] opacity-0" style={{ zIndex: i }}>
              <HoloCard card={card} />
            </div>
          ))}
          <div className="pack-body absolute inset-0 z-10 overflow-hidden rounded-[22px] border border-white/20 bg-[linear-gradient(160deg,#ff5fa2,#7b2ff7_45%,#1d1a2c)] shadow-2xl">
            <div className="absolute inset-0 opacity-50 [background:repeating-linear-gradient(110deg,transparent_0_14px,rgba(255,255,255,.12)_14px_16px)]" />
            <div className="absolute inset-x-0 bottom-10 text-center">
              <p className="font-display text-5xl font-extrabold tracking-tight">HOLO</p>
              <p className="foil-text font-display text-5xl font-extrabold tracking-tight">FOIL</p>
              <p className="mt-2 font-mono text-[10px] tracking-[0.3em] text-white/70">5 CARD BOOSTER</p>
            </div>
          </div>
          <div className="pack-top absolute inset-x-0 top-0 z-20 h-16 rounded-t-[22px] border border-white/20 bg-[linear-gradient(180deg,#d4ff3a,#9ccc1f)] [clip-path:polygon(0_0,100%_0,100%_70%,92%_100%,84%_70%,76%_100%,68%_70%,60%_100%,52%_70%,44%_100%,36%_70%,28%_100%,20%_70%,12%_100%,4%_70%,0_100%)]" />
        </div>
        <p className="pack-caption absolute bottom-16 max-w-md px-6 text-center text-lg text-dim">
          Five hits, no bulk. Every one of these is in stock right now.
        </p>
      </section>

      {/* ---------- stats ---------- */}
      <section className="mx-auto grid max-w-6xl gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-3">
        {[
          { to: 24, suffix: "", label: "cards in stock today" },
          { to: 100, prefix: "$", label: "free shipping from" },
          { to: 48, suffix: "h", label: "to dispatch, sleeved and top-loaded" },
        ].map((s) => (
          <div key={s.label} className="bg-night-2 p-10">
            <CountUp to={s.to} prefix={s.prefix} suffix={s.suffix} duration={1.6} className="font-display text-7xl font-extrabold tracking-tight" />
            <p className="mt-2 text-dim">{s.label}</p>
          </div>
        ))}
      </section>

      {/* ---------- featured ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-28 sm:px-6">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-[clamp(36px,6vw,72px)] font-extrabold leading-none tracking-[-0.03em]">
            Secret rares,<br /><span className="foil-text">fresh in the case.</span>
          </h2>
          <Link to="/shop" className="btn btn-ghost">See everything</Link>
        </div>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
          {FEATURED.map((card) => (
            <article key={card.id} className="feat group">
              <Link to={`/card/${card.id}`}><HoloCard card={card} /></Link>
              <div className="mt-4 flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold">{card.name}</p>
                  <p className="text-sm text-dim">{card.condition}</p>
                </div>
                <button
                  className="rounded-full bg-night-3 px-3 py-1.5 font-mono text-sm transition-colors hover:bg-lime hover:text-night"
                  onClick={() => { add(card.id); notify(`${card.name} added to your binder`); }}
                  aria-label={`Add ${card.name} to cart`}
                >
                  {money(card.price)} +
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

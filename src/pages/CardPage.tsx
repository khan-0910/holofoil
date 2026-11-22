import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import HoloCard from "@/components/HoloCard";
import Magnet from "@/components/Magnet";
import { byId, CARDS, money, TYPE_STYLE } from "@/lib/cards";
import { useStore } from "@/lib/store";

export default function CardPage() {
  const { id = "" } = useParams();
  const card = byId(id);
  const { add, notify, setDrawer, cart } = useStore();
  const [qty, setQty] = useState(1);
  const root = useRef<HTMLDivElement>(null);
  const cardEl = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!card) return;
    gsap.from(cardEl.current, { rotateY: -180, scale: 0.6, opacity: 0, duration: 1.3, ease: "expo.out" });
    gsap.from(".info > *", { x: 40, opacity: 0, stagger: 0.07, duration: 0.8, ease: "power3.out", delay: 0.2 });
  }, { scope: root, dependencies: [id] });

  if (!card) {
    return (
      <div className="px-6 pb-24 pt-40 text-center">
        <p className="text-2xl font-bold">That card isn't in the case.</p>
        <Link to="/shop" className="btn btn-lime mt-6">Back to the shop</Link>
      </div>
    );
  }

  const t = TYPE_STYLE[card.type];
  const inCart = cart.find((l) => l.id === card.id)?.qty ?? 0;
  const left = card.stock - inCart;
  const related = CARDS.filter((c) => c.type === card.type && c.id !== card.id).slice(0, 4);

  const buy = () => {
    if (left <= 0) return;
    const n = Math.min(qty, left);
    add(card.id, n);
    notify(`${n} × ${card.name} added`);
    // fly a ghost of the card to the cart button
    const from = cardEl.current?.getBoundingClientRect();
    const to = document.querySelector("[aria-label^='Open cart']")?.getBoundingClientRect();
    if (from && to && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const ghost = document.createElement("div");
      ghost.style.cssText = `position:fixed;left:${from.left}px;top:${from.top}px;width:${from.width}px;height:${from.height}px;border-radius:16px;z-index:70;pointer-events:none;background:linear-gradient(160deg,${t.from},${t.to})`;
      document.body.appendChild(ghost);
      gsap.to(ghost, {
        left: to.left + to.width / 2 - 10, top: to.top + to.height / 2 - 14, width: 20, height: 28,
        rotate: 25, duration: 0.8, ease: "power3.in", onComplete: () => ghost.remove(),
      });
    }
  };

  return (
    <div ref={root} className="mx-auto max-w-6xl px-4 pb-24 pt-32 sm:px-6">
      <Link to="/shop" className="text-sm text-dim hover:text-bone">← Back to the case</Link>
      <div className="mt-8 grid items-center gap-12 md:grid-cols-2">
        <div className="relative [perspective:1200px]">
          <div aria-hidden className="absolute inset-[-10%] rounded-full blur-3xl" style={{ background: `radial-gradient(circle, ${t.from}55, transparent 65%)` }} />
          <div ref={cardEl} className="relative mx-auto w-full max-w-[380px]">
            <HoloCard card={card} />
          </div>
        </div>

        <div className="info">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-dim">{card.set} · {card.number} · {card.year}</p>
          <h1 className="mt-3 font-display text-[clamp(44px,7vw,84px)] font-extrabold leading-[0.95] tracking-[-0.04em]">{card.name}</h1>
          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full px-3 py-1 font-bold text-night" style={{ background: t.from }}>{t.label}</span>
            <span className="rounded-full border border-line px-3 py-1">{card.rarity}</span>
            <span className="rounded-full border border-line px-3 py-1">{card.condition}</span>
            <span className="rounded-full border border-line px-3 py-1">HP {card.hp}</span>
          </div>
          <p className="mt-8 font-display text-6xl font-extrabold">{money(card.price)}</p>
          <p className={`mt-2 text-sm ${left <= 2 ? "text-pink" : "text-dim"}`}>
            {left <= 0 ? "All copies are in your cart." : `${left} left in stock`}
          </p>

          <div className="mt-8 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-line">
              <button className="h-12 w-12 text-xl" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Fewer">−</button>
              <span className="w-8 text-center font-mono" aria-live="polite">{qty}</span>
              <button className="h-12 w-12 text-xl" onClick={() => setQty((q) => Math.min(Math.max(1, left), q + 1))} aria-label="More">+</button>
            </div>
            <Magnet padding={40} magnetStrength={4}>
              <button className="btn btn-lime px-8 text-lg disabled:opacity-40" disabled={left <= 0} onClick={buy}>
                Add to binder
              </button>
            </Magnet>
            <button className="btn btn-ghost" onClick={() => setDrawer(true)}>View cart</button>
          </div>

          <ul className="mt-10 space-y-2 border-t border-line pt-6 text-sm text-dim">
            <li>Ships in a penny sleeve and top-loader, inside a bubble mailer.</li>
            <li>Raw cards are checked under light for whitening, scratches and centring.</li>
            <li>Graded slabs are listed with the grade shown on the label.</li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-28">
          <h2 className="font-display text-3xl font-extrabold">More {t.label} cards</h2>
          <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
            {related.map((c) => (
              <Link key={c.id} to={`/card/${c.id}`}>
                <HoloCard card={c} />
                <p className="mt-3 font-bold">{c.name}</p>
                <p className="font-mono text-sm text-dim">{money(c.price)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

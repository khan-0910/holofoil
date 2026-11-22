import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import HoloCard from "@/components/HoloCard";
import Tile from "@/components/Tile";
import { byId, STOCK, TYPE_DOT } from "@/data/stock";
import { CURRENCIES, format } from "@/lib/currency";
import { useStore } from "@/lib/store";

export default function CardPage() {
  const { id = "" } = useParams();
  const card = byId(id);
  const { add, notify, cart, price, currency } = useStore();
  const [qty, setQty] = useState(1);
  const root = useRef<HTMLDivElement>(null);
  const cardEl = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!card) return;
    gsap.from(".info > *", { y: 10, opacity: 0, stagger: 0.04, duration: 0.4 });
  }, { scope: root, dependencies: [id] });

  if (!card) {
    return (
      <div className="px-6 pt-40 text-center">
        <p className="text-[20px]">This card isn’t in stock</p>
        <Link to="/shop" className="btn btn-primary mt-6">Back to all cards</Link>
      </div>
    );
  }

  const inCart = cart.find((l) => l.id === card.id)?.qty ?? 0;
  const left = card.qty - inCart;
  const related = STOCK.filter((c) => c.type === card.type && c.id !== card.id).slice(0, 4);

  const buy = () => {
    if (left <= 0) return;
    const n = Math.min(qty, left);
    add(card.id, n);
    setQty(1);
    notify(`${n} × ${card.name} added to cart`);
    // a small copy of the card travels to the cart button, so it's clear where it went
    const from = cardEl.current?.getBoundingClientRect();
    const to = document.querySelector("[aria-label^='Open cart']")?.getBoundingClientRect();
    if (from && to && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const ghost = cardEl.current!.querySelector("img")?.cloneNode() as HTMLImageElement | undefined;
      if (!ghost) return;
      ghost.style.cssText = `position:fixed;left:${from.left}px;top:${from.top}px;width:${from.width}px;z-index:70;pointer-events:none;border-radius:8px`;
      document.body.appendChild(ghost);
      gsap.to(ghost, {
        left: to.left + to.width / 2 - 10, top: to.top + 4, width: 20, opacity: 0.6,
        duration: 0.5, ease: "power2.in", onComplete: () => ghost.remove(),
      });
    }
  };

  return (
    <div ref={root} className="mx-auto max-w-[1280px] px-6 pt-24 sm:px-8">
      <Link to="/shop" className="inline-flex items-center gap-2 text-[14px] text-ink-2 hover:text-ink">
        <ArrowLeft size={16} strokeWidth={1.5} />
        All cards
      </Link>
      <div className="mt-8 grid gap-12 md:grid-cols-[1fr_1fr] md:gap-16">
        <div className="rounded-[20px] bg-felt p-10 sm:p-16">
          <div ref={cardEl} className="relative mx-auto max-w-[360px]">
            <HoloCard card={card} large eager />
          </div>
        </div>

        <div className="info self-center">
          <p className="font-mono text-[12px] text-ink-3">{card.set} · {card.year} · {card.id}</p>
          <h1 className="mt-3 font-serif text-[44px] leading-[1.05] tracking-[-0.02em] sm:text-[56px] sm:tracking-[-0.03em]">{card.name}</h1>
          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-hair text-[14px] shadow-[inset_0_0_0_1px_var(--color-hair)]">
            {[
              ["Rarity", card.rarity],
              ["Condition", card.condition],
              ["Type", card.type],
              ["In stock", String(card.qty)],
            ].map(([k, v]) => (
              <div key={k} className="bg-card px-4 py-3">
                <dt className="text-[13px] text-ink-3">{k}</dt>
                <dd className="mt-0.5 flex items-center gap-2">
                  {k === "Type" && <span className="h-2 w-2 rounded-full" style={{ background: TYPE_DOT[card.type] }} aria-hidden />}
                  {v}
                </dd>
              </div>
            ))}
          </dl>

          <p className="tnum mt-8 font-mono text-[32px] leading-none">{price(card.usd)}</p>
          <p className="tnum mt-2 font-mono text-[12px] text-ink-3">
            {CURRENCIES.filter((c) => c.code !== currency).map((c) => format(card.usd, c.code)).join(" · ")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex h-11 items-center rounded-[10px] shadow-[inset_0_0_0_1px_var(--color-hair-2)]">
              <button className="grid h-11 w-11 place-items-center text-ink-2" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Fewer">
                <Minus size={16} strokeWidth={1.5} />
              </button>
              <span className="tnum w-6 text-center font-mono text-[14px]" aria-live="polite">{qty}</span>
              <button className="grid h-11 w-11 place-items-center text-ink-2" onClick={() => setQty((q) => Math.min(Math.max(1, left), q + 1))} aria-label="More">
                <Plus size={16} strokeWidth={1.5} />
              </button>
            </div>
            <button className="btn btn-primary" disabled={left <= 0} onClick={buy}>
              {left <= 0 ? (card.qty === 0 ? "Sold out" : "All copies in cart") : "Add to cart"}
            </button>
          </div>
          {left > 0 && left <= 2 && <p className="mt-3 text-[13px] text-bad">Only {left} left</p>}

          <ul className="mt-10 space-y-2 border-t border-hair pt-6 text-[14px] text-ink-2">
            <li>Ships in a penny sleeve and top-loader, inside a padded mailer</li>
            <li>Raw cards are checked under light for whitening, scratches and centring</li>
            <li>Graded cards are listed with the grade on the slab label</li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-serif text-[32px] tracking-[-0.02em]">More {card.type} cards</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
            {related.map((c) => <Tile key={c.id} card={c} />)}
          </div>
        </section>
      )}
    </div>
  );
}

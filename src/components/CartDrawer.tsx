import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useStore } from "@/lib/store";
import { money, TYPE_STYLE } from "@/lib/cards";
import { Emblem } from "./HoloCard";
import { lenis } from "@/App";

export default function CartDrawer() {
  const { drawer, setDrawer, cartCards, setQty, remove, subtotal } = useStore();
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    tl.current = gsap
      .timeline({ paused: true })
      .set(root.current, { visibility: "visible" })
      .to(".cd-scrim", { opacity: 1, duration: 0.3 })
      .fromTo(".cd-panel", { xPercent: 105 }, { xPercent: 0, duration: 0.55, ease: "expo.out" }, 0)
      .fromTo(".cd-line", { x: 40, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.05, duration: 0.4, ease: "power3.out" }, 0.15);
  }, { scope: root });

  useEffect(() => {
    if (!tl.current) return;
    if (drawer) {
      tl.current.invalidate().play(0);
      lenis?.stop();
    } else {
      tl.current.reverse();
      lenis?.start();
    }
  }, [drawer]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [setDrawer]);

  const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 6;

  return (
    <div ref={root} className="invisible fixed inset-0 z-50" aria-hidden={!drawer}>
      <div className="cd-scrim absolute inset-0 bg-black/60 opacity-0 backdrop-blur-sm" onClick={() => setDrawer(false)} />
      <aside
        className="cd-panel absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-line bg-night-2"
        role="dialog"
        aria-label="Cart"
        data-lenis-prevent
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-2xl font-extrabold">Your binder</h2>
          <button onClick={() => setDrawer(false)} className="btn-ghost rounded-full px-3 py-1 text-sm" aria-label="Close cart">
            Close
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
          {cartCards.length === 0 && (
            <div className="cd-line rounded-2xl border border-dashed border-line p-8 text-center text-dim">
              Nothing pulled yet.
              <Link to="/shop" onClick={() => setDrawer(false)} className="mt-3 block font-bold text-lime">
                Browse the cards
              </Link>
            </div>
          )}
          {cartCards.map(({ card, qty }) => {
            const t = TYPE_STYLE[card.type];
            return (
              <div key={card.id} className="cd-line flex items-center gap-4 rounded-2xl border border-line bg-night-3 p-3">
                <div
                  className="grid h-16 w-12 shrink-0 place-items-center rounded-md"
                  style={{ background: `linear-gradient(160deg, ${t.from}, ${t.to})`, color: t.ink }}
                >
                  <Emblem type={card.type} className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{card.name}</p>
                  <p className="truncate text-xs text-dim">{card.set} · {card.condition}</p>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <button className="h-7 w-7 rounded-full border border-line" onClick={() => setQty(card.id, qty - 1)} aria-label={`One fewer ${card.name}`}>−</button>
                    <span className="w-5 text-center font-mono">{qty}</span>
                    <button className="h-7 w-7 rounded-full border border-line disabled:opacity-30" disabled={qty >= card.stock} onClick={() => setQty(card.id, qty + 1)} aria-label={`One more ${card.name}`}>+</button>
                    <button className="ml-auto text-xs text-dim hover:text-pink" onClick={() => remove(card.id)}>Remove</button>
                  </div>
                </div>
                <p className="font-mono text-sm">{money(card.price * qty)}</p>
              </div>
            );
          })}
        </div>

        <div className="space-y-2 border-t border-line px-6 py-5 text-sm">
          <div className="flex justify-between text-dim"><span>Subtotal</span><span className="font-mono">{money(subtotal)}</span></div>
          <div className="flex justify-between text-dim">
            <span>Shipping {subtotal > 0 && subtotal < 100 && <em className="not-italic text-lime">(free over $100)</em>}</span>
            <span className="font-mono">{shipping ? money(shipping) : "Free"}</span>
          </div>
          <div className="flex justify-between pt-1 text-lg font-bold"><span>Total</span><span className="font-mono">{money(subtotal + shipping)}</span></div>
          <Link
            to="/checkout"
            onClick={() => setDrawer(false)}
            className={`btn btn-lime mt-3 w-full ${cartCards.length ? "" : "pointer-events-none opacity-40"}`}
            aria-disabled={!cartCards.length}
          >
            Check out
          </Link>
        </div>
      </aside>
    </div>
  );
}

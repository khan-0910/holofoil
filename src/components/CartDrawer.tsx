import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Minus, Plus, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { image } from "@/data/stock";
import { FREE_SHIP_USD } from "@/lib/currency";
import { lenis } from "@/App";

export default function CartDrawer() {
  const { drawer, setDrawer, cartCards, setQty, remove, subtotal, shipping, price } = useStore();
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    tl.current = gsap
      .timeline({ paused: true })
      .set(root.current, { visibility: "visible" })
      .to(".cd-scrim", { opacity: 1, duration: 0.2 })
      .fromTo(".cd-panel", { xPercent: 100 }, { xPercent: 0, duration: 0.4, ease: "power3.out" }, 0);
  }, { scope: root });

  useEffect(() => {
    if (!tl.current) return;
    if (drawer) {
      tl.current.play();
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

  const toFree = FREE_SHIP_USD - subtotal;

  return (
    <div ref={root} className="invisible fixed inset-0 z-50" aria-hidden={!drawer}>
      <div className="cd-scrim absolute inset-0 bg-ink/30 opacity-0" onClick={() => setDrawer(false)} />
      <aside
        className="cd-panel absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-card shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
        role="dialog"
        aria-label="Cart"
        data-lenis-prevent
      >
        <div className="flex h-16 items-center justify-between border-b border-hair px-6">
          <h2 className="text-[17px] font-medium">Cart</h2>
          <button onClick={() => setDrawer(false)} className="grid h-8 w-8 place-items-center rounded-lg text-ink-2 hover:bg-raised" aria-label="Close cart">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartCards.length === 0 && (
            <div className="py-16 text-center text-ink-2">
              <p>Your cart is empty</p>
              <Link to="/shop" onClick={() => setDrawer(false)} className="mt-2 inline-block font-medium text-felt">
                Browse cards
              </Link>
            </div>
          )}
          <ul className="divide-y divide-hair">
            {cartCards.map(({ card, qty }) => (
              <li key={card.id} className="flex gap-4 py-4">
                <img src={image(card.id)} alt="" className="h-[84px] w-[60px] shrink-0 rounded-[4px] object-cover shadow-[0_1px_2px_rgba(0,0,0,0.1)]" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex justify-between gap-2">
                    <p className="truncate font-medium">{card.name}</p>
                    <p className="tnum shrink-0 font-mono text-[13px]">{price(card.usd * qty)}</p>
                  </div>
                  <p className="truncate text-[13px] text-ink-2">{card.set} · {card.condition}</p>
                  <div className="mt-auto flex items-center gap-1">
                    <button className="grid h-7 w-7 place-items-center rounded-md text-ink-2 hover:bg-raised" onClick={() => setQty(card.id, qty - 1)} aria-label={`One fewer ${card.name}`}>
                      <Minus size={14} strokeWidth={1.5} />
                    </button>
                    <span className="tnum w-6 text-center font-mono text-[13px]">{qty}</span>
                    <button className="grid h-7 w-7 place-items-center rounded-md text-ink-2 hover:bg-raised disabled:opacity-30" disabled={qty >= card.qty} onClick={() => setQty(card.id, qty + 1)} aria-label={`One more ${card.name}`}>
                      <Plus size={14} strokeWidth={1.5} />
                    </button>
                    <button className="ml-auto text-[13px] text-ink-3 hover:text-bad" onClick={() => remove(card.id)}>Remove</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 border-t border-hair px-6 py-5 text-[14px]">
          <div className="flex justify-between text-ink-2"><span>Subtotal</span><span className="tnum font-mono">{price(subtotal)}</span></div>
          <div className="flex justify-between text-ink-2">
            <span>Shipping</span>
            <span className="tnum font-mono">{subtotal === 0 ? "–" : shipping ? price(shipping) : "Free"}</span>
          </div>
          {subtotal > 0 && toFree > 0 && (
            <p className="text-[13px] text-ink-3">Add {price(toFree)} more for free shipping</p>
          )}
          <div className="flex justify-between pt-2 text-[17px] font-medium"><span>Total</span><span className="tnum font-mono">{price(subtotal + shipping)}</span></div>
          <Link
            to="/checkout"
            onClick={() => setDrawer(false)}
            className="btn btn-primary mt-3 w-full"
            aria-disabled={!cartCards.length}
          >
            Check out
          </Link>
        </div>
      </aside>
    </div>
  );
}

import { useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { money, type Card } from "@/lib/cards";
import HoloCard from "@/components/HoloCard";
import { useStore, type Order } from "@/lib/store";
import { byId } from "@/lib/cards";

export default function Checkout() {
  const { user, cartCards, subtotal, placeOrder } = useStore();
  const [done, setDone] = useState<Order | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const shipping = subtotal >= 100 ? 0 : 6;

  useGSAP(() => {
    if (done) {
      const tl = gsap.timeline();
      tl.from(".ok-card", { y: 300, rotate: (i) => (i - 1) * 30, opacity: 0, stagger: 0.12, duration: 1.1, ease: "back.out(1.6)" })
        .from(".ok-text > *", { y: 30, opacity: 0, stagger: 0.08, duration: 0.6 }, "-=0.6");
      // confetti made of tiny foil cards
      const box = root.current!;
      for (let i = 0; i < 60; i++) {
        const p = document.createElement("i");
        p.style.cssText = `position:absolute;left:50%;top:40%;width:8px;height:11px;border-radius:2px;pointer-events:none;background:hsl(${Math.random() * 360} 90% 65%)`;
        box.appendChild(p);
        gsap.to(p, {
          x: gsap.utils.random(-500, 500), y: gsap.utils.random(-300, 400), rotate: gsap.utils.random(-720, 720),
          opacity: 0, duration: gsap.utils.random(1.4, 2.6), ease: "power2.out", onComplete: () => p.remove(),
        });
      }
    } else {
      gsap.from(".co-in", { y: 30, opacity: 0, stagger: 0.06, duration: 0.6, ease: "power3.out" });
    }
  }, { scope: root, dependencies: [done] });

  if (!user) return <Navigate to="/login?next=/checkout" replace />;

  if (done) {
    const shown = done.items.slice(0, 3).map((it) => byId(it.id)).filter(Boolean) as Card[];
    return (
      <div ref={root} className="relative overflow-hidden px-4 pb-24 pt-36 text-center">
        <div className="relative mx-auto flex h-[260px] max-w-md items-end justify-center">
          {shown.map((c, i) => (
            <div key={c.id} className="ok-card absolute bottom-0 w-[150px]" style={{ transform: `translateX(${(i - (shown.length - 1) / 2) * 70}%) rotate(${(i - (shown.length - 1) / 2) * 10}deg)` }}>
              <HoloCard card={c} interactive={false} />
            </div>
          ))}
        </div>
        <div className="ok-text mx-auto mt-10 max-w-lg">
          <p className="font-mono text-sm text-lime">ORDER {done.id}</p>
          <h1 className="mt-3 font-display text-6xl font-extrabold tracking-[-0.04em]">Pulled it.</h1>
          <p className="mt-4 text-dim">
            {money(done.total)} order placed. This is a demo shop, so nothing was charged and nothing will ship.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/account" className="btn btn-lime">See my orders</Link>
            <Link to="/shop" className="btn btn-ghost">Keep shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartCards.length === 0) {
    return (
      <div className="px-6 pb-24 pt-40 text-center">
        <p className="text-2xl font-bold">Your binder is empty.</p>
        <Link to="/shop" className="btn btn-lime mt-6">Find a card</Link>
      </div>
    );
  }

  return (
    <div ref={root} className="mx-auto max-w-4xl px-4 pb-24 pt-32 sm:px-6">
      <h1 className="co-in font-display text-6xl font-extrabold tracking-[-0.04em]">Checkout.</h1>
      <p className="co-in mt-3 text-dim">Signed in as {user.email}</p>

      <div className="co-in mt-10 divide-y divide-line rounded-3xl border border-line bg-night-2">
        {cartCards.map(({ card, qty }) => (
          <div key={card.id} className="flex items-center justify-between gap-4 px-6 py-4">
            <div className="min-w-0">
              <p className="truncate font-bold">{card.name}</p>
              <p className="text-sm text-dim">{qty} × {money(card.price)} · {card.condition}</p>
            </div>
            <p className="font-mono">{money(card.price * qty)}</p>
          </div>
        ))}
        <div className="space-y-1 px-6 py-5 text-sm">
          <div className="flex justify-between text-dim"><span>Subtotal</span><span className="font-mono">{money(subtotal)}</span></div>
          <div className="flex justify-between text-dim"><span>Tracked shipping</span><span className="font-mono">{shipping ? money(shipping) : "Free"}</span></div>
          <div className="flex justify-between pt-2 text-xl font-bold"><span>Total</span><span className="font-mono">{money(subtotal + shipping)}</span></div>
        </div>
      </div>

      <div className="co-in mt-6 rounded-3xl border border-dashed border-line p-6 text-sm text-dim">
        Demo checkout: there's no payment step, and placing the order only saves it to your account in this browser.
      </div>

      <button className="co-in btn btn-lime mt-6 w-full text-lg" onClick={() => setDone(placeOrder())}>
        Place order · {money(subtotal + shipping)}
      </button>
    </div>
  );
}

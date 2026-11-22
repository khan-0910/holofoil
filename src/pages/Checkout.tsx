import { useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Check } from "lucide-react";
import { image } from "@/data/stock";
import { format } from "@/lib/currency";
import { useStore, type Order } from "@/lib/store";

export default function Checkout() {
  const { user, cartCards, subtotal, shipping, placeOrder, price } = useStore();
  const [done, setDone] = useState<Order | null>(null);
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".co-in", { y: 10, opacity: 0, stagger: 0.05, duration: 0.4 });
  }, { scope: root, dependencies: [done] });

  if (!user) return <Navigate to="/login?next=/checkout" replace />;

  if (done) {
    return (
      <div ref={root} className="mx-auto max-w-[560px] px-6 pt-36 text-center">
        <span className="co-in mx-auto grid h-12 w-12 place-items-center rounded-full bg-felt-soft text-felt">
          <Check size={20} strokeWidth={1.5} />
        </span>
        <h1 className="co-in mt-6 font-serif text-[44px] leading-[1.1] tracking-[-0.02em]">Order placed</h1>
        <p className="co-in mt-3 font-mono text-[13px] text-ink-3">{done.id} · {format(done.totalUsd, done.currency)}</p>
        <div className="co-in mt-8 flex justify-center -space-x-6">
          {done.items.slice(0, 5).map((it, i) => (
            <img key={it.id} src={image(it.id)} alt="" className="h-[112px] w-[80px] rounded-[5px] object-cover shadow-[0_8px_24px_rgba(0,0,0,0.12)]" style={{ transform: `rotate(${(i - Math.min(done.items.length, 5) / 2 + 0.5) * 5}deg)` }} />
          ))}
        </div>
        <p className="co-in mt-8 text-ink-2">This is a demo shop, so nothing was charged and nothing will ship.</p>
        <div className="co-in mt-8 flex justify-center gap-3">
          <Link to="/account" className="btn btn-primary">View orders</Link>
          <Link to="/shop" className="btn btn-secondary">Keep browsing</Link>
        </div>
      </div>
    );
  }

  if (cartCards.length === 0) {
    return (
      <div className="px-6 pt-40 text-center">
        <p className="text-[20px]">Your cart is empty</p>
        <Link to="/shop" className="btn btn-primary mt-6">Browse cards</Link>
      </div>
    );
  }

  return (
    <div ref={root} className="mx-auto max-w-[720px] px-6 pt-28">
      <h1 className="co-in font-serif text-[44px] leading-[1.1] tracking-[-0.02em]">Checkout</h1>
      <p className="co-in mt-2 text-ink-2">Signed in as {user.email}</p>

      <div className="co-in mt-8 rounded-2xl bg-card shadow-[inset_0_0_0_1px_var(--color-hair)]">
        <ul className="divide-y divide-hair">
          {cartCards.map(({ card, qty }) => (
            <li key={card.id} className="flex items-center gap-4 px-5 py-4">
              <img src={image(card.id)} alt="" className="h-[56px] w-[40px] rounded-[3px] object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{card.name}</p>
                <p className="text-[13px] text-ink-2">{qty} × {price(card.usd)} · {card.condition}</p>
              </div>
              <p className="tnum font-mono text-[14px]">{price(card.usd * qty)}</p>
            </li>
          ))}
        </ul>
        <div className="space-y-2 border-t border-hair px-5 py-4 text-[14px]">
          <div className="flex justify-between text-ink-2"><span>Subtotal</span><span className="tnum font-mono">{price(subtotal)}</span></div>
          <div className="flex justify-between text-ink-2"><span>Tracked shipping</span><span className="tnum font-mono">{shipping ? price(shipping) : "Free"}</span></div>
          <div className="flex justify-between pt-2 text-[17px] font-medium"><span>Total</span><span className="tnum font-mono">{price(subtotal + shipping)}</span></div>
        </div>
      </div>

      <p className="co-in mt-4 text-[13px] text-ink-3">
        Demo checkout: there’s no payment step. Placing the order saves it to your account in this browser.
      </p>
      <button className="co-in btn btn-primary mt-6 w-full" onClick={() => setDone(placeOrder())}>
        Place order · {price(subtotal + shipping)}
      </button>
    </div>
  );
}

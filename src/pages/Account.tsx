import { useRef } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import CountUp from "@/components/CountUp";
import { byId, image } from "@/data/stock";
import { format } from "@/lib/currency";
import { useStore } from "@/lib/store";

export default function Account() {
  const { user, orders, logout, notify, price } = useStore();
  const nav = useNavigate();
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".ac-in", { y: 10, opacity: 0, stagger: 0.04, duration: 0.4 });
  }, { scope: root });

  if (!user) return <Navigate to="/login" replace />;
  const spentUsd = orders.reduce((s, o) => s + o.totalUsd, 0);
  const cards = orders.reduce((s, o) => s + o.items.reduce((a, i) => a + i.qty, 0), 0);

  return (
    <div ref={root} className="mx-auto max-w-[880px] px-6 pt-28">
      <div className="ac-in flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-[44px] leading-[1.1] tracking-[-0.02em]">Account</h1>
          <p className="mt-1 text-ink-2">{user.name} · {user.email}</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => { logout(); notify("Signed out"); nav("/"); }}>Sign out</button>
      </div>

      <div className="ac-in mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-card p-5 shadow-[inset_0_0_0_1px_var(--color-hair)]">
          <p className="text-[13px] text-ink-2">Orders</p>
          <CountUp to={orders.length} className="tnum mt-2 block font-mono text-[28px] leading-none" />
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-[inset_0_0_0_1px_var(--color-hair)]">
          <p className="text-[13px] text-ink-2">Cards bought</p>
          <CountUp to={cards} className="tnum mt-2 block font-mono text-[28px] leading-none" />
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-[inset_0_0_0_1px_var(--color-hair)]">
          <p className="text-[13px] text-ink-2">Spent, demo</p>
          <p className="tnum mt-2 font-mono text-[28px] leading-none">{price(spentUsd)}</p>
        </div>
      </div>

      <h2 className="ac-in mt-12 text-[17px] font-medium">Order history</h2>
      {orders.length === 0 ? (
        <p className="ac-in mt-4 rounded-2xl p-10 text-center text-ink-2 shadow-[inset_0_0_0_1px_var(--color-hair)]">
          No orders yet. <Link to="/shop" className="font-medium text-felt">Browse cards</Link>
        </p>
      ) : (
        <ul className="ac-in mt-4 divide-y divide-hair rounded-2xl bg-card shadow-[inset_0_0_0_1px_var(--color-hair)]">
          {orders.map((o) => (
            <li key={o.id} className="flex items-center gap-4 px-5 py-4">
              <div className="flex shrink-0 -space-x-3">
                {o.items.slice(0, 3).map((i) => (
                  <img key={i.id} src={image(i.id)} alt="" className="h-[48px] w-[34px] rounded-[3px] object-cover shadow-[0_0_0_2px_var(--color-card)]" />
                ))}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px]">{o.items.map((i) => `${i.qty} × ${byId(i.id)?.name ?? i.id}`).join(", ")}</p>
                <p className="font-mono text-[12px] text-ink-3">{o.id} · {new Date(o.placed).toLocaleDateString()}</p>
              </div>
              <p className="tnum font-mono text-[14px]">{format(o.totalUsd, o.currency)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

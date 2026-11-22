import { useRef } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import CountUp from "@/components/CountUp";
import { byId, money } from "@/lib/cards";
import { useStore } from "@/lib/store";

export default function Account() {
  const { user, orders, logout, notify } = useStore();
  const nav = useNavigate();
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".ac-in", { y: 30, opacity: 0, stagger: 0.07, duration: 0.7, ease: "power3.out" });
  }, { scope: root });

  if (!user) return <Navigate to="/login" replace />;
  const spent = orders.reduce((s, o) => s + o.total, 0);
  const cards = orders.reduce((s, o) => s + o.items.reduce((a, i) => a + i.qty, 0), 0);

  return (
    <div ref={root} className="mx-auto max-w-4xl px-4 pb-24 pt-32 sm:px-6">
      <div className="ac-in flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-dim">{user.email}</p>
          <h1 className="font-display text-6xl font-extrabold tracking-[-0.04em]">Hey, {user.name.split(" ")[0]}.</h1>
        </div>
        <button className="btn btn-ghost" onClick={() => { logout(); notify("Signed out"); nav("/"); }}>Sign out</button>
      </div>

      <div className="ac-in mt-10 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-3">
        <div className="bg-night-2 p-6"><CountUp to={orders.length} className="font-display text-5xl font-extrabold" /><p className="text-dim">orders</p></div>
        <div className="bg-night-2 p-6"><CountUp to={cards} className="font-display text-5xl font-extrabold" /><p className="text-dim">cards pulled</p></div>
        <div className="bg-night-2 p-6"><CountUp to={spent} prefix="$" className="font-display text-5xl font-extrabold" /><p className="text-dim">spent (pretend)</p></div>
      </div>

      <h2 className="ac-in mt-14 font-display text-3xl font-extrabold">Order history</h2>
      {orders.length === 0 ? (
        <p className="ac-in mt-4 rounded-3xl border border-dashed border-line p-10 text-center text-dim">
          No orders yet. <Link to="/shop" className="font-bold text-lime">Go find something shiny.</Link>
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="ac-in rounded-3xl border border-line bg-night-2 p-5">
              <div className="flex flex-wrap justify-between gap-2">
                <p className="font-mono text-lime">{o.id}</p>
                <p className="text-sm text-dim">{new Date(o.placed).toLocaleString()}</p>
              </div>
              <p className="mt-2 text-sm text-dim">
                {o.items.map((i) => `${i.qty} × ${byId(i.id)?.name ?? i.id}`).join(", ")}
              </p>
              <p className="mt-2 font-bold">{money(o.total)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

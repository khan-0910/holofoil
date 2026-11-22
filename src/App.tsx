import { useEffect, useRef } from "react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShoppingBag } from "lucide-react";
import CartDrawer from "@/components/CartDrawer";
import { useStore } from "@/lib/store";
import { CURRENCIES, type Currency } from "@/lib/currency";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import CardPage from "@/pages/CardPage";
import Auth from "@/pages/Auth";
import Checkout from "@/pages/Checkout";
import Account from "@/pages/Account";

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: "power3.out" });

export let lenis: Lenis | null = null;

function useSmoothScroll() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const l = new Lenis({ lerp: 0.12 });
    lenis = l;
    l.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => l.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      l.destroy();
      lenis = null;
    };
  }, []);
}

function Nav() {
  const { count, setDrawer, user, currency, setCurrency } = useStore();
  const badge = useRef<HTMLSpanElement>(null);
  const prev = useRef(count);
  useEffect(() => {
    if (count > prev.current && badge.current) {
      gsap.fromTo(badge.current, { scale: 0.7 }, { scale: 1, duration: 0.3 });
    }
    prev.current = count;
  }, [count]);

  const link = ({ isActive }: { isActive: boolean }) =>
    `text-[14px] transition-colors ${isActive ? "text-ink" : "text-ink-2 hover:text-ink"}`;

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-hair bg-page/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 sm:px-8">
        <Link to="/" className="flex items-center gap-2 text-[17px] font-semibold">
          <span aria-hidden className="h-[18px] w-[13px] rounded-[3px] bg-felt" />
          Holofoil
        </Link>
        <div className="flex items-center gap-6">
          <NavLink to="/shop" className={link}>Shop</NavLink>
          <NavLink to={user ? "/account" : "/login"} className={link}>{user ? "Account" : "Sign in"}</NavLink>
          <label className="sr-only" htmlFor="currency">Currency</label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="h-9 rounded-lg bg-transparent px-2 font-mono text-[13px] text-ink-2 shadow-[inset_0_0_0_1px_var(--color-hair-2)] outline-none hover:text-ink"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
            ))}
          </select>
          <button onClick={() => setDrawer(true)} className="btn btn-sm btn-primary" aria-label={`Open cart, ${count} items`}>
            <ShoppingBag size={16} strokeWidth={1.5} />
            <span ref={badge} className="tnum inline-block font-mono text-[13px]">{count}</span>
          </button>
        </div>
      </nav>
    </header>
  );
}

function Toast() {
  const { toast } = useStore();
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (toast && el.current) gsap.fromTo(el.current, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 });
  }, [toast]);
  if (!toast) return null;
  return (
    <div ref={el} role="status" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-[10px] bg-ink px-4 py-3 text-[14px] text-card shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
      {toast}
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-32 border-t border-hair">
      <div className="mx-auto grid max-w-[1280px] gap-8 px-6 py-12 text-[13px] text-ink-2 sm:grid-cols-2 sm:px-8">
        <div>
          <p className="text-[15px] font-medium text-ink">Holofoil</p>
          <p className="mt-2 max-w-sm">
            A portfolio demo shop. Nothing is charged and no cards ship. Accounts and orders stay in this browser.
          </p>
        </div>
        <p className="max-w-sm sm:justify-self-end">
          Not affiliated with Nintendo, Creatures, GAME FREAK or The Pokémon Company. Card images come from the Pokémon TCG API and belong to their owners.
        </p>
      </div>
    </footer>
  );
}

export default function App() {
  useSmoothScroll();
  const { pathname } = useLocation();
  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname]);

  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/card/:id" element={<CardPage />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
      <Toast />
    </div>
  );
}

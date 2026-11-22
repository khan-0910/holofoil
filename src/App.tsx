import { useEffect, useRef } from "react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ClickSpark from "@/components/ClickSpark";
import CartDrawer from "@/components/CartDrawer";
import { useStore } from "@/lib/store";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import CardPage from "@/pages/CardPage";
import Auth from "@/pages/Auth";
import Checkout from "@/pages/Checkout";
import Account from "@/pages/Account";

gsap.registerPlugin(ScrollTrigger);

export let lenis: Lenis | null = null;

function useSmoothScroll() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const l = new Lenis({ lerp: 0.1 });
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
  const { count, setDrawer, user } = useStore();
  const badge = useRef<HTMLSpanElement>(null);
  const prev = useRef(count);
  useEffect(() => {
    if (count > prev.current && badge.current) {
      gsap.fromTo(badge.current, { scale: 1.8, rotate: -20 }, { scale: 1, rotate: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    }
    prev.current = count;
  }, [count]);

  const link = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-3 py-1.5 transition-colors ${isActive ? "bg-bone text-night" : "text-dim hover:text-bone"}`;

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-line bg-night/70 py-2 pl-5 pr-2 backdrop-blur-xl">
        <Link to="/" className="font-display text-lg font-extrabold tracking-tight">
          HOLO<span className="foil-text">FOIL</span>
        </Link>
        <div className="flex items-center gap-1 text-sm font-semibold">
          <NavLink to="/shop" className={link}>Shop</NavLink>
          <NavLink to={user ? "/account" : "/login"} className={link}>
            {user ? user.name.split(" ")[0] : "Sign in"}
          </NavLink>
          <button
            onClick={() => setDrawer(true)}
            className="ml-1 flex items-center gap-2 rounded-full bg-lime px-4 py-2 font-bold text-night transition-transform active:scale-95"
            aria-label={`Open cart, ${count} items`}
          >
            Cart
            <span ref={badge} className="grid h-5 min-w-5 place-items-center rounded-full bg-night px-1 text-xs text-lime">
              {count}
            </span>
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
    if (toast && el.current) gsap.fromTo(el.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "back.out(2)" });
  }, [toast]);
  if (!toast) return null;
  return (
    <div ref={el} role="status" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-bone px-5 py-3 text-sm font-bold text-night shadow-2xl">
      {toast}
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line px-6 py-12 text-sm text-dim">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 sm:flex-row">
        <div>
          <p className="font-display text-2xl font-extrabold text-bone">HOLO<span className="foil-text">FOIL</span></p>
          <p className="mt-2 max-w-sm">A portfolio demo shop. Nothing is charged and no cards ship. Accounts and orders stay in this browser.</p>
        </div>
        <p className="max-w-sm sm:text-right">
          Not affiliated with Nintendo, Creatures, GAME FREAK or The Pokémon Company. Card names are listed as a reseller would; all artwork on this site is original.
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
    <ClickSpark sparkColor={["#d4ff3a", "#ff5fa2", "#5fd4ff"]} sparkCount={10} sparkRadius={22} className="grain min-h-screen">
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
    </ClickSpark>
  );
}

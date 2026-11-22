import { useRef, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import HoloCard from "@/components/HoloCard";
import { byId } from "@/lib/cards";
import { useStore } from "@/lib/store";

export default function Auth({ mode }: { mode: "login" | "register" }) {
  const { login, register, notify } = useStore();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/account";
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const form = useRef<HTMLFormElement>(null);

  useGSAP(() => {
    gsap.from(".auth-in", { y: 30, opacity: 0, stagger: 0.06, duration: 0.7, ease: "power3.out" });
    gsap.from(".auth-card", { rotate: -20, x: -80, opacity: 0, duration: 1.2, ease: "expo.out" });
  }, { scope: root, dependencies: [mode] });

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    const err =
      mode === "login"
        ? await login(String(f.get("email")), String(f.get("password")))
        : await register(String(f.get("name")), String(f.get("email")), String(f.get("password")));
    setBusy(false);
    if (err) {
      setError(err);
      gsap.fromTo(form.current, { x: -10 }, { x: 0, duration: 0.5, ease: "elastic.out(1.2, 0.3)" });
      return;
    }
    notify(mode === "login" ? "Welcome back" : "Account created");
    nav(next);
  };

  const isLogin = mode === "login";
  return (
    <div ref={root} className="mx-auto grid min-h-[100svh] max-w-6xl items-center gap-12 px-4 pb-16 pt-32 sm:px-6 md:grid-cols-2">
      <div className="auth-card mx-auto hidden w-full max-w-[300px] md:block">
        <HoloCard card={byId(isLogin ? "umbreon-vmax" : "pikachu-vmax")!} />
      </div>
      <div className="mx-auto w-full max-w-md">
        <h1 className="auth-in font-display text-6xl font-extrabold tracking-[-0.04em]">{isLogin ? "Sign in." : "Join the club."}</h1>
        <p className="auth-in mt-3 text-dim">
          {isLogin ? "Pick up where your binder left off." : "Save your cart and keep a history of every order."}
        </p>
        <form ref={form} onSubmit={submit} className="mt-8 space-y-4" noValidate>
          {!isLogin && (
            <label className="auth-in block">
              <span className="mb-1.5 block text-sm text-dim">Name</span>
              <input name="name" className="field" autoComplete="name" required />
            </label>
          )}
          <label className="auth-in block">
            <span className="mb-1.5 block text-sm text-dim">Email</span>
            <input name="email" type="email" className="field" autoComplete="email" required />
          </label>
          <label className="auth-in block">
            <span className="mb-1.5 block text-sm text-dim">Password {!isLogin && "(8+ characters)"}</span>
            <input name="password" type="password" className="field" autoComplete={isLogin ? "current-password" : "new-password"} required />
          </label>
          {error && <p role="alert" className="rounded-xl bg-pink/15 px-4 py-3 text-sm text-pink">{error}</p>}
          <button className="auth-in btn btn-lime w-full text-lg" disabled={busy}>
            {busy ? "One sec…" : isLogin ? "Sign in" : "Create account"}
          </button>
        </form>
        <p className="auth-in mt-6 text-sm text-dim">
          {isLogin ? "New here? " : "Already have an account? "}
          <Link to={`/${isLogin ? "register" : "login"}?next=${encodeURIComponent(next)}`} className="font-bold text-lime">
            {isLogin ? "Create an account" : "Sign in"}
          </Link>
        </p>
        <p className="auth-in mt-8 text-xs text-dim/70">
          Demo accounts live only in this browser. Passwords are stored as salted PBKDF2 hashes, never as text. Don't reuse a real password.
        </p>
      </div>
    </div>
  );
}

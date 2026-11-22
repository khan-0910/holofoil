import { useRef, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useStore } from "@/lib/store";

export default function Auth({ mode }: { mode: "login" | "register" }) {
  const { login, register, notify } = useStore();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/account";
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const isLogin = mode === "login";

  useGSAP(() => {
    gsap.from(".auth-in", { y: 10, opacity: 0, stagger: 0.04, duration: 0.4 });
  }, { scope: root, dependencies: [mode] });

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    const err = isLogin
      ? await login(String(f.get("email")), String(f.get("password")))
      : await register(String(f.get("name")), String(f.get("email")), String(f.get("password")));
    setBusy(false);
    if (err) return setError(err);
    notify(isLogin ? "Signed in" : "Account created");
    nav(next);
  };

  return (
    <div ref={root} className="mx-auto max-w-[400px] px-6 pt-36">
      <h1 className="auth-in font-serif text-[40px] leading-[1.1] tracking-[-0.02em]">{isLogin ? "Sign in" : "Create an account"}</h1>
      <p className="auth-in mt-2 text-ink-2">{isLogin ? "Your cart and orders are waiting" : "Keep your cart and a history of every order"}</p>
      <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
        {!isLogin && (
          <label className="auth-in block">
            <span className="mb-1.5 block text-[14px] text-ink-2">Name</span>
            <input name="name" className="field" autoComplete="name" required />
          </label>
        )}
        <label className="auth-in block">
          <span className="mb-1.5 block text-[14px] text-ink-2">Email</span>
          <input name="email" type="email" className="field" autoComplete="email" required />
        </label>
        <label className="auth-in block">
          <span className="mb-1.5 block text-[14px] text-ink-2">Password{!isLogin && ", at least 8 characters"}</span>
          <input name="password" type="password" className="field" autoComplete={isLogin ? "current-password" : "new-password"} required />
        </label>
        {error && <p role="alert" className="rounded-[10px] bg-bad/10 px-4 py-3 text-[14px] text-bad">{error}</p>}
        <button className="auth-in btn btn-primary w-full" disabled={busy}>
          {busy ? "Checking…" : isLogin ? "Sign in" : "Create account"}
        </button>
      </form>
      <p className="auth-in mt-6 text-[14px] text-ink-2">
        {isLogin ? "New here? " : "Already have an account? "}
        <Link to={`/${isLogin ? "register" : "login"}?next=${encodeURIComponent(next)}`} className="font-medium text-felt">
          {isLogin ? "Create an account" : "Sign in"}
        </Link>
      </p>
      <p className="auth-in mt-10 border-t border-hair pt-4 text-[13px] text-ink-3">
        Demo accounts live only in this browser. Passwords are stored as salted PBKDF2 hashes, never as text, but don’t reuse a real one.
      </p>
    </div>
  );
}

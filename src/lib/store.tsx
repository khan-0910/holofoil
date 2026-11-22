import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { byId, type StockItem } from "@/data/stock";
import { convert, format, FREE_SHIP_USD, SHIP_USD, type Currency } from "./currency";

/* ---------- storage helpers (never throw: private windows can block storage) ---------- */
const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: state still works for this visit */
  }
};

/* ---------- password database: salted PBKDF2 hashes, never plain text ---------- */
type UserRecord = { email: string; name: string; salt: string; hash: string; created: number };
export type Order = { id: string; email: string; items: { id: string; qty: number; usd: number }[]; totalUsd: number; currency: Currency; total: number; placed: number };

const toHex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

async function hashPassword(password: string, saltHex: string) {
  const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map((h) => parseInt(h, 16)));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 120_000, hash: "SHA-256" }, key, 256);
  return toHex(bits);
}

/* ---------- context ---------- */
type CartLine = { id: string; qty: number };
type Ctx = {
  cart: CartLine[];
  cartCards: { card: StockItem; qty: number }[];
  count: number;
  subtotal: number;
  shipping: number;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  price: (usd: number) => string;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  drawer: boolean;
  setDrawer: (v: boolean) => void;
  user: { email: string; name: string } | null;
  register: (name: string, email: string, password: string) => Promise<string | null>;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
  orders: Order[];
  placeOrder: () => Order | null;
  toast: string | null;
  notify: (msg: string) => void;
};

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>(() => read("hf.cart.v2", []));
  const [users, setUsers] = useState<UserRecord[]>(() => read("hf.users", []));
  const [session, setSession] = useState<string | null>(() => read("hf.session", null));
  const [orders, setOrders] = useState<Order[]>(() => read("hf.orders.v2", []));
  const [drawer, setDrawer] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [currency, setCurrency] = useState<Currency>(() => read("hf.currency", "INR"));
  useEffect(() => write("hf.currency", currency), [currency]);

  useEffect(() => write("hf.cart.v2", cart), [cart]);
  useEffect(() => write("hf.users", users), [users]);
  useEffect(() => write("hf.session", session), [session]);
  useEffect(() => write("hf.orders.v2", orders), [orders]);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast((t) => (t === msg ? null : t)), 2400);
  }, []);

  const add = useCallback((id: string, qty = 1) => {
    const card = byId(id);
    if (!card) return;
    setCart((c) => {
      const line = c.find((l) => l.id === id);
      const next = Math.min(card.qty, (line?.qty ?? 0) + qty);
      return line ? c.map((l) => (l.id === id ? { ...l, qty: next } : l)) : [...c, { id, qty: next }];
    });
  }, []);
  const setQty = useCallback((id: string, qty: number) => {
    const card = byId(id);
    if (!card) return;
    setCart((c) => (qty <= 0 ? c.filter((l) => l.id !== id) : c.map((l) => (l.id === id ? { ...l, qty: Math.min(card.qty, qty) } : l))));
  }, []);
  const remove = useCallback((id: string) => setCart((c) => c.filter((l) => l.id !== id)), []);
  const clear = useCallback(() => setCart([]), []);

  const cartCards = useMemo(
    () => cart.flatMap((l) => {
      const card = byId(l.id);
      return card ? [{ card, qty: l.qty }] : [];
    }),
    [cart],
  );
  const count = cartCards.reduce((s, l) => s + l.qty, 0);
  const subtotal = cartCards.reduce((s, l) => s + l.qty * l.card.usd, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIP_USD ? 0 : SHIP_USD;

  const user = useMemo(() => {
    const u = users.find((x) => x.email === session);
    return u ? { email: u.email, name: u.name } : null;
  }, [users, session]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const e = email.trim().toLowerCase();
    if (!name.trim()) return "Add your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return "That email doesn't look right.";
    if (password.length < 8) return "Use at least 8 characters for the password.";
    if (users.some((u) => u.email === e)) return "An account with that email already exists.";
    const salt = toHex(crypto.getRandomValues(new Uint8Array(16)).buffer);
    const hash = await hashPassword(password, salt);
    setUsers((u) => [...u, { email: e, name: name.trim(), salt, hash, created: Date.now() }]);
    setSession(e);
    return null;
  }, [users]);

  const login = useCallback(async (email: string, password: string) => {
    const e = email.trim().toLowerCase();
    const u = users.find((x) => x.email === e);
    // same message for both cases, so the form doesn't reveal which emails exist
    if (!u || (await hashPassword(password, u.salt)) !== u.hash) return "Email or password is wrong.";
    setSession(e);
    return null;
  }, [users]);

  const logout = useCallback(() => setSession(null), []);

  const placeOrder = useCallback(() => {
    if (!user || cartCards.length === 0) return null;
    const order: Order = {
      id: "HF-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
      email: user.email,
      items: cartCards.map((l) => ({ id: l.card.id, qty: l.qty, usd: l.card.usd })),
      totalUsd: subtotal + shipping,
      currency,
      total: convert(subtotal + shipping, currency),
      placed: Date.now(),
    };
    setOrders((o) => [order, ...o]);
    setCart([]);
    return order;
  }, [user, cartCards, subtotal, shipping, currency]);

  const value: Ctx = {
    cart, cartCards, count, subtotal, shipping, currency, setCurrency, price: (usd: number) => format(usd, currency), add, setQty, remove, clear, drawer, setDrawer,
    user, register, login, logout, orders: orders.filter((o) => o.email === user?.email), placeOrder, toast, notify,
  };
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore outside StoreProvider");
  return ctx;
}

import { useRef, type CSSProperties, type PointerEvent } from "react";
import { TYPE_STYLE, type Card, type CardType } from "@/lib/cards";

/* Original type emblems drawn for this shop - no official card art is used. */
export function Emblem({ type, className = "" }: { type: CardType; className?: string }) {
  const p: Record<CardType, string> = {
    fire: "M50 8c6 18 26 26 26 50a26 26 0 0 1-52 0c0-12 6-20 12-26 0 10 4 16 10 18-4-16 0-30 4-42z",
    water: "M50 8C38 30 24 44 24 62a26 26 0 0 0 52 0C76 44 62 30 50 8z",
    grass: "M50 90V46M50 46C30 46 18 30 18 12c20 0 32 14 32 34zm0 14c18 0 32-12 32-32-20 0-32 12-32 32z",
    electric: "M58 6 22 56h24l-8 38 40-54H54z",
    psychic: "M8 50s16-26 42-26 42 26 42 26-16 26-42 26S8 50 8 50zm42-14a14 14 0 1 0 0 28 14 14 0 0 0 0-28z",
    dark: "M62 10a40 40 0 1 0 28 62A34 34 0 0 1 62 10z",
    dragon: "M50 6 64 36l30 4-22 20 6 30-28-14-28 14 6-30L6 40l30-4z",
    fighting: "M28 40V24a6 6 0 0 1 12 0v12-18a6 6 0 0 1 12 0v18-14a6 6 0 0 1 12 0v16-8a6 6 0 0 1 12 0v26c0 16-12 28-28 28h-4c-14 0-24-10-26-22l-4-20a6 6 0 0 1 12-4z",
  };
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <path d={p[type]} fill="currentColor" stroke="currentColor" strokeWidth={type === "grass" ? 6 : 0} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

type Props = { card: Card; className?: string; interactive?: boolean; style?: CSSProperties };

/** A card face with pointer-tracked tilt and a holo foil layer. */
export default function HoloCard({ card, className = "", interactive = true, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const t = TYPE_STYLE[card.type];
  const foil = card.rarity !== "Common";

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !interactive) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - y) * 22}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 26}deg`);
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    el.style.setProperty("--o", "1");
  };
  const leave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--o", "0");
  };

  return (
    <div className={`holo-wrap ${className}`} style={style}>
      <div
        ref={ref}
        onPointerMove={move}
        onPointerLeave={leave}
        className={`holo-card ${foil ? "is-foil" : ""} ${card.rarity === "Secret Rare" ? "is-secret" : ""}`}
        style={{ "--from": t.from, "--to": t.to, "--ink": t.ink } as CSSProperties}
      >
        <div className="holo-frame">
          <div className="flex items-baseline justify-between px-[7%] pt-[6%] text-[clamp(9px,4.2cqw,15px)] font-bold">
            <span className="truncate">{card.name}</span>
            <span className="shrink-0 pl-2 opacity-90">HP {card.hp}</span>
          </div>
          <div className="holo-art">
            <div className="holo-art-glow" />
            <Emblem type={card.type} className="relative z-[1] h-[52%] w-[52%] drop-shadow-[0_6px_18px_rgba(0,0,0,.35)]" />
          </div>
          <div className="mt-auto space-y-[3%] px-[7%] pb-[6%] text-[clamp(7px,3.2cqw,11px)]">
            <div className="flex justify-between opacity-90">
              <span>{t.label}</span>
              <span>{card.rarity}</span>
            </div>
            <div className="h-px bg-current opacity-25" />
            <div className="flex justify-between font-mono opacity-75">
              <span className="truncate">{card.set}</span>
              <span className="shrink-0 pl-2">{card.number}</span>
            </div>
          </div>
        </div>
        {foil && <div className="holo-foil" />}
        <div className="holo-glare" />
      </div>
    </div>
  );
}

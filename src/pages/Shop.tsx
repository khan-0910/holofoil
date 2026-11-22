import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import SplitText from "@/components/SplitText";
import HoloCard from "@/components/HoloCard";
import { CARDS, money, RARITIES, TYPE_STYLE, type CardType, type Rarity } from "@/lib/cards";
import { useStore } from "@/lib/store";

gsap.registerPlugin(Flip);

type Sort = "featured" | "low" | "high" | "new";

export default function Shop() {
  const { add, notify } = useStore();
  const [type, setType] = useState<CardType | "all">("all");
  const [rarity, setRarity] = useState<Rarity | "all">("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("featured");
  const grid = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    const out = CARDS.filter(
      (c) =>
        (type === "all" || c.type === type) &&
        (rarity === "all" || c.rarity === rarity) &&
        (!s || c.name.toLowerCase().includes(s) || c.set.toLowerCase().includes(s)),
    );
    if (sort === "low") out.sort((a, b) => a.price - b.price);
    if (sort === "high") out.sort((a, b) => b.price - a.price);
    if (sort === "new") out.sort((a, b) => b.year - a.year);
    return out;
  }, [type, rarity, q, sort]);

  // capture positions before the change, animate after it renders
  const change = (fn: () => void) => {
    if (grid.current) flipState.current = Flip.getState(grid.current.querySelectorAll(".tile"));
    fn();
  };
  useLayoutEffect(() => {
    if (!flipState.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    Flip.from(flipState.current, {
      duration: 0.6, ease: "power3.inOut", absolute: true, scale: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.5 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.7, duration: 0.4 }),
    });
    flipState.current = null;
  }, [list]);

  useGSAP(() => {
    gsap.from(".tile", { y: 60, opacity: 0, stagger: 0.04, duration: 0.8, ease: "expo.out", delay: 0.2 });
  }, { scope: grid });

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-32 sm:px-6">
      <SplitText
        tag="h1"
        text="The case."
        className="font-display text-[clamp(56px,11vw,140px)] font-extrabold leading-none tracking-[-0.05em]"
        splitType="chars"
        effect="flip"
        trigger="load"
        textAlign="left"
      />
      <p className="mt-3 max-w-md text-dim">Every card is photographed, graded or condition-checked, and ships sleeved in a top-loader.</p>

      <div className="sticky top-20 z-30 mt-10 space-y-3 rounded-3xl border border-line bg-night/80 p-4 backdrop-blur-xl">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            className="field"
            placeholder="Search a card or set"
            value={q}
            onChange={(e) => change(() => setQ(e.target.value))}
            aria-label="Search cards"
          />
          <select className="field sm:w-56" value={sort} onChange={(e) => change(() => setSort(e.target.value as Sort))} aria-label="Sort">
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="new">Newest set</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="chip" aria-pressed={type === "all"} onClick={() => change(() => setType("all"))}>All types</button>
          {(Object.keys(TYPE_STYLE) as CardType[]).map((t) => (
            <button key={t} className="chip" aria-pressed={type === t} onClick={() => change(() => setType(t))}>
              <span className="mr-1.5 inline-block h-2 w-2 rounded-full" style={{ background: TYPE_STYLE[t].from }} />
              {TYPE_STYLE[t].label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="chip" aria-pressed={rarity === "all"} onClick={() => change(() => setRarity("all"))}>Any rarity</button>
          {RARITIES.map((r) => (
            <button key={r} className="chip" aria-pressed={rarity === r} onClick={() => change(() => setRarity(r))}>{r}</button>
          ))}
        </div>
      </div>

      <p className="mt-6 font-mono text-sm text-dim" aria-live="polite">{list.length} cards</p>

      <div ref={grid} className="mt-4 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {list.map((card) => (
          <article key={card.id} data-flip-id={card.id} className="tile">
            <Link to={`/card/${card.id}`} aria-label={`${card.name}, ${money(card.price)}`}>
              <HoloCard card={card} />
            </Link>
            <div className="mt-3 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-bold">{card.name}</p>
                <p className="truncate text-xs text-dim">{card.rarity} · {card.condition}</p>
              </div>
              <button
                className="shrink-0 rounded-full bg-night-3 px-3 py-1.5 font-mono text-sm transition-colors hover:bg-lime hover:text-night"
                onClick={() => { add(card.id); notify(`${card.name} added to your binder`); }}
                aria-label={`Add ${card.name} to cart`}
              >
                {money(card.price)} +
              </button>
            </div>
          </article>
        ))}
        {list.length === 0 && (
          <p className="col-span-full rounded-3xl border border-dashed border-line p-12 text-center text-dim">
            No cards match. Try fewer filters.
          </p>
        )}
      </div>
    </div>
  );
}

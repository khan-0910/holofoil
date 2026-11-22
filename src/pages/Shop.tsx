import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { Search } from "lucide-react";
import Tile from "@/components/Tile";
import { STOCK, TYPE_DOT, TYPES, type Energy } from "@/data/stock";

gsap.registerPlugin(Flip);

type Sort = "featured" | "low" | "high" | "new" | "old";
const GRADED = (c: string) => c.startsWith("PSA");

export default function Shop() {
  const [type, setType] = useState<Energy | "all">("all");
  const [grade, setGrade] = useState<"all" | "raw" | "graded">("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("featured");
  const grid = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    const out = STOCK.filter(
      (c) =>
        (type === "all" || c.type === type) &&
        (grade === "all" || (grade === "graded") === GRADED(c.condition)) &&
        (!s || c.name.toLowerCase().includes(s) || c.set.toLowerCase().includes(s)),
    );
    if (sort === "low") out.sort((a, b) => a.usd - b.usd);
    if (sort === "high") out.sort((a, b) => b.usd - a.usd);
    if (sort === "new") out.sort((a, b) => b.year - a.year);
    if (sort === "old") out.sort((a, b) => a.year - b.year);
    return out;
  }, [type, grade, q, sort]);

  // record where the cards are, then let Flip move them to their new places
  const change = (fn: () => void) => {
    if (grid.current) flipState.current = Flip.getState(grid.current.querySelectorAll(".tile"));
    fn();
  };
  useLayoutEffect(() => {
    if (!flipState.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    Flip.from(flipState.current, {
      duration: 0.4, ease: "power3.out", absolute: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.2 }),
    });
    flipState.current = null;
  }, [list]);

  useGSAP(() => {
    gsap.from(".tile", { y: 10, opacity: 0, stagger: 0.04, duration: 0.4, delay: 0.1 });
  }, { scope: grid });

  return (
    <div className="mx-auto max-w-[1280px] px-6 pt-28 sm:px-8">
      <h1 className="font-serif text-[44px] leading-[1.1] tracking-[-0.02em]">All cards</h1>
      <p className="mt-2 text-ink-2">Every card is condition-checked and ships sleeved in a top-loader</p>

      <div className="sticky top-16 z-30 -mx-6 mt-8 border-b border-hair bg-page/95 px-6 py-4 backdrop-blur-md sm:-mx-8 sm:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative md:w-72">
            <Search size={16} strokeWidth={1.5} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
            <input className="field pl-10" placeholder="Search" value={q} onChange={(e) => change(() => setQ(e.target.value))} aria-label="Search cards or sets" />
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="chip" aria-pressed={type === "all"} onClick={() => change(() => setType("all"))}>All types</button>
            {TYPES.map((t) => (
              <button key={t} className="chip" aria-pressed={type === t} onClick={() => change(() => setType(t))}>
                <span className="h-2 w-2 rounded-full" style={{ background: TYPE_DOT[t] }} aria-hidden />
                {t}
              </button>
            ))}
          </div>
          <div className="flex gap-2 md:ml-auto">
            <select className="field h-8 w-auto min-w-[156px] text-[14px]" value={grade} onChange={(e) => change(() => setGrade(e.target.value as typeof grade))} aria-label="Raw or graded">
              <option value="all">Raw and graded</option>
              <option value="raw">Raw only</option>
              <option value="graded">Graded only</option>
            </select>
            <select className="field h-8 w-auto text-[14px]" value={sort} onChange={(e) => change(() => setSort(e.target.value as Sort))} aria-label="Sort">
              <option value="featured">Featured</option>
              <option value="low">Price, low to high</option>
              <option value="high">Price, high to low</option>
              <option value="new">Newest set</option>
              <option value="old">Oldest set</option>
            </select>
          </div>
        </div>
      </div>

      <p className="mt-6 font-mono text-[12px] text-ink-3" aria-live="polite">{list.length} of {STOCK.length} cards</p>

      <div ref={grid} className="mt-6 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
        {list.map((card) => (
          <div key={card.id} data-flip-id={card.id} className="tile">
            <Tile card={card} />
          </div>
        ))}
        {list.length === 0 && (
          <p className="col-span-full rounded-2xl p-12 text-center text-ink-2 shadow-[inset_0_0_0_1px_var(--color-hair)]">
            No cards match these filters
          </p>
        )}
      </div>
    </div>
  );
}

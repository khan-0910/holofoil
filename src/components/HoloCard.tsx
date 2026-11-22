import { useRef, useState, type PointerEvent } from "react";
import { image, type StockItem } from "@/data/stock";

type Props = {
  card: StockItem;
  className?: string;
  interactive?: boolean;
  large?: boolean;
  eager?: boolean;
};

/** A real card image in a top-loader. It tilts a little toward the pointer and catches light. */
export default function HoloCard({ card, className = "", interactive = true, large = false, eager = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !interactive || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - y) * 8}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
    el.style.setProperty("--lx", `${x * 100}%`);
    el.style.setProperty("--ly", `${y * 100}%`);
    el.style.setProperty("--glare", "1");
  };
  const leave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--glare", "0");
  };

  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={`loader ${className}`}>
      <div className="loader-art">
        {failed ? (
          <div className="grid h-full place-items-center p-4 text-center text-[13px] text-ink-3">
            {card.name}
            <br />
            {card.set}
          </div>
        ) : (
          <img
            src={image(card.id, large)}
            alt={`${card.name}, ${card.set}`}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
            onError={() => setFailed(true)}
          />
        )}
        <div className="loader-glare" />
      </div>
    </div>
  );
}

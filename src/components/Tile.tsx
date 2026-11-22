import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import HoloCard from "./HoloCard";
import { TYPE_DOT, type StockItem } from "@/data/stock";
import { useStore } from "@/lib/store";

/** One card in a grid: top-loader with its price sticker, then name and meta. */
export default function Tile({ card }: { card: StockItem }) {
  const { add, notify, price, cart } = useStore();
  const inCart = cart.find((l) => l.id === card.id)?.qty ?? 0;
  const soldOut = card.qty - inCart <= 0;

  return (
    <article className="group">
      <Link to={`/card/${card.id}`} className="relative block" aria-label={`${card.name}, ${card.set}, ${price(card.usd)}`}>
        <HoloCard card={card} />
        <span className="sticker absolute -bottom-2 right-3">
          {price(card.usd)}
          <small>{card.condition === "Near Mint" ? "NM" : card.condition === "Lightly Played" ? "LP" : card.condition}</small>
        </span>
      </Link>
      <div className="mt-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium">{card.name}</p>
          <p className="mt-0.5 flex items-center gap-2 truncate text-[13px] text-ink-2">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: TYPE_DOT[card.type] }} aria-hidden />
            {card.set} · {card.year}
          </p>
        </div>
        <button
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-2 shadow-[inset_0_0_0_1px_var(--color-hair-2)] transition-colors hover:bg-ink hover:text-card disabled:opacity-40"
          onClick={() => { add(card.id); notify(`${card.name} added to cart`); }}
          disabled={soldOut}
          aria-label={soldOut ? `${card.name} sold out` : `Add ${card.name} to cart`}
        >
          <Plus size={16} strokeWidth={1.5} />
        </button>
      </div>
    </article>
  );
}

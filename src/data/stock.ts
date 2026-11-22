/**
 * THE STOCK LIST
 *
 * To add a card, add one line to STOCK below (or run `npm run add-card`, see the README).
 *
 *   id         the card's id on pokemontcg.io, "<set>-<number>". The picture loads from it.
 *              Find it by searching the card at https://pokemontcg.io and copying the end of the URL.
 *   name, set, rarity, type   shown in the shop
 *   condition  "Near Mint" | "Lightly Played" | "PSA 9" | "PSA 10" ...
 *   usd        price in US dollars. Rupee, euro and pound prices are worked out from it.
 *   qty        copies in stock. Set to 0 to show it as sold out.
 */

export type Energy = "Fire" | "Water" | "Grass" | "Lightning" | "Psychic" | "Darkness" | "Dragon" | "Fighting" | "Colorless";

export type StockItem = {
  id: string;
  name: string;
  set: string;
  year: number;
  rarity: string;
  type: Energy;
  condition: string;
  usd: number;
  qty: number;
};

// prettier-ignore
export const STOCK: StockItem[] = [
  { id: "sv3pt5-199", name: "Charizard ex", set: "151", year: 2023, rarity: "Special Illustration Rare", type: "Fire", condition: "Near Mint", usd: 118, qty: 2 },
  { id: "swsh7-215", name: "Umbreon VMAX", set: "Evolving Skies", year: 2021, rarity: "Rainbow Rare", type: "Darkness", condition: "PSA 9", usd: 265, qty: 1 },
  { id: "sv8pt5-161", name: "Umbreon ex", set: "Prismatic Evolutions", year: 2025, rarity: "Special Illustration Rare", type: "Darkness", condition: "Near Mint", usd: 1050, qty: 1 },
  { id: "sv3-223", name: "Charizard ex", set: "Obsidian Flames", year: 2023, rarity: "Special Illustration Rare", type: "Darkness", condition: "PSA 10", usd: 142, qty: 1 },
  { id: "swsh4-188", name: "Pikachu VMAX", set: "Vivid Voltage", year: 2020, rarity: "Rainbow Rare", type: "Lightning", condition: "Near Mint", usd: 172, qty: 2 },
  { id: "swsh7-218", name: "Rayquaza VMAX", set: "Evolving Skies", year: 2021, rarity: "Rainbow Rare", type: "Dragon", condition: "Near Mint", usd: 148, qty: 1 },
  { id: "sv3pt5-200", name: "Blastoise ex", set: "151", year: 2023, rarity: "Special Illustration Rare", type: "Water", condition: "Near Mint", usd: 64, qty: 3 },
  { id: "sv3pt5-198", name: "Venusaur ex", set: "151", year: 2023, rarity: "Special Illustration Rare", type: "Grass", condition: "Near Mint", usd: 52, qty: 3 },
  { id: "sv4pt5-232", name: "Mew ex", set: "Paldean Fates", year: 2024, rarity: "Special Illustration Rare", type: "Psychic", condition: "Near Mint", usd: 96, qty: 2 },
  { id: "swsh8-271", name: "Gengar VMAX", set: "Fusion Strike", year: 2021, rarity: "Rainbow Rare", type: "Darkness", condition: "Lightly Played", usd: 210, qty: 1 },
  { id: "sv1-245", name: "Gardevoir ex", set: "Scarlet & Violet", year: 2023, rarity: "Special Illustration Rare", type: "Psychic", condition: "Near Mint", usd: 34, qty: 4 },
  { id: "swsh7-205", name: "Leafeon VMAX", set: "Evolving Skies", year: 2021, rarity: "Rainbow Rare", type: "Grass", condition: "Near Mint", usd: 88, qty: 2 },
  { id: "swsh9-174", name: "Charizard VSTAR", set: "Brilliant Stars", year: 2022, rarity: "Rainbow Rare", type: "Fire", condition: "Near Mint", usd: 58, qty: 3 },
  { id: "swsh12pt5gg-GG44", name: "Mewtwo VSTAR", set: "Crown Zenith", year: 2023, rarity: "Galarian Gallery", type: "Psychic", condition: "Near Mint", usd: 26, qty: 5 },
  { id: "sm35-76", name: "Mewtwo-GX", set: "Shining Legends", year: 2017, rarity: "Rainbow Rare", type: "Psychic", condition: "Near Mint", usd: 42, qty: 2 },
  { id: "swsh11-186", name: "Giratina V", set: "Lost Origin", year: 2022, rarity: "Ultra Rare", type: "Dragon", condition: "Near Mint", usd: 310, qty: 1 },
  { id: "swsh12pt5-160", name: "Pikachu", set: "Crown Zenith", year: 2023, rarity: "Secret Rare", type: "Lightning", condition: "Near Mint", usd: 18, qty: 6 },
  { id: "base1-4", name: "Charizard", set: "Base Set", year: 1999, rarity: "Holo Rare", type: "Fire", condition: "Lightly Played", usd: 420, qty: 1 },
  { id: "base1-2", name: "Blastoise", set: "Base Set", year: 1999, rarity: "Holo Rare", type: "Water", condition: "Lightly Played", usd: 135, qty: 1 },
  { id: "sv2-232", name: "Wo-Chien ex", set: "Paldea Evolved", year: 2023, rarity: "Ultra Rare", type: "Grass", condition: "Near Mint", usd: 6, qty: 8 },
  { id: "sv3pt5-151", name: "Mew ex", set: "151", year: 2023, rarity: "Double Rare", type: "Psychic", condition: "Near Mint", usd: 4, qty: 12 },
  { id: "sv3pt5-150", name: "Mewtwo", set: "151", year: 2023, rarity: "Rare", type: "Psychic", condition: "Near Mint", usd: 2, qty: 15 },
  { id: "cel25-4", name: "Palkia", set: "Celebrations", year: 2021, rarity: "Rare", type: "Water", condition: "Near Mint", usd: 3, qty: 10 },
  { id: "sv3pt5-25", name: "Pikachu", set: "151", year: 2023, rarity: "Common", type: "Lightning", condition: "Near Mint", usd: 1, qty: 30 },
  { id: "sv3pt5-6", name: "Charizard ex", set: "151", year: 2023, rarity: "Double Rare", type: "Fire", condition: "Near Mint", usd: 15, qty: 3 },
];

/* ---------- helpers ---------- */

export const image = (id: string, large = false) => {
  const cut = id.lastIndexOf("-");
  return `https://images.pokemontcg.io/${id.slice(0, cut)}/${id.slice(cut + 1)}${large ? "_hires" : ""}.png`;
};

export const byId = (id: string) => STOCK.find((c) => c.id === id);

export const TYPES: Energy[] = [...new Set(STOCK.map((c) => c.type))];

/** Shown as a small dot next to the type name. Muted so the card art stays the colour on screen. */
export const TYPE_DOT: Record<Energy, string> = {
  Fire: "#c8553d", Water: "#3f6fa8", Grass: "#4f7d4a", Lightning: "#c9a227", Psychic: "#8a5a9e",
  Darkness: "#3b3a45", Dragon: "#8a7a3a", Fighting: "#9a5a3a", Colorless: "#9a958a",
};

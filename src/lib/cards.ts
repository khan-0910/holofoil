export type CardType = "fire" | "water" | "grass" | "electric" | "psychic" | "dark" | "dragon" | "fighting";
export type Rarity = "Common" | "Rare" | "Holo Rare" | "Ultra Rare" | "Secret Rare";

export type Card = {
  id: string;
  name: string;
  set: string;
  number: string;
  type: CardType;
  rarity: Rarity;
  hp: number;
  condition: "Near Mint" | "Lightly Played" | "PSA 9" | "PSA 10";
  price: number;
  stock: number;
  year: number;
};

export const TYPE_STYLE: Record<CardType, { label: string; from: string; to: string; ink: string }> = {
  fire: { label: "Fire", from: "#ff7a3d", to: "#c2185b", ink: "#ffd2b8" },
  water: { label: "Water", from: "#3dc8ff", to: "#2546d6", ink: "#cdefff" },
  grass: { label: "Grass", from: "#7ee26b", to: "#0f8a5f", ink: "#dcffd2" },
  electric: { label: "Lightning", from: "#ffe03d", to: "#f08a00", ink: "#fff6c4" },
  psychic: { label: "Psychic", from: "#ff6ad5", to: "#7b2ff7", ink: "#ffd6f5" },
  dark: { label: "Darkness", from: "#5b5f8a", to: "#141629", ink: "#d3d6ff" },
  dragon: { label: "Dragon", from: "#e8c35a", to: "#3a6b4f", ink: "#fff1c8" },
  fighting: { label: "Fighting", from: "#e0915a", to: "#7a3418", ink: "#ffe0c8" },
};

export const RARITIES: Rarity[] = ["Common", "Rare", "Holo Rare", "Ultra Rare", "Secret Rare"];

const c = (
  id: string, name: string, set: string, number: string, type: CardType, rarity: Rarity,
  hp: number, condition: Card["condition"], price: number, stock: number, year: number,
): Card => ({ id, name, set, number, type, rarity, hp, condition, price, stock, year });

export const CARDS: Card[] = [
  c("charizard-ex", "Charizard ex", "Obsidian Flames", "223/197", "fire", "Secret Rare", 330, "PSA 10", 389, 2, 2023),
  c("pikachu-vmax", "Pikachu VMAX", "Vivid Voltage", "188/185", "electric", "Secret Rare", 310, "Near Mint", 214, 3, 2020),
  c("umbreon-vmax", "Umbreon VMAX", "Evolving Skies", "215/203", "dark", "Secret Rare", 310, "PSA 9", 649, 1, 2021),
  c("rayquaza-vmax", "Rayquaza VMAX", "Evolving Skies", "218/203", "dragon", "Secret Rare", 320, "Near Mint", 412, 2, 2021),
  c("mewtwo-gx", "Mewtwo GX", "Shining Legends", "76/73", "psychic", "Ultra Rare", 190, "Near Mint", 96, 4, 2017),
  c("blastoise-ex", "Blastoise ex", "151", "200/165", "water", "Ultra Rare", 330, "Near Mint", 74, 5, 2023),
  c("venusaur-ex", "Venusaur ex", "151", "198/165", "grass", "Ultra Rare", 340, "Near Mint", 58, 6, 2023),
  c("gengar-vmax", "Gengar VMAX", "Fusion Strike", "271/264", "psychic", "Secret Rare", 320, "Lightly Played", 238, 2, 2021),
  c("lucario-v", "Lucario V", "Crown Zenith", "GG34", "fighting", "Ultra Rare", 210, "Near Mint", 22, 9, 2023),
  c("gyarados-ex", "Gyarados ex", "Scarlet & Violet", "225/198", "water", "Ultra Rare", 300, "Near Mint", 31, 7, 2023),
  c("raichu", "Raichu", "Base Set Reprint", "14/102", "electric", "Holo Rare", 80, "Lightly Played", 44, 3, 2016),
  c("eevee", "Eevee", "Prismatic Evolutions", "074/131", "fighting", "Common", 60, "Near Mint", 2, 40, 2025),
  c("dragonite-v", "Dragonite V", "Pokémon GO", "076/078", "dragon", "Ultra Rare", 230, "Near Mint", 28, 6, 2022),
  c("arcanine", "Arcanine", "Paldea Evolved", "032/193", "fire", "Rare", 130, "Near Mint", 4, 18, 2023),
  c("lapras-v", "Lapras V", "Sword & Shield", "186/202", "water", "Ultra Rare", 210, "PSA 9", 56, 3, 2020),
  c("sceptile", "Sceptile", "Celestial Storm", "8/168", "grass", "Holo Rare", 150, "Near Mint", 9, 11, 2018),
  c("darkrai-vstar", "Darkrai VSTAR", "Astral Radiance", "189/189", "dark", "Secret Rare", 270, "Near Mint", 67, 4, 2022),
  c("gardevoir-ex", "Gardevoir ex", "Scarlet & Violet", "245/198", "psychic", "Secret Rare", 310, "PSA 10", 154, 2, 2023),
  c("zapdos", "Zapdos", "Pokémon 151", "145/165", "electric", "Rare", 120, "Near Mint", 5, 22, 2023),
  c("moltres", "Moltres", "Pokémon 151", "146/165", "fire", "Rare", 120, "Near Mint", 5, 20, 2023),
  c("tyranitar-v", "Tyranitar V", "Battle Styles", "155/163", "dark", "Ultra Rare", 230, "Lightly Played", 39, 5, 2021),
  c("machamp", "Machamp", "Astral Radiance", "072/189", "fighting", "Holo Rare", 170, "Near Mint", 6, 14, 2022),
  c("leafeon-vmax", "Leafeon VMAX", "Evolving Skies", "205/203", "grass", "Secret Rare", 310, "Near Mint", 188, 2, 2021),
  c("bulbasaur", "Bulbasaur", "Pokémon 151", "001/165", "grass", "Common", 70, "Near Mint", 1, 60, 2023),
];

export const byId = (id: string) => CARDS.find((x) => x.id === id);

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: n % 1 ? 2 : 0 });

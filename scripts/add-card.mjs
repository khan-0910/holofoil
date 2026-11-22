// Adds a card to src/data/stock.ts by looking it up on pokemontcg.io.
//
//   npm run add-card -- <id> <usd price> <qty> ["condition"]
//   npm run add-card -- sv3pt5-6 12 4 "Near Mint"
//
// If the card is already listed, its price, quantity and condition are updated instead.
import { readFile, writeFile } from "node:fs/promises";

const [id, usd, qty, condition = "Near Mint"] = process.argv.slice(2);
if (!id || !usd || !qty) {
  console.error('Usage: npm run add-card -- <id> <usd price> <qty> ["condition"]');
  process.exit(1);
}

const file = new URL("../src/data/stock.ts", import.meta.url);
let src = await readFile(file, "utf8");

const existing = new RegExp(`\\{ id: "${id}",[^\\n]*\\},`);
if (existing.test(src)) {
  src = src.replace(existing, (line) =>
    line
      .replace(/usd: [\d.]+/, `usd: ${Number(usd)}`)
      .replace(/qty: \d+/, `qty: ${Number(qty)}`)
      .replace(/condition: "[^"]*"/, `condition: ${JSON.stringify(condition)}`),
  );
  await writeFile(file, src);
  console.log(`Updated ${id}: $${usd}, ${qty} in stock, ${condition}`);
  process.exit(0);
}

// the API is sometimes slow, so retry a few times
let card;
for (let i = 0; i < 5 && !card; i++) {
  try {
    const res = await fetch(`https://api.pokemontcg.io/v2/cards/${id}`);
    if (res.ok) card = (await res.json()).data;
    else if (res.status === 404) break;
  } catch {}
  if (!card) await new Promise((r) => setTimeout(r, 1500));
}
if (!card) {
  console.error(`Couldn't find ${id} on pokemontcg.io. Check the id, or add the line to src/data/stock.ts by hand.`);
  process.exit(1);
}

const TYPES = ["Fire", "Water", "Grass", "Lightning", "Psychic", "Darkness", "Dragon", "Fighting", "Colorless"];
const type = TYPES.includes(card.types?.[0]) ? card.types[0] : "Colorless";
const line = `  { id: ${JSON.stringify(id)}, name: ${JSON.stringify(card.name)}, set: ${JSON.stringify(card.set.name)}, year: ${card.set.releaseDate.slice(0, 4)}, rarity: ${JSON.stringify(card.rarity ?? "Promo")}, type: "${type}", condition: ${JSON.stringify(condition)}, usd: ${Number(usd)}, qty: ${Number(qty)} },\n`;

src = src.replace(/\n\];\n/, `\n${line}];\n`);
await writeFile(file, src);
console.log(`Added ${card.name} (${card.set.name}) at $${usd}, ${qty} in stock`);

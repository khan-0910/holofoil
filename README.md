# Holofoil

A shop for single Pokémon cards, raw and graded. It's a remake of my Grade 12 Python e-commerce project (cart, checkout, login, register, logout and a password database), rebuilt as a modern front end.

This is a portfolio demo: nothing is charged and nothing ships. Accounts and orders stay in your browser.

## Features

- **Real card images,** loaded from the Pokémon TCG API's image CDN using each card's id.
- **Shop:** search, filter by type and by raw or graded, and sort by price or set age. The grid rearranges itself with GSAP Flip.
- **Prices in ₹, $, € and £.** Pick a currency in the header and it's remembered. Prices are stored in dollars and converted with the rates in `src/lib/currency.ts`.
- **Cart:** a slide-out drawer, stock limits, and free shipping over $100 (or its equivalent).
- **Accounts:** register, sign in and sign out. Passwords are stored as salted PBKDF2-SHA-256 hashes (Web Crypto, 120,000 iterations), never as text.
- **Checkout:** requires sign-in and saves the order, in the currency you paid in, to your history.
- **Motion with a purpose:** a booster pack that opens as you scroll (a pinned ScrollTrigger timeline), Lenis smooth scrolling, a card tilt that catches light, and React Bits SplitText and CountUp. Visitors who prefer reduced motion get the shop without it.

## Adding stock

All stock lives in one file, `src/data/stock.ts`. The easiest way to add a card is the script, which looks the card up by its id:

```bash
npm run add-card -- <id> <price in USD> <quantity> ["condition"]
```

```bash
npm run add-card -- sv3pt5-6 14 4 "Near Mint"
```

To find a card's id, search it on [pokemontcg.io](https://pokemontcg.io) and copy the end of its URL, like `sv3pt5-6` (set `sv3pt5`, number `6`). Running the command again for a card that's already listed updates its price, quantity and condition. Set the quantity to `0` to mark it sold out.

You can also edit `src/data/stock.ts` by hand: one line per card.

## Stack

React 19, Vite, TypeScript, Tailwind CSS 4, GSAP (ScrollTrigger, Flip, SplitText) with `@gsap/react`, Lenis, React Bits (SplitText, CountUp) and lucide icons.

## Run it

```bash
npm install
npm run dev
```

```bash
npm run build
```

The build uses a relative base and hash routes, so `dist/` works at any GitHub Pages path. `.github/workflows/deploy.yml` deploys it on every push to `main`.

## Disclaimer

Not affiliated with Nintendo, Creatures, GAME FREAK or The Pokémon Company. Card images come from the Pokémon TCG API and belong to their owners.

# HOLOFOIL

An animated trading card shop. It's a remake of my Grade 12 Python e-commerce project (cart, checkout, login, register, logout and a password database), rebuilt as a modern front end with a lot of motion.

This is a portfolio demo: nothing is charged and nothing ships. Accounts and orders stay in your browser.

## Features

- **Shop:** 24 cards. Search, filter by type and rarity, and sort. The grid rearranges itself with GSAP Flip.
- **Holo cards:** each card tilts toward your pointer and shows a foil layer. Secret rares get a stronger prismatic foil. All card art is original CSS and SVG.
- **Homepage:** a fanned hero deck, a marquee that reacts to scroll speed, a booster pack that tears open as you scroll (a pinned ScrollTrigger timeline), counters and staggered reveals.
- **Cart:** a slide-out drawer, stock limits, free shipping over $100, and a card that flies to the cart when you add it.
- **Accounts:** register, sign in and sign out. Passwords are stored as salted PBKDF2-SHA-256 hashes (Web Crypto, 120,000 iterations), never as text.
- **Checkout:** requires sign-in, saves the order to your history, and ends with a confetti reveal.
- **Reduced motion:** visitors who prefer reduced motion get the shop without the heavy animation.

## Stack

React 19, Vite, TypeScript, Tailwind CSS 4, GSAP (ScrollTrigger, Flip, SplitText) with `@gsap/react`, Lenis, and React Bits components (SplitText, Magnet, CountUp, ScrollVelocity, ClickSpark).

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

Not affiliated with Nintendo, Creatures, GAME FREAK or The Pokémon Company. Card names are listed the way a reseller would list them. No official artwork is used.

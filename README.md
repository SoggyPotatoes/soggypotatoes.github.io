# Soggy Potatoes Site

This repository contains the static files for the Soggy Potatoes website.

## Running Tests

The project uses **Jest** with **jsdom** to run browser-style unit tests. After installing dependencies with `npm install`, run:

```bash
npm test
```

This executes any files under the `tests/` directory. `addToCart.test.js` loads `shop.html` in JSDOM, simulates adding items to the cart, and verifies that they are saved to `localStorage`.

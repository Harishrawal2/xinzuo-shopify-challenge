## What I picked
I picked the dead Bundle Builder page at `/pages/bundle-builder`.

## Why it's the highest-impact thing here
This page is directly tied to conversion. A customer who lands here expects to build a knife bundle, compare series, understand discounts, and add products to cart. Instead, the current page does not provide a usable buying flow. Fixing this is more valuable than a cosmetic change because it restores a revenue-focused path.

## What I did
I built a lightweight bundle builder inside the existing Shopify theme structure. The page now has series tabs, selectable product cards, visible tiered discount messaging, and a sticky bundle summary with an add-to-cart action. I kept the implementation small and theme-native using Liquid, CSS, and JavaScript.

## What I'd do next
I would connect the discount tiers to Shopify Functions or automatic discounts, add product availability handling, and test the full add-to-cart flow across mobile and desktop.

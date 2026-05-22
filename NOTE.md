## What I picked

I picked the dead Bundle Builder page at `/pages/bundle-builder`.

## Why it's the highest-impact thing here

This page is directly tied to conversion. A customer landing there expects to build a knife bundle, compare product series, understand savings, and add products to cart. A dead or default page breaks a revenue-focused flow, so this was higher impact than a small visual polish fix.

## What I did

I added a lightweight Shopify-native bundle builder using the existing theme structure. The implementation includes a dedicated page template, Liquid section, scoped CSS, and vanilla JavaScript. Customers can switch between series tabs, select products, see estimated tier savings, review a sticky bundle summary, and add selected products to cart.

During dev-store preview, the original theme also had stale Shopify-hosted video references from the source store. I cleared those invalid references only to unblock Shopify preview; the challenge fix remains focused on the Bundle Builder.

## What I'd do next

I would connect the tier messaging to real Shopify discounts or Functions, add product availability edge cases, and test the full cart and checkout flow across mobile and desktop.
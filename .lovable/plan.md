# Just Minimal community shop

## Build
- Replace the blank page with a responsive Just Minimal storefront matching the supplied monochrome editorial direction.
- Add the six supplied products, prices, discounts, descriptions, category filters, and product imagery.
- Add size selection and stock limits: exact quantities where supplied, and available sizing without a displayed count where stock was left unspecified.
- Add a persistent cart with size-specific items, quantity controls, savings totals, and stock enforcement.
- Add checkout fields, payment instructions, and a pre-filled WhatsApp order sent to the supplied number.

## Experience
- Keep the community-access messaging and premium fashion presentation.
- Support desktop and mobile layouts, accessible dialogs, clear sold-out states, and reduced-motion preferences.
- Add app-specific page metadata and verify the main shopping flow in the live preview.

## Technical details
- Implement as the existing TanStack Start home route with React state and browser storage.
- Use semantic design tokens in the global stylesheet and local generated product assets.
- No database is needed; stock is treated as catalogue availability rather than decremented globally after an order.

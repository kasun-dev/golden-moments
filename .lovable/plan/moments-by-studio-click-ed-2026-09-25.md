# Moments by Studio Click.ed

## Goal
Build a polished, interactive wedding invitation and RSVP platform for Sri Lankan celebrations, including multi-day Kandyan wedding events.

## What will be built
- **Public storefront:** premium dark landing page, three invitation themes, guest-count pricing calculator, and lead enquiry form.
- **Secure sign-in:** email/password and Google access for Studio Click.ed staff and couples.
- **Admin workspace:** event overview cards, invitation and RSVP totals, agreement activation control, and event detail views.
- **Guest management:** smart CSV import that groups phone-less rows under the preceding primary guest, selectable guest list, and guided WhatsApp invitation queue.
- **Couple portal:** read-only RSVP totals, progress visualization, dietary summary, and attendee list with live updates.
- **Guest invitation:** token-based personalized invitation, multi-day schedule, template-specific styling, household RSVP form, expiry thank-you state, and confirmation animation.

## Data and access
- Create events, guests, sub-guests, and user roles with secure access rules.
- Store admin roles separately and verify permissions on the server.
- Allow public lead submission and token-scoped guest invitation access without exposing other event data.
- Seed one complete demonstration wedding so every key view is immediately usable.

## Design direction
- Rich zinc, warm ivory, and restrained metallic gold palette.
- Playfair Display and Cormorant Garamond for editorial invitation typography, with a clean sans-serif for operational screens.
- Fine borders, mandala linework, floral ornament, subtle texture, and restrained fade/scroll motion.
- Mobile-first guest RSVP flow; dense, scannable desktop admin workspace.

## Technical approach
- Use the project’s TanStack Start routing while matching the requested page URLs and React/Tailwind experience.
- Use Lovable Cloud for authentication, database persistence, and realtime RSVP updates.
- Parse CSV files in the browser, validate row relationships, then persist through authenticated server functions.
- Open WhatsApp links sequentially and mark each successful handoff in the database.
- Add route-specific metadata and validate desktop and mobile rendering.

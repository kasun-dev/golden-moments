# Golden Moments

You are an expert full-stack Next.js developer and UX/UI designer. I want to build a premium, full-stack web application called "Moments by Studio Click.ed". This is a high-end SaaS platform for digital wedding invitations and RSVP management, tailored specifically for the Sri Lankan market (including multi-day Kandyan weddings).

TECH STACK:
Next.js (App Router), React, Tailwind CSS, Supabase (PostgreSQL & Auth), Lucide Icons.

APP OVERVIEW & USER PERSONAS:
1. Public Users: Can view the storefront, see template designs, and use a pricing calculator based on guest headcount.
2. Admin (Studio Click.ed): Manages all events, uploads guest lists via CSV, monitors RSVPs, and triggers bulk WhatsApp invitations.
3. The Couple (Clients): Gets a secure, read-only dashboard to watch their live RSVP headcount and dietary requirements.
4. The Guests: Receive a unique URL via WhatsApp, view a stunning digital invitation, and submit their RSVP (including for their family members).

DATABASE SCHEMA (Supabase):
1. `events`: id, owner_id (Admin), title, slug (unique), event_dates (JSON array for multi-day events like Poruwa + Reception), locations (JSON array), template_id, status (enum: 'lead', 'onboarding', 'active', 'closed'), rsvp_deadline.
2. `guests`: id, event_id, first_name, phone, access_token (uuid), rsvp_status ('pending', 'confirmed', 'declined'), is_attending (boolean), invitation_sent (boolean).
3. `sub_guests`: id, parent_guest_id, full_name, is_attending (boolean).

CORE ROUTES & FEATURES REQUIRED:

1. PUBLIC STOREFRONT (`/`)
- A visually striking landing page with a premium, dark-mode aesthetic.
- A "Template Gallery" showcasing 3 themes: Classic Dark, Soft Lily, and Royal Kandyan Heritage.
- A "Pricing Calculator": A slider where users select their guest count, outputting a straightforward price.
- A Lead Capture form (Name, Event Dates, Estimated Guests) that saves to the `events` table with the status 'lead'.

2. ADMIN WORKSPACE (`/dashboard`)
- Authenticated via Supabase.
- Displays a grid of all events with high-level stats (Total Invites, Confirmed Heads).
- Events must have a toggle to mark "Agreement Signed" (changes status from 'onboarding' to 'active').

3. EVENT MANAGEMENT (`/dashboard/events/[id]`)
- A detailed view for a specific event's guest list.
- SMART CSV IMPORT: A drag-and-drop CSV uploader. Logic: Rows with phone numbers are created as `guests` (Primary). Rows directly underneath *without* phone numbers are created as `sub_guests` linked to the preceding Primary guest.
- BATCH WHATSAPP SENDER: A modal that cycles through selected guests. It generates a unique URL (e.g., `https://domain.com/v/[slug]?guest=[access_token]`). It opens `https://wa.me/94[Phone]?text=[EncodedMessage]` in a new tab, marks the `invitation_sent` boolean as true in the database, and auto-advances to the next guest in the queue. This feature must be DISABLED if the event status is not 'active'.

4. COUPLE'S PORTAL (`/portal/[event_id]`)
- A beautiful, read-only dashboard for the clients.
- Shows live progress bars of RSVPs (Pending vs. Confirmed vs. Declined) and a detailed list of who is attending.

5. GUEST INVITATION VIEW (`/v/[slug]`)
- Reads the `?guest=[token]` query parameter to identify the user.
- AUTO-EXPIRY LOGIC: If the current date is 5 days past the final event date, render a "Thank you for celebrating with us" page instead of the invitation.
- Renders the assigned React template based on `event.template_id`.
- Contains a beautifully styled RSVP form allowing the Primary Guest to check "Attending" for themselves AND toggle attendance for each of their linked `sub_guests`. Updates Supabase on submit and shows a success animation.

DESIGN SYSTEM & AESTHETICS:
- The UI must feel incredibly high-end, using rich zincs (#09090b), warm ivories, and metallic gold accents (#D4AF37).
- Use `lucide-react` for elegant, thin iconography.
- The Guest Invitation views must use beautiful inline SVG mandalas, floral borders, and elegant typography (Playfair Display, Cormorant Garamond) to mimic expensive physical cardstock.
- Include subtle scroll animations and fade-ins for a premium feel.

Please build the complete foundational structure, UI components, and mock the Supabase logic so the app is visually complete and highly interactive.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0dc9fddf-c33c-493c-8704-8d106c71cdc4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

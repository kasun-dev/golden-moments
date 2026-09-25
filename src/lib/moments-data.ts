export const demoEvent = {
  id: "8d76b92e-25e8-4f76-b7e0-b6d974a66e41",
  title: "The Wedding of Amaya & Dilan",
  slug: "amaya-and-dilan",
  coupleNames: "Amaya & Dilan",
  status: "active" as const,
  templateId: "royal-kandyan",
  rsvpDeadline: "2026-11-15",
  dates: [
    { label: "Poruwa Ceremony", date: "28 November 2026", time: "9:18 in the morning" },
    { label: "Evening Reception", date: "29 November 2026", time: "7:00 in the evening" },
  ],
  locations: [
    { label: "The Grand Kandyan", address: "89/10, Lady Gordon's Drive, Kandy" },
    { label: "The Golden Crown", address: "322 Udagama, Ampitiya, Kandy" },
  ],
};

export const demoGuests = [
  { id: "g1", name: "Nimal Perera", phone: "077 123 4567", status: "confirmed", heads: 3, sent: true, dietary: "Vegetarian × 1" },
  { id: "g2", name: "Shalini Fernando", phone: "071 845 2201", status: "confirmed", heads: 2, sent: true, dietary: "None" },
  { id: "g3", name: "Ruwan Jayasinghe", phone: "076 330 1998", status: "pending", heads: 4, sent: true, dietary: "—" },
  { id: "g4", name: "Ayesha Silva", phone: "077 905 4408", status: "declined", heads: 2, sent: true, dietary: "—" },
  { id: "g5", name: "Malith & family", phone: "075 228 7110", status: "pending", heads: 3, sent: false, dietary: "—" },
];

export const demoEvents = [
  { ...demoEvent, invites: 186, confirmed: 124, pending: 48, date: "28–29 Nov 2026" },
  { id: "e2", title: "Dinithi & Shehan", slug: "dinithi-shehan", status: "onboarding" as const, templateId: "soft-lily", invites: 92, confirmed: 0, pending: 92, date: "12 Dec 2026" },
  { id: "e3", title: "Meera & Ashwin", slug: "meera-ashwin", status: "lead" as const, templateId: "classic-dark", invites: 240, confirmed: 0, pending: 240, date: "18 Jan 2027" },
];

export const templates = [
  { id: "classic-dark", name: "Classic Dark", note: "Black tie, candlelight and timeless restraint.", className: "template-dark" },
  { id: "soft-lily", name: "Soft Lily", note: "Ivory paper, quiet florals and graceful warmth.", className: "template-lily" },
  { id: "royal-kandyan", name: "Royal Kandyan Heritage", note: "Ceremonial detail interpreted with modern elegance.", className: "template-royal" },
];
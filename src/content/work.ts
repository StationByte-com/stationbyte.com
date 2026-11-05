export const skedez = {
  slug: "skedez",
  name: "SkedEz",
  url: "https://skedez.com",
  description:
    "How StationByte designed, built and runs SkedEz, online booking for service businesses: booking pages, reminders, Google Calendar, teams and subscriptions.",
  summary: "Online booking for service businesses. We designed, built and run it, from the database to the reminders.",
  facts: [
    { k: "Type", v: "In-house product" },
    { k: "Our role", v: "Product, design, engineering, operations" },
    { k: "Platforms", v: "Web app and booking pages" },
    { k: "Status", v: "Live at skedez.com" },
  ],
  problem:
    "Hair salons, physiotherapists, personal trainers and consultants lose hours to back-and-forth messages about times, and to clients who forget. Many booking tools take a commission on each booking or charge per client. We wanted one that does neither, and that a business can set up on its own.",
  built: [
    { title: "A booking page per business", body: "Shared as a link in a bio, a Google profile or a website. Clients pick a service and any free time." },
    { title: "Reminders that send themselves", body: "Email 24 hours and 1 hour before every booking on all plans, and WhatsApp on paid plans." },
    { title: "Google Calendar", body: "On paid plans, bookings land in Google Calendar, with a Google Meet link when the service is online." },
    { title: "Teams", body: "Up to 20 people, each with their own services and working hours." },
    { title: "Clients", body: "A client list with CSV import, export any time, and a dashboard of bookings, cancellations and clients." },
    { title: "Six languages", body: "Booking pages in English, Portuguese, Spanish, French, German and Italian." },
    { title: "Plans and billing", body: "Free, Pro and Teams plans with a 15-day trial on paid plans, no commission on bookings." },
    { title: "Privacy built in", body: "Data export and account deletion from the settings, no support ticket needed." },
  ],
  notes: [
    {
      title: "Billing tested like it's money, because it is",
      body: "Checkout, plan changes and failed payments are covered by end-to-end tests, so money never depends on a manual check.",
    },
    {
      title: "One codebase for the app",
      body: "One cross-platform codebase serves the web app and is ready for iOS and Android, so a feature is built once.",
    },
    {
      title: "Self-serve from the first minute",
      body: "A business creates its booking page, adds services and shares the link on its own. The free plan needs no card.",
    },
  ],
  pricing: [
    { plan: "Free", price: "€0", note: "1 person, 1 service, 10 bookings a month" },
    { plan: "Pro", price: "€9.90/mo", note: "1 person, unlimited services and bookings, WhatsApp, Google Calendar" },
    { plan: "Teams", price: "€14.90/mo", note: "Up to 20 people, each with their own hours, everything in Pro" },
  ],
};

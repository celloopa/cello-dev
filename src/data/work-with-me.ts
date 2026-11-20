/**
 * The ways to work with Cello, in one place (CDEV-54). Read by WorkWithMe.astro on the home
 * page, About and the end of every case study. Prices are the ones Cello set for the new site
 * (BIZ-14, kept for the live site on CDEV-56): change them here and every page follows.
 */
export const bookingHref = "/book"; // 302 to the intro call on cal.com (public/_redirects)

export const workWithMe = {
  intro:
    "I design and build for small businesses and product teams: the brand, the site, the tools behind them, and the repeat work your team does every week. I’m also open to a full-time role with the right team.",
  availability: "Open for new work now. Calls Tuesday to Thursday.",
  ways: [
    { name: "Consult", detail: "One problem, on a call or in a private session.", price: "From $95 a session" },
    { name: "Retainer", detail: "Ongoing design and build each month. I build it, then your team runs it.", price: "From $1,500 a month" },
    { name: "In-house", detail: "A full-time role with the right team.", price: "Ask me about the role" },
  ],
  book: "Book a free intro call",
  email: "Email me",
  /** The short version at the end of a case study. */
  caseEnd: "I take on work like this for small businesses and product teams. The first call is free.",
} as const;

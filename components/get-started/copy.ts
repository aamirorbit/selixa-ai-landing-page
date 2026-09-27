// Strings for /get-started, from docs/pages/get-started.copy.md. Reused strings match
// ConversationCTA / InquiryForm / app/actions.ts exactly. Strings the sheet didn't have use the
// shortest honest wording (skip link, brief card labels/captions, "completed", noscript line),
// and the prefilled note says where the site came from (not "your last visit").

export const GS = {
  meta: {
    title: "Get started — Selixa",
    description:
      "Tell Selixa about your product in five quick steps: your site, your tools, what's on fire, and who you are. The team takes it from there.",
    ogTitle: "Get started with Selixa",
    ogDescription: "Five steps to your AI Product Manager.",
  },
  eyebrow: "Get started",
  rail: { labels: ["Website", "Tools", "Pains", "You", "Done"], counter: "Step {n} of 5", aria: "Setup progress", completed: ", completed" },
  buttons: { back: "Back", continue: "Continue", submit: "Request access", sending: "Sending", skip: "Skip" },
  site: {
    headline: "what are you building?",
    line: "Start with your product's website.",
    placeholder: "Enter your product’s website",
    label: "Your product’s website",
    invalid: "That doesn’t look like a website. Try something like acme.com.",
    prefilled: "From the site you entered. Change it if you like.",
    skip: "No site yet? Skip",
  },
  tools: {
    headline: "what do you use?",
    line: "Tap the tools your team works in.",
    selected: "{n} selected",
    none: "Pick any, or skip.",
    other: "Something else",
    otherPlaceholder: "Which tool?",
  },
  pains: {
    headline: "what’s on fire?",
    line: "Pick up to three.",
    counter: "{n} of 3",
    limit: "Three is plenty. Unpick one to swap.",
  },
  you: {
    headline: "last thing: you.",
    line: "So the team knows who to reply to.",
    name: "Full Name",
    email: "Work Email",
    role: "Your role",
    errors: { name: "Enter your full name.", email: "Enter a valid work email.", role: "Pick the closest role." },
    privacy: "We respect your privacy. No spam. Ever.",
  },
  done: {
    headline: (domain: string) => `Selixa will start by learning ${domain}.`,
    headlineNoSite: (first: string) => `You're on the list, ${first}.`,
    line: "Your note is with the team. If there’s a fit, you’ll hear from us within two business days.",
    next: ["The team reads what you sent.", "We reply by email to set up your first product."],
    next3: (domain: string) => `Selixa starts with ${domain} and the tools you picked.`,
    next3Generic: "Selixa starts with your product and your tools.",
    home: "Back to home",
  },
  brief: {
    website: "Website",
    tools: "Tools",
    onFire: "On fire",
    you: "You",
    none: "None picked",
    noSite: "None given",
    draft: "Draft",
    isolated: "Isolated",
    caption: "Only what you tell us.",
    doneCaption: (domain: string) => (domain ? `Sealed to ${domain}.` : "Sealed to your product."),
  },
  summary: { one: "One field needs attention.", many: "A couple of fields need attention." },
  noscript: "This form needs JavaScript. Use the contact page instead.",
} as const;

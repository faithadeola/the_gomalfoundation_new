export const giveContents = {
  give: {
    eyebrow: "Give",
    heading: "Support the work they started.",
    body: "Received in the spirit Baba and Mama gave — freely, and without asking twice.",
    miniHero: {
      eyebrow: "In loving memory · In living legacy",
      title: "The GOMAL Foundation",
      dates: "Revd. G.O. Lasehinde · 1949–2023  ·  Mrs. M.A. Lasehinde · 1955–2026",
      quote: "Nobody who came for help ever left the way they arrived.",
    },
    quote: {
      text: "Nobody who came for help ever left the way they arrived.",
      citation: "— Baba, as remembered by the family",
    },
    card: {
      heading: "Give a gift",
      subheading: "Any amount. Once, monthly, or yearly. Straight to the Foundation.",
      frequencyLabels: {
        once: "Give once",
        monthly: "Monthly",
        yearly: "Yearly",
      },
      presetValuesNaira: [10000, 25000, 50000, 100000],
      customAmountPrompt: "Enter a different amount →",
      customAmountPlaceholder: "Enter amount",
      currencySymbol: "₦",
      ctaIdle: "Give",
      ctaWithAmountTemplate: "Give {amount}",
      tertiaryLinks: {
        partner: "Partner with us — individuals & organisations →",
        volunteer: "Volunteer or mentor a student →",
      },
    },
    bank: {
      heading: "Give by bank transfer",
      accountNameLabel: "Account name",
      accountName: "Gabriel and Margaret Lasehinde",
      accountNumberLabel: "Account number",
      accountNumber: "2330170062",
      bankLabel: "Bank",
      bankName: "Zenith Bank",
      copyLabel: "Copy",
      copiedLabel: "Copied!",
      afterTransferNote:
        "After transferring, send your name and amount to give@lasehinde.org so we can acknowledge your gift.",
      internationalNote: "Giving from outside Nigeria? Email give@lasehinde.org and we'll arrange it.",
    },
    trustSignal: "",
  },
} as const;

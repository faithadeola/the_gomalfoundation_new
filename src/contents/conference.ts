export const conferenceContents = {
  conference: {
    section: {
      eyebrow: "Save the date",
      dateLocation: "December 2026 · Ogbomoso",
      heading: "Inaugural Couples' Conference",
      body: "A marriage that became a ministry — continued. For engaged couples, new couples, established couples, and those seeking counsel.",
      cta: "Register interest",
    },
    modal: {
      dateLocation: "December 2026 · Ogbomoso",
      heading: "Inaugural Couples' Conference",
      intro: "Register your interest. We will confirm details and reach out as December approaches.",
      closeLabel: "Close",
      submitCta: "Register interest",
      submittingCta: "Sending…",
      footnote: "We'll be in touch.",
    },
    attendanceOptions: [
      {
        value: "engaged",
        label: "Engaged couple",
        desc: "Planning your marriage and building your foundation early",
      },
      {
        value: "newly-married",
        label: "New couple",
        desc: "Married within the last three years",
      },
      {
        value: "established",
        label: "Established couple",
        desc: "Married for several years and wanting to go deeper",
      },
      {
        value: "seeking-counsel",
        label: "Seeking counsel",
        desc: "Navigating difficulty and looking for a way back to wholeness",
      },
      {
        value: "other",
        label: "Other",
        desc: "Tell us more in the message below",
      },
    ],
    attendanceLabels: {
      engaged: "Engaged couple",
      "newly-married": "New couple (married within 3 years)",
      established: "Established couple",
      "seeking-counsel": "Seeking counsel",
      other: "Other",
    },
    form: {
      fields: {
        partnerOneName: { label: "Your name", placeholder: "Your full name" },
        partnerTwoName: { label: "Partner's name", placeholder: "Their full name" },
        phone: { label: "Phone number", placeholder: "+234 800 000 0000" },
        email: { label: "Email address", placeholder: "you@example.com" },
        attendanceType: { label: "You are coming as…" },
        yearsMarried: { label: "How many years have you been married?", placeholder: "e.g. 3" },
        message: {
          label: "Anything you'd like us to know? (optional)",
          placeholder:
            "Any context that will help us serve you well — questions, concerns, or anything else on your heart.",
          maxLength: 800,
        },
      },
      errors: {
        partnerOneName: "Please enter your name",
        partnerTwoName: "Please enter your partner's name",
        phone: "Phone number is required",
        email: "A valid email address is required",
        attendanceType: "Please select how you are coming",
        genericSubmitFailed: "Something went wrong. Please try again.",
        networkFailed: "Could not send registration. Please try again.",
        emailServiceUnavailable: "Email service not configured.",
        sendFailed: "Failed to send registration. Please try again.",
      },
      success: {
        heading: "Registration received.",
        body:
          "We have received your interest in the December 2026 Couples' Conference. We will be in touch with details as the date approaches.",
      },
    },
    email: {
      subjectTemplate: "Conference Registration — {partnerOneName} & {partnerTwoName}",
      headingTemplate: "Conference Registration — {partnerOneName} & {partnerTwoName}",
      subtitle: "Inaugural Couples' Conference · December 2026 · The GOMAL Foundation",
      fieldLabels: {
        yourName: "Your name",
        partnersName: "Partner's name",
        phone: "Phone",
        email: "Email",
        comingAs: "Coming as",
        yearsMarried: "Years married",
      },
      noteLabel: "Their note",
      replyNoteTemplate: "Reply to {partnerOneName} at {email} · {phone}",
    },
  },
} as const;

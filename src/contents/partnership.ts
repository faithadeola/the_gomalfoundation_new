export const partnershipContents = {
  partnership: {
    typeLabels: {
      education: "Education & Scholarship",
      "marriage-family": "Marriage & Family",
      "youth-mentorship": "Youth Mentorship & Leadership",
      "community-outreach": "Community Outreach",
      volunteering: "Volunteering",
      financial: "Financial Partnership",
      "media-communications": "Media & Communications",
      other: "Other",
    },
    focusPairs: [
      { type: "education", desc: "Schools, scholarship funds, teachers, education NGOs" },
      { type: "marriage-family", desc: "Counsellors, churches, couples, family ministries" },
      { type: "youth-mentorship", desc: "Mentors, career platforms, alumni networks, employers" },
      { type: "community-outreach", desc: "Individuals, community groups, civic organisations" },
      { type: "volunteering", desc: "Anyone willing to give their time and skills" },
      { type: "financial", desc: "Donors, foundations, corporates, giving circles" },
      { type: "media-communications", desc: "Broadcasters, publications, digital platforms" },
    ],
    section: {
      eyebrow: "Partner with us",
      heading: "The work is bigger than any one gift.",
      body: "Schools, churches, counsellors, businesses, media — there is a way to join what they started.",
      card: {
        heading: "Tell us how you'd like to help",
        body: "Five minutes. We read every message and respond within two weeks.",
        cta: "Apply to partner",
        footnote: "We respond to every message.",
      },
    },
    page: {
      eyebrow: "Partner with us",
      heading: "The work is bigger than any one gift.",
      body:
        "Whether you are an individual, a school, a church, a business, or someone who simply wants to give their time — there is a place for you in what Baba and Mama started.",
      waysToPartnerHeading: "Ways to partner",
      trustCard: {
        heading: "We respond to every application.",
        body: "We read every application personally and respond within two weeks. There is no automated rejection here.",
      },
      card: {
        heading: "Apply to partner",
        body: "Five minutes. Tell us who you are and how you would like to be involved. We respond to every application.",
        cta: "Open application form →",
      },
    },
    modal: {
      eyebrow: "Partner with us",
      heading: "Partnership application",
      intro:
        "Five minutes. Tell us about your organisation and what a partnership would look like. We respond to every application within two weeks.",
      closeLabel: "Close",
    },
    form: {
      fields: {
        name: { label: "Your name", placeholder: "Your full name" },
        phone: { label: "Phone number", placeholder: "+234 800 000 0000" },
        email: { label: "Email address", placeholder: "you@example.com" },
        type: { label: "How would you like to partner?", placeholder: "Select an area" },
        proposal: {
          label: "Tell us more",
          placeholder:
            "What do you have in mind? Whether you're an individual, a school, a church, or a business — tell us what partnership looks like for you.",
          maxLength: 2000,
        },
      },
      errors: {
        name: "Your name is required",
        email: "A valid email address is required",
        phone: "Phone number is required",
        partnershipType: "Please select how you'd like to partner",
        proposal: "Please share a little more detail (at least 20 characters)",
        submitFailed: "Failed to send application. Please try again.",
      },
      submitCta: "Submit application",
      submittingCta: "Sending…",
      success: {
        heading: "Application received.",
        body: "Thank you for reaching out. We read every application and will respond within two weeks.",
      },
    },
    email: {
      heading: "New Partnership Application",
      subjectTemplate: "Partnership Application — {name}",
      dateLine: "The GOMAL Foundation",
      fieldLabels: {
        name: "Name",
        email: "Email",
        phone: "Phone",
        partnershipType: "Partnership type",
        message: "Message",
      },
      replyNoteTemplate: "Reply directly to this email to respond to {name} at {email}",
    },
  },
} as const;

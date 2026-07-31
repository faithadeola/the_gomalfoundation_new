export const siteContents = {
  site: {
    name: "The GOMAL Foundation",
    titleTemplate: "%s | The GOMAL Foundation",
    description:
      "In loving memory and living legacy of Baba and Mama GOMAL. Twenty-five years. Thousands of students. A home always open. A marriage that became a ministry.",
    keywords: [
      "GOMAL Foundation",
      "Gabriel Oyegbola Lasehinde",
      "Margaret Adepegba Lasehinde",
      "Baba GOMAL",
      "Mama GOMAL",
      "GOMAL Baptist College",
      "Ogbomoso",
      "Nigeria",
      "memorial",
      "foundation",
    ],
    openGraph: {
      type: "website",
      siteName: "The GOMAL Foundation",
      title: "The GOMAL Foundation",
      description:
        "Nobody who came for help ever left the way they arrived. A register that never closed.",
    },
    twitter: {
      card: "summary_large_image",
    },
    pages: {
      give: {
        title: "Give",
        description:
          "Give to The GOMAL Foundation. Every gift carries forward the work that Baba and Mama began.",
        openGraph: {
          title: "The GOMAL Foundation",
          description:
            "\"Nobody who came for help ever left the way they arrived.\" Carry the legacy of Baba and Mama GOMAL.",
        },
      },
      partnership: {
        title: "Partner with us",
        description:
          "Apply to partner with The GOMAL Foundation. We are looking for schools, counselling practices, churches, businesses and media organisations committed to the same work.",
      },
      tributes: {
        title: "Tributes — 1,247 lives, and counting",
        description:
          "Every tribute on this wall is a life that Baba and Mama changed. Read their stories, and add yours.",
      },
    },
    contact: {
      giveEmail: "babaandmamagomalfoundation@gmail.com",
      foundationEmail: "babaandmamagomalfoundation@gmail.com",
      noreplyEmail: "babaandmamagomalfoundation@gmail.com",
    },
    address: {
      city: "Ogbomoso",
      state: "Oyo State",
      country: "Nigeria",
      full: "Ogbomoso, Oyo State, Nigeria",
    },
  },
} as const;

export const defaultLoanProgramImageBySlug = {
  "fix-flip":
    "https://images.pexels.com/photos/8293750/pexels-photo-8293750.jpeg?cs=srgb&dl=pexels-rdne-8293750.jpg&fm=jpg",
  "refinance":
    "https://images.pexels.com/photos/8292879/pexels-photo-8292879.jpeg?cs=srgb&dl=pexels-rdne-8292879.jpg&fm=jpg",
  "rental-dscr":
    "https://images.pexels.com/photos/8293743/pexels-photo-8293743.jpeg?cs=srgb&dl=pexels-rdne-8293743.jpg&fm=jpg",
  "ground-up-construction":
    "https://images.pexels.com/photos/8292888/pexels-photo-8292888.jpeg?cs=srgb&dl=pexels-rdne-8292888.jpg&fm=jpg",
} as const;

export const defaultLoanProgramImages = Object.values(defaultLoanProgramImageBySlug);

export const getDefaultLoanProgramImage = (slug: string | null | undefined) => {
  if (!slug) {
    return null;
  }

  return defaultLoanProgramImageBySlug[slug as keyof typeof defaultLoanProgramImageBySlug] ?? null;
};

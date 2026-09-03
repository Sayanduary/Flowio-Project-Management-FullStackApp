import { dark } from "@clerk/themes";

const clerkAppearance = (isDark = false) => ({
  theme: isDark ? dark : undefined,
  variables: {
    colorPrimary: isDark ? "#60a5fa" : "#2563eb",
    borderRadius: "0.75rem",
    fontFamily: "'Outfit', sans-serif",
    fontSize: "0.875rem",
  },
  elements: {
    formButtonPrimary:
      "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all normal-case",
    card: "shadow-none",
  },
});

export default clerkAppearance;

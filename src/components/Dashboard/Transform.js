import categories from "../../categories.json";

export const translateFromJson = (value, lang) => {
  if (!value) return value;
  const v = value.toLowerCase();
  for (const cat of categories) {
    const catLabel = cat.value.toLowerCase();
    // Match category
    if (catLabel === v) {
      if (lang === "hi") return cat.hindilabel;
      if (lang === "mr") return cat.marathilabel;
      if (lang === "gu") return cat.gujaratilabel;
      return cat.label;
    }

    // Match subcategory
    if (cat.subcategories) {
      for (const sub of cat.subcategories) {
        const subLabel = sub.value.toLowerCase();
        if (subLabel === v) {
          if (lang === "hi") return sub.hindilabel;
          if (lang === "mr") return sub.marathilabel;
          if (lang === "gu") return sub.gujaratilabel;
          return sub.label;
        }
      }
    }
  }

  return value; // fallback
};

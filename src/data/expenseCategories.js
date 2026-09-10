export const CATEGORY_TRANSLATION_KEYS = {
  Fuel: "categories.fuel",
  Groceries: "categories.groceries",
  Utilities: "categories.utilities",
  Transport: "categories.transport",
  "Food & Dining": "categories.foodDining",
  Meals: "categories.meals",
  Shopping: "categories.shopping",
  Accommodation: "categories.accommodation",
  Communication: "categories.communication",
  "Office supplies": "categories.officeSupplies",
  "Equipment and materials": "categories.equipmentAndMaterials",
  "Maintenance and repair": "categories.maintenanceAndRepair",
  "Health and pharmacy": "categories.healthAndPharmacy",
  Security: "categories.security",
  Labour: "categories.labour",
  Subcontracting: "categories.subcontracting",
  "Bank charges": "categories.bankCharges",
  "Taxes and customs": "categories.taxesAndCustoms",
  Hospitality: "categories.hospitality",
  "Equipment rental": "categories.equipmentRental",
  "Office rent": "categories.officeRent",
  "Electricity and water": "categories.electricityAndWater",
  "Internet and telephone": "categories.internetAndTelephone",
  "Printing and photocopying": "categories.printingAndPhotocopying",
  "Postal charges": "categories.postalCharges",
  "Legal fees": "categories.legalFees",
  Insurance: "categories.insurance",
  "Business cards and marketing": "categories.businessCardsAndMarketing",
  "Donations and subscriptions": "categories.donationsAndSubscriptions",
  "Travel expenses": "categories.travelExpenses",
  "Visa and immigration": "categories.visaAndImmigration",
  Other: "categories.other",
};

export const EXPENSE_CATEGORIES = Object.keys(CATEGORY_TRANSLATION_KEYS);

export function normalizeSearchText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\u0153/g, "oe")
    .replace(/\u00e6/g, "ae")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

const CATEGORY_ALIASES = {
  "Equipment and materials": ["\u00c9quipements et mat\u00e9riaux"],
};

export function normalizeExpenseCategory(category, t) {
  const comparable = normalizeSearchText(category);
  if (!comparable) return "";

  for (const [canonicalCategory, translationKey] of Object.entries(
    CATEGORY_TRANSLATION_KEYS,
  )) {
    const names = [
      canonicalCategory,
      ...(CATEGORY_ALIASES[canonicalCategory] || []),
      t(translationKey, { lng: "en" }),
      t(translationKey, { lng: "fr" }),
    ];

    if (names.some((name) => normalizeSearchText(name) === comparable)) {
      return canonicalCategory;
    }
  }

  return String(category).trim();
}

export function translateExpenseCategory(t, category) {
  const canonicalCategory = normalizeExpenseCategory(category, t);
  const translationKey = CATEGORY_TRANSLATION_KEYS[canonicalCategory];
  return translationKey ? t(translationKey) : canonicalCategory;
}

// Build once per filter operation, then reuse the bilingual category index per row.
export function createExpenseMatcher(filters, t) {
  const categoryIndex = new Map();
  for (const [canonical, key] of Object.entries(CATEGORY_TRANSLATION_KEYS)) {
    const names = [canonical, t(key, { lng: "en" }), t(key, { lng: "fr" }),
      ...(CATEGORY_ALIASES[canonical] || [])];
    const entry = { canonical, searchText: names.map(normalizeSearchText).join(" ") };
    names.forEach((name) => categoryIndex.set(normalizeSearchText(name), entry));
  }
  const terms = normalizeSearchText(filters.search).split(" ").filter(Boolean);
  const selected = normalizeSearchText(filters.category);
  const selectedCategory = categoryIndex.get(selected)?.canonical || selected;
  return (expense) => {
    const rawCategory = normalizeSearchText(expense.category);
    const category = categoryIndex.get(rawCategory);
    if (filters.category && filters.category !== "all" &&
        (category?.canonical || rawCategory) !== selectedCategory) return false;
    const text = [normalizeSearchText(expense.supplier), rawCategory, category?.searchText || ""].join(" ");
    return terms.every((term) => text.includes(term));
  };
}

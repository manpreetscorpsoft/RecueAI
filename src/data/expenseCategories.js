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

function comparableCategory(value) {
  return String(value || "")
    .trim()
    .toLocaleLowerCase();
}

export function normalizeExpenseCategory(category, t) {
  const comparable = comparableCategory(category);
  if (!comparable) return "";

  for (const [canonicalCategory, translationKey] of Object.entries(
    CATEGORY_TRANSLATION_KEYS,
  )) {
    const names = [
      canonicalCategory,
      t(translationKey, { lng: "en" }),
      t(translationKey, { lng: "fr" }),
    ];

    if (names.some((name) => comparableCategory(name) === comparable)) {
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

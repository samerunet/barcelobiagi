import { Product, ProductSize } from "@/types";
import { mockProducts } from "./mockData";

const STORAGE_KEY = "admin_products";

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadAdminProducts(): Product[] {
  if (!isBrowser()) {
    return mockProducts;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return mockProducts;
  }

  try {
    const parsed = JSON.parse(raw) as Product[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : mockProducts;
  } catch {
    return mockProducts;
  }
}

export function saveAdminProducts(products: Product[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function upsertAdminProduct(updated: Product) {
  const current = loadAdminProducts();
  const exists = current.find((p) => p.id === updated.id);
  const next = exists
    ? current.map((p) => (p.id === updated.id ? updated : p))
    : [...current, updated];

  saveAdminProducts(next);
}

export function normalizeSizes(
  sizesString: string,
  stockValue: number,
): ProductSize[] {
  const sizes = sizesString
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (sizes.length === 0) return [];

  return sizes.map((size) => ({
    size,
    stock: stockValue,
  }));
}

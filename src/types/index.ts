export type Language = 'ru' | 'en';

export interface Product {
  id: string;
  name_ru: string;
  name_en: string;
  description_ru: string;
  description_en: string;
  price: number;
  old_price?: number;
  currency: string;
  images: string[];
  category: string;
  tags: string[]; // 'new', 'sale', etc.
  stock_total: number;
  stock_low_threshold: number;
  sku: string;
  sizes: ProductSize[];
  material_ru: string;
  material_en: string;
  color_ru: string;
  color_en: string;
}

export interface ProductSize {
  size: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface Order {
  items: CartItem[];
  shipping: ShippingInfo;
  payment: PaymentInfo;
  total: number;
}

export interface ShippingInfo {
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  postal_code: string;
  delivery_method: 'courier' | 'pickup';
}

export interface PaymentInfo {
  method: 'card' | 'cash_on_delivery';
}

export interface Translations {
  ru: Record<string, string>;
  en: Record<string, string>;
}

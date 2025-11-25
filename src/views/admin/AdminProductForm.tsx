"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import { loadAdminProducts, normalizeSizes, upsertAdminProduct } from "@/data/adminStore";
import { ProductImageUploader } from "@/app/admin/products/_components/product-image-uploader";
import { Product } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

type UploadedImage = {
  fileUrl: string;
  fileKey: string;
  productId?: string | null;
};

export function AdminProductForm() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  const isEdit = Boolean(id);
  const { t, language, setLanguage } = useLanguage();

  const [existingProduct, setExistingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name_ru: "",
    name_en: "",
    description_ru: "",
    description_en: "",
    category: "men",
    price: "",
    sizes: "",
    stock: "",
    sku: "",
    material_ru: "",
    material_en: "",
    color_ru: "",
    color_en: "",
    status: "active",
    featured: false,
  });

  const initialImages: UploadedImage[] = useMemo(
    () =>
      (existingProduct?.images || []).map((url) => ({
        fileUrl: url,
        fileKey: url,
        productId: id ?? null,
      })),
    [existingProduct?.images, id],
  );

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [mainImageKey, setMainImageKey] = useState<string | null>(null);

  useEffect(() => {
    const products = loadAdminProducts();
    if (isEdit) {
      const found = products.find((p) => p.id === id) || null;
      setExistingProduct(found);
      if (found) {
        setFormData({
          name_ru: found.name_ru,
          name_en: found.name_en,
          description_ru: found.description_ru,
          description_en: found.description_en,
          category: found.category,
          price: found.price.toString(),
          sizes: found.sizes.map((s) => s.size).join(", "),
          stock: found.stock_total.toString(),
          sku: found.sku,
          material_ru: found.material_ru,
          material_en: found.material_en,
          color_ru: found.color_ru,
          color_en: found.color_en,
          status: "active",
          featured: false,
        });
        const hydratedImages =
          (found.images || []).map((url) => ({
            fileUrl: url,
            fileKey: url,
            productId: id ?? null,
          })) || [];

        setImages(hydratedImages);
        setMainImageKey(hydratedImages[0]?.fileKey ?? null);
      }
    } else {
      // Reset for create
      setExistingProduct(null);
      setImages([]);
      setMainImageKey(null);
    }
  }, [id, isEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const price = parseFloat(formData.price) || 0;
    const stock = parseInt(formData.stock || "0", 10);
    const sizes = normalizeSizes(formData.sizes, stock);

    const orderedImages =
      mainImageKey && images.length > 0
        ? [
            ...images.filter((img) => img.fileKey === mainImageKey),
            ...images.filter((img) => img.fileKey !== mainImageKey),
          ]
        : images;

    const payload: Product = {
      id: isEdit && id ? id : Date.now().toString(),
      ...formData,
      price,
      stock_total: stock,
      stock_low_threshold: Math.max(1, Math.floor(stock * 0.1)),
      old_price: undefined,
      currency: "RUB",
      images: orderedImages.map((img) => img.fileUrl),
      sizes,
      tags: [],
    };

    upsertAdminProduct(payload);
    router.push("/admin/inventory");
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) {
        setMainImageKey(null);
      } else if (prev[index]?.fileKey === mainImageKey) {
        setMainImageKey(next[0].fileKey);
      }
      return next;
    });
  };

  const categories = [
    { ru: "Мужская обувь", en: "Men's Shoes" },
    { ru: "Женская обувь", en: "Women's Shoes" },
    { ru: "Ботинки", en: "Boots" },
    { ru: "Туфли", en: "Dress Shoes" },
    { ru: "Кроссовки", en: "Sneakers" },
    { ru: "Аксессуары", en: "Accessories" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                href="/admin/inventory"
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold">
                  {isEdit ? t("Редактировать товар", "Edit product") : t("Добавить товар", "Add product")}
                </h1>
                {isEdit && <p className="text-sm text-gray-500">{formData.sku}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLanguage(language === "ru" ? "en" : "ru")}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                {language === "ru" ? "RU" : "EN"}
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition"
              >
                {t("Сохранить", "Save")}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-4 py-6 max-w-2xl mx-auto space-y-4">
        {/* Images */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            {t("Изображения товара", "Product images")}
          </label>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
            {images.map((img, index) => {
              const isMain = img.fileKey === mainImageKey || (!mainImageKey && index === 0);
              return (
                <div
                  key={img.fileKey}
                  className="relative aspect-square rounded-xl border border-gray-200 bg-gray-50 overflow-hidden"
                >
                  <img
                    src={img.fileUrl}
                    alt={`Product ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 p-1 bg-error text-white rounded-full shadow-md"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {isMain ? (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-primary text-white rounded text-xs font-semibold shadow">
                      {t("Главное фото", "Main photo")}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setMainImageKey(img.fileKey)}
                      className="absolute bottom-2 left-2 px-2 py-0.5 bg-white text-gray-900 rounded text-xs font-medium shadow hover:bg-gray-100"
                    >
                      {t("Сделать главным", "Set as main")}
                    </button>
                  )}
                </div>
              );
            })}
            
            <div className="aspect-square rounded-xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center p-2">
              <ProductImageUploader
                productId={id}
                onImagesChange={(uploaded) => {
                  setImages(uploaded);
                  if (uploaded.length > 0 && !mainImageKey) {
                    setMainImageKey(uploaded[0].fileKey);
                  }
                }}
              />
            </div>
          </div>
          
          <p className="text-xs text-gray-500">
            {t("Первое изображение будет использоваться как главное. Поддерживаются JPG, PNG.", "The first image will be used as main. JPG, PNG supported.")}
          </p>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">
            {t("Основная информация", "Basic information")}
          </h3>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("Название (RU)", "Name (RU)")} *
              </label>
              <input
                type="text"
                required
                value={formData.name_ru}
                onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
                className="input"
                placeholder={t("Ботинки Chelsea Black", "Chelsea Boots Black")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("Название (EN)", "Name (EN)") }*
              </label>
              <input
                type="text"
                required
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                className="input"
                placeholder="Chelsea Boots Black"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("Описание (RU)", "Description (RU)")}
              </label>
              <textarea
                value={formData.description_ru}
                onChange={(e) => setFormData({ ...formData, description_ru: e.target.value })}
                className="input min-h-24 resize-none"
                placeholder={t("Классические ботинки челси из натуральной кожи...", "Classic Chelsea boots made from genuine leather...")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("Описание (EN)", "Description (EN)")}
              </label>
              <textarea
                value={formData.description_en}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                className="input min-h-24 resize-none"
                placeholder="Classic Chelsea boots made from genuine leather..."
              />
            </div>
          </div>
        </div>

        {/* Category & Price */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">
            {t("Категория и цена", "Category and price")}
          </h3>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("Категория", "Category")} *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    category: e.target.value,
                  });
                }}
                className="input"
              >
                {categories.map(cat => (
                  <option key={cat.ru} value={cat.en}>{cat.ru}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("Цена (₽)", "Price (₽)") }*
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="input"
                placeholder="12990"
              />
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">
            {t("Склад и размеры", "Stock and sizes")}
          </h3>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {!isEdit && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="input"
                  placeholder="BB-00001"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {t("Оставьте пустым для автоматической генерации", "Leave empty to auto-generate")}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("Доступные размеры", "Available sizes")} *
              </label>
              <input
                type="text"
                required
                value={formData.sizes}
                onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                className="input"
                placeholder="39, 40, 41, 42, 43, 44"
              />
              <p className="text-xs text-gray-500 mt-1">
                {t("Введите размеры через запятую", "Enter sizes separated by commas")}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("Общий остаток на складе", "Total stock")}
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="input"
                placeholder="25"
              />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">
            {t("Настройки", "Settings")}
          </h3>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-gray-800">{t("Избранный товар", "Featured product")}</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.status === "active"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.checked ? "active" : "inactive",
                  })
                }
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-gray-800">{t("Активен в каталоге", "Visible in catalog")}</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition"
          >
            {t("Сохранить", "Save")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminProductForm;

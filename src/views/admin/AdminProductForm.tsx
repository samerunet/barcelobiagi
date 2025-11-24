import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import { mockProducts } from "../../data/mockData";
import { ProductImageUploader } from "@/app/admin/products/_components/product-image-uploader";

export function AdminProductForm() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  const isEdit = Boolean(id);

  // Load existing product if editing
  const existingProduct = isEdit ? mockProducts.find((p) => p.id === id) : null;

  const [formData, setFormData] = useState({
    name_ru: existingProduct?.name_ru || "",
    name_en: existingProduct?.name_en || "",
    description_ru: existingProduct?.description_ru || "",
    description_en: existingProduct?.description_en || "",
    category: existingProduct?.category || "men",
    price: existingProduct?.price.toString() || "",
    sizes: existingProduct?.sizes.map((s) => s.size).join(", ") || "",
    stock: existingProduct?.stock_total.toString() || "",
    sku: existingProduct?.sku || "",
    material_ru: existingProduct?.material_ru || "",
    material_en: existingProduct?.material_en || "",
    color_ru: existingProduct?.color_ru || "",
    color_en: existingProduct?.color_en || "",
    status: "active",
    featured: false,
  });

  type UploadedImage = {
    fileUrl: string;
    fileKey: string;
    productId?: string | null;
  };

  const initialImages: UploadedImage[] = useMemo(
    () =>
      (existingProduct?.images || []).map((url) => ({
        fileUrl: url,
        fileKey: url,
        productId: id ?? null,
      })),
    [existingProduct?.images, id],
  );

  const [images, setImages] = useState<UploadedImage[]>(initialImages);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // API NOTE: POST /api/products or PUT /api/products/:id
    // Send formData and images to kassa.primarket.ru API
    
    const payload = {
      ...formData,
      images: images.map((img) => img.fileUrl),
    };

    console.log("Saving product:", payload);
    
    // Navigate back to inventory
    router.push("/admin/inventory");
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
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
          <div className="flex items-center gap-3">
            <Link
              href="/admin/inventory"
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold">
                {isEdit ? 'Редактировать товар' : 'Добавить товар'}
              </h1>
              {isEdit && <p className="text-sm text-gray-500">{formData.sku}</p>}
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-4 py-6 max-w-2xl mx-auto">
        {/* Images */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Изображения товара
          </label>
          
          <div className="grid grid-cols-3 gap-3 mb-3">
            {images.map((img, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={img.fileUrl}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 p-1 bg-error text-white rounded-full shadow-md"
                >
                  <X className="w-4 h-4" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-primary text-white rounded text-xs font-medium">
                    Главное
                  </span>
                )}
              </div>
            ))}
            
            <div className="aspect-square">
              <ProductImageUploader
                productId={id}
                onImagesChange={(uploaded) => setImages(uploaded)}
              />
            </div>
          </div>
          
          <p className="text-xs text-gray-500">
            Первое изображение будет использоваться как главное. Поддерживаются JPG, PNG.
          </p>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <h3 className="mb-4">Основная информация</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название (RU) *
              </label>
              <input
                type="text"
                required
                value={formData.name_ru}
                onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
                className="input"
                placeholder="Ботинки Chelsea Black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название (EN) *
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание (RU)
              </label>
              <textarea
                value={formData.description_ru}
                onChange={(e) => setFormData({ ...formData, description_ru: e.target.value })}
                className="input min-h-24 resize-none"
                placeholder="Классические ботинки челси из натуральной кожи..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание (EN)
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
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <h3 className="mb-4">Категория и цена</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категория *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => {
                  const category = categories.find(c => c.en === e.target.value);
                  if (category) {
                    setFormData({
                      ...formData,
                      category: category.en,
                    });
                  }
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
                Цена (₽) *
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
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <h3 className="mb-4">Склад и размеры</h3>
          
          <div className="space-y-4">
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
                  Оставьте пустым для автоматической генерации
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Доступные размеры *
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
                Введите размеры через з��пятую
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Общий остаток на складе
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
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <h3 className="mb-4">Настройки</h3>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium text-gray-900">Статус товара</p>
                <p className="text-xs text-gray-500">Показывать товар на сайте</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ 
                  ...formData, 
                  status: formData.status === 'active' ? 'inactive' : 'active' 
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.status === 'active' ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium text-gray-900">Избранный товар</p>
                <p className="text-xs text-gray-500">Показывать на главной странице</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.featured ? 'bg-warning' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.featured ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
          </div>
        </div>
      </form>

      {/* Fixed Bottom Actions */}
      <div className="mobile-bottom-bar">
        <div className="px-4 py-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => router.push('/admin/inventory')}
              className="btn-secondary"
            >
              Отменить
            </button>
            <button
              onClick={handleSubmit}
              className="btn-primary"
            >
              {isEdit ? 'Сохранить' : 'Добавить товар'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

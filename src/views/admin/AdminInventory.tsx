import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Search,
  Edit,
  Eye,
  EyeOff,
  Star,
  MoreVertical,
  Check,
  X,
} from "lucide-react";
import { loadAdminProducts } from "@/data/adminStore";
import { Product } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

type FilterStatus = 'all' | 'active' | 'inactive' | 'low_stock' | 'featured';
type AdminProduct = Product & { status?: 'active' | 'inactive'; featured?: boolean };

export function AdminInventory() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const { language, setLanguage, t } = useLanguage();

  // Load products from local storage (or mock fallback)
  useEffect(() => {
    const loaded = loadAdminProducts().map((p) => ({
      ...p,
      status: "active" as const,
      featured: false,
    }));
    setProducts(loaded);
  }, []);

  const filteredProducts = useMemo(() => products.filter(product => {
    const matchesSearch = product.name_ru.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.includes(searchQuery);
    
    const matchesFilter = 
      filterStatus === 'all' ? true :
      filterStatus === 'active' ? product.status === 'active' :
      filterStatus === 'inactive' ? product.status === 'inactive' :
      filterStatus === 'low_stock' ? product.stock_total < product.stock_low_threshold :
      filterStatus === 'featured' ? product.featured : true;

    return matchesSearch && matchesFilter;
  }), [products, searchQuery, filterStatus]);

  const toggleSelectProduct = (id: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProducts(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const selectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
      setShowBulkActions(false);
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
      setShowBulkActions(true);
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for products:`, Array.from(selectedProducts));
    // In production, this would call your API
    setSelectedProducts(new Set());
    setShowBulkActions(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="border-b border-gray-100 sticky top-0 z-30 bg-white/90 backdrop-blur">
        <div className="px-4 py-4 max-w-7xl mx-auto flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                href="/admin/dashboard"
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t("Управление инвентарем", "Inventory Management")}</h1>
                <p className="text-sm text-gray-500">
                  {t("Управляйте каталогом товаров", "Manage your product catalog")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLanguage(language === "ru" ? "en" : "ru")}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                {language === "ru" ? "RU" : "EN"}
              </button>
              <Link
                href="/"
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                {t("Посмотреть сайт", "View site")}
              </Link>
              <button
                onClick={() => router.push('/admin/inventory/add')}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{t("Добавить товар", "Add product")}</span>
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("Поиск товаров...", "Search products...")}
              className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-3 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-primary/60 shadow-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { key: 'all', label: t('Все', 'All'), count: products.length },
              { key: 'active', label: t('Активные', 'Active'), count: products.filter(p => p.status === 'active').length },
              { key: 'inactive', label: t('Скрытые', 'Hidden'), count: products.filter(p => p.status === 'inactive').length },
              { key: 'low_stock', label: t('Мало на складе', 'Low stock'), count: products.filter(p => p.stock_total < p.stock_low_threshold).length },
              { key: 'featured', label: t('Избранные', 'Featured'), count: products.filter(p => p.featured).length },
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setFilterStatus(filter.key as FilterStatus)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors border ${
                  filterStatus === filter.key
                    ? 'bg-primary text-white border-primary'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>
      </header>

      {filteredProducts.length > 0 && (
        <div className="bg-white border-b border-gray-100 px-4 py-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedProducts.size === filteredProducts.length}
              onChange={selectAll}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm text-gray-700">
              {t("Выбрать все", "Select all")} ({selectedProducts.size} / {filteredProducts.length})
            </span>
          </label>
        </div>
      )}

      {/* Products List */}
      <div className="px-4 py-6 max-w-7xl mx-auto">
        <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm bg-white">
          <div className="hidden md:grid grid-cols-12 px-4 py-3 text-xs font-semibold text-gray-500">
            <div className="col-span-4">{t("Товар", "Product")}</div>
            <div className="col-span-2">{t("Категория", "Category")}</div>
            <div className="col-span-2">{t("Цена", "Price")}</div>
            <div className="col-span-2">{t("Статус", "Status")}</div>
            <div className="col-span-2 text-right">{t("Действия", "Actions")}</div>
          </div>
          <div className="divide-y divide-gray-100">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="grid md:grid-cols-12 gap-3 px-4 py-4 items-center hover:bg-gray-50 transition"
              >
                {/* Checkbox + Product */}
                <div className="md:col-span-4 flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedProducts.has(product.id)}
                    onChange={() => toggleSelectProduct(product.id)}
                    className="w-4 h-4 accent-primary mt-1"
                    aria-label={t("Выбрать товар", "Select product")}
                  />
                  <div className="h-14 w-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={product.images[0] || "https://via.placeholder.com/80"}
                      alt={product.name_ru}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                      {language === "ru" ? product.name_ru : product.name_en}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {language === "ru" ? product.name_en : product.name_ru}
                    </p>
                  </div>
                </div>

                {/* Category */}
                <div className="md:col-span-2 text-sm font-semibold text-gray-700">
                  <span className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    {product.category}
                  </span>
                </div>

                {/* Price */}
                <div className="md:col-span-2 text-sm font-semibold text-gray-900">
                  {product.price.toLocaleString(language === "ru" ? 'ru-RU' : 'en-US')} ₽
                  {product.old_price && (
                    <div className="text-xs text-gray-400 line-through">
                      {product.old_price.toLocaleString(language === "ru" ? 'ru-RU' : 'en-US')} ₽
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="md:col-span-2 flex flex-wrap gap-2">
                  <span className="inline-flex px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                    {t("В наличии", "In stock")}
                  </span>
                  {product.featured && (
                    <span className="inline-flex px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold">
                      {t("Избранное", "Featured")}
                    </span>
                  )}
                  {product.tags.includes("sale") && (
                    <span className="inline-flex px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                      {t("Распродажа", "Sale")}
                    </span>
                  )}
                  {product.tags.includes("new") && (
                    <span className="inline-flex px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                      {t("Новинка", "New")}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="md:col-span-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => router.push(`/admin/inventory/edit/${product.id}`)}
                    className="p-2 rounded-lg border border-gray-200 text-blue-600 hover:bg-blue-50 transition"
                    aria-label={t("Редактировать", "Edit")}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleSelectProduct(product.id)}
                    className="p-2 rounded-lg border border-gray-200 text-red-500 hover:bg-red-50 transition"
                    aria-label={t("Удалить", "Delete")}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500 text-sm">
                {t("Товары не найдены", "No products found")}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar (Fixed Bottom) */}
      {showBulkActions && (
        <div className="mobile-bottom-bar backdrop-blur-lg bg-white/10 text-white">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Выбрано: {selectedProducts.size}
              </span>
              <button
                onClick={() => {
                  setSelectedProducts(new Set());
                  setShowBulkActions(false);
                }}
                className="text-sm text-white/70 hover:text-white"
              >
                Отменить
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-2 bg-success text-white rounded-lg text-sm font-medium hover:bg-success/90"
              >
                <Eye className="w-4 h-4 mx-auto mb-1" />
                Активировать
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-2 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20"
              >
                <EyeOff className="w-4 h-4 mx-auto mb-1" />
                Скрыть
              </button>
              <button
                onClick={() => handleBulkAction('feature')}
                className="px-3 py-2 bg-warning text-white rounded-lg text-sm font-medium hover:bg-warning/90"
              >
                <Star className="w-4 h-4 mx-auto mb-1" />
                В избранное
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

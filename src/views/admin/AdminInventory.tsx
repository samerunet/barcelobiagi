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
} from "lucide-react";
import { loadAdminProducts } from "@/data/adminStore";
import { Product } from "@/types";

type FilterStatus = 'all' | 'active' | 'inactive' | 'low_stock' | 'featured';
type AdminProduct = Product & { status?: 'active' | 'inactive'; featured?: boolean };

export function AdminInventory() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [products, setProducts] = useState<AdminProduct[]>([]);

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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link
                href="/admin/dashboard"
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold">Управление товарами</h1>
                <p className="text-sm text-gray-500">{filteredProducts.length} товаров</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/admin/inventory/add')}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Добавить</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по названию или SKU..."
              className="input pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { key: 'all', label: 'Все', count: products.length },
              { key: 'active', label: 'Активные', count: products.filter(p => p.status === 'active').length },
              { key: 'inactive', label: 'Скрытые', count: products.filter(p => p.status === 'inactive').length },
              { key: 'low_stock', label: 'Мало на складе', count: products.filter(p => p.stock_total < p.stock_low_threshold).length },
              { key: 'featured', label: 'Избранные', count: products.filter(p => p.featured).length },
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setFilterStatus(filter.key as FilterStatus)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filterStatus === filter.key
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Select All Bar */}
      {filteredProducts.length > 0 && (
        <div className="bg-white border-b border-gray-200 px-4 py-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedProducts.size === filteredProducts.length}
              onChange={selectAll}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm text-gray-600">
              Выбрать все ({selectedProducts.size} из {filteredProducts.length})
            </span>
          </label>
        </div>
      )}

      {/* Products List */}
      <div className="px-4 py-4">
        <div className="space-y-3">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className={`bg-white rounded-lg border transition-all ${
                selectedProducts.has(product.id)
                  ? 'border-primary shadow-sm'
                  : 'border-gray-200'
              }`}
            >
              <div className="p-4">
                <div className="flex gap-3">
                  {/* Checkbox */}
                  <div className="flex-shrink-0 pt-1">
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(product.id)}
                      onChange={() => toggleSelectProduct(product.id)}
                      className="w-4 h-4 accent-primary"
                    />
                  </div>

                  {/* Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={product.images[0] || "https://via.placeholder.com/160"}
                      alt={product.name_ru}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 mb-0.5 line-clamp-1">
                          {product.name_ru}
                        </h4>
                        <p className="text-xs text-gray-500">{product.sku}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {product.featured && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-warning/10 text-warning rounded text-xs">
                            <Star className="w-3 h-3" />
                          </span>
                        )}
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        product.status === 'active'
                          ? 'bg-success/10 text-success'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {product.status === 'active' ? 'Активен' : 'Скрыт'}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        product.stock_total < product.stock_low_threshold
                          ? 'bg-error/10 text-error'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        Склад: {product.stock_total}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium capitalize">
                        {product.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-gray-900">
                        {product.price.toLocaleString('ru-RU')} ₽
                      </p>
                      <button
                        onClick={() => router.push(`/admin/inventory/edit/${product.id}`)}
                        className="text-primary hover:text-primary-dark text-sm font-medium flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Изменить
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Товары не найдены</p>
          </div>
        )}
      </div>

      {/* Bulk Actions Bar (Fixed Bottom) */}
      {showBulkActions && (
        <div className="mobile-bottom-bar">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">
                Выбрано: {selectedProducts.size}
              </span>
              <button
                onClick={() => {
                  setSelectedProducts(new Set());
                  setShowBulkActions(false);
                }}
                className="text-sm text-gray-600 hover:text-gray-900"
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
                className="px-3 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700"
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

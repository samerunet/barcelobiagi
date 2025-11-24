import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  ShoppingBag,
  Settings,
  LogOut,
  BarChart3,
  Users,
  LayoutDashboard,
  Box,
  User2,
  HelpCircle,
} from "lucide-react";
import { loadAdminProducts } from "@/data/adminStore";
import { Product } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

export function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    setProducts(loadAdminProducts());
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  const stats = useMemo(() => {
    const total = products.length;
    const lowStock = products.filter((p) => p.stock_total < p.stock_low_threshold).length;
    const active = total - lowStock;
    const ordersToday = 127;
    const revenue = "1 847 500 ₽";

    return [
      {
        label: t("Всего товаров", "Total products"),
        value: total.toString(),
        change: "+12",
        icon: Package,
        color: "text-primary",
        bgColor: "bg-primary/10",
      },
      {
        label: t("Мало на складе", "Low stock"),
        value: lowStock.toString(),
        change: lowStock > 0 ? "-1" : "0",
        icon: AlertTriangle,
        color: "text-warning",
        bgColor: "bg-warning/10",
      },
      {
        label: t("Активных товаров", "Active items"),
        value: active.toString(),
        change: "+5",
        icon: TrendingUp,
        color: "text-success",
        bgColor: "bg-success/10",
      },
      {
        label: t("Всего заказов", "Total orders"),
        value: ordersToday.toString(),
        change: "+8",
        icon: ShoppingBag,
        color: "text-accent",
        bgColor: "bg-accent/10",
      },
      {
        label: t("Общий доход", "Total revenue"),
        value: revenue,
        change: "+4%",
        icon: BarChart3,
        color: "text-pink-500",
        bgColor: "bg-pink-100",
      },
    ];
  }, [products, t]);

  const quickActions = [
    {
      label: t("Панель управления", "Dashboard"),
      description: t("Основные метрики", "Main metrics"),
      icon: LayoutDashboard,
      path: "/admin/dashboard",
      color: "primary",
    },
    {
      label: t("Инвентарь", "Inventory"),
      description: t("Товары и запасы", "Products and stock"),
      icon: Box,
      path: "/admin/inventory",
      color: "primary",
    },
    {
      label: t("Заказы", "Orders"),
      description: t("Просмотр и управление заказами", "Manage orders"),
      icon: ShoppingBag,
      path: "/admin/orders",
      color: "accent",
    },
    {
      label: t("Клиенты", "Customers"),
      description: t("Управление аккаунтами", "Manage accounts"),
      icon: User2,
      path: "/admin/users",
      color: "success",
    },
    {
      label: t("Настройки", "Settings"),
      description: t("Параметры панели", "Panel preferences"),
      icon: BarChart3,
      path: "/admin/analytics",
      color: "warning",
    },
  ];

  const recentProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-72 bg-white border-r border-gray-100 px-4 py-6 flex-shrink-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
              BB
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">BARCELO BIAGI</h2>
              <p className="text-xs uppercase tracking-wide text-gray-500">ADMIN PANEL</p>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <Link
              href="/"
              className="w-full inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition text-sm justify-center"
            >
              {t("Посмотреть сайт", "View site")}
            </Link>
            <button
              onClick={() => setLanguage(language === "ru" ? "en" : "ru")}
              className="w-full inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition text-sm justify-center"
            >
              {language === "ru" ? t("Русский", "Russian") : t("Английский", "English")}
            </button>
          </div>

          <nav className="space-y-1">
            {[
              { label: t("Панель управления", "Dashboard"), icon: LayoutDashboard, path: "/admin/dashboard", active: true },
              { label: t("Инвентарь", "Inventory"), icon: Box, path: "/admin/inventory" },
              { label: t("Заказы", "Orders"), icon: ShoppingBag, path: "/admin/orders" },
              { label: t("Клиенты", "Customers"), icon: User2, path: "/admin/users" },
              { label: t("Настройки", "Settings"), icon: Settings, path: "/admin/analytics" },
            ].map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition ${
                  item.active
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-8">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500 text-sm font-semibold hover:text-red-600"
            >
              <LogOut className="w-4 h-4" />
              {t("Выйти", "Logout")}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.bgColor}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      stat.change.startsWith("+") ? "text-success" : "text-error"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent products */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {t("Последние товары", "Latest products")}
              </h3>
              <Link href="/admin/inventory" className="text-primary text-sm font-semibold hover:underline">
                {t("Показать все", "View all")}
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {recentProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4 px-4 py-4">
                  <div className="h-14 w-14 rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={product.images[0] || "https://via.placeholder.com/80"}
                      alt={product.name_ru}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {language === "ru" ? product.name_ru : product.name_en}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {product.price.toLocaleString(language === "ru" ? "ru-RU" : "en-US")} ₽
                    </p>
                    <p className="text-xs text-green-600">{t("В наличии", "In stock")}</p>
                  </div>
                </div>
              ))}
              {recentProducts.length === 0 && (
                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                  {t("Нет товаров для отображения", "No products to show")}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

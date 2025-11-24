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
} from "lucide-react";
import { loadAdminProducts } from "@/data/adminStore";
import { Product } from "@/types";

export function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

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
    const ordersToday = 23;

    return [
      {
        label: "Всего товаров",
        value: total.toString(),
        change: "+12",
        icon: Package,
        color: "text-primary",
        bgColor: "bg-primary/10",
      },
      {
        label: "Мало на складе",
        value: lowStock.toString(),
        change: lowStock > 0 ? "-1" : "0",
        icon: AlertTriangle,
        color: "text-warning",
        bgColor: "bg-warning/10",
      },
      {
        label: "Активных товаров",
        value: active.toString(),
        change: "+5",
        icon: TrendingUp,
        color: "text-success",
        bgColor: "bg-success/10",
      },
      {
        label: "Заказов сегодня",
        value: ordersToday.toString(),
        change: "+8",
        icon: ShoppingBag,
        color: "text-accent",
        bgColor: "bg-accent/10",
      },
    ];
  }, [products]);

  const quickActions = [
    {
      label: "Управление товарами",
      description: "Добавить, изменить или удалить товары",
      icon: Package,
      path: "/admin/inventory",
      color: "primary",
    },
    {
      label: "Заказы",
      description: "Просмотр и управление заказами",
      icon: ShoppingBag,
      path: "/admin/orders",
      color: "accent",
    },
    {
      label: "Аналитика",
      description: "Продажи и статистика",
      icon: BarChart3,
      path: "/admin/analytics",
      color: "success",
    },
    {
      label: "Пользователи",
      description: "Управление аккаунтами",
      icon: Users,
      path: "/admin/users",
      color: "warning",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Admin Header */}
      <header className="border-b border-white/10 backdrop-blur-md bg-white/5">
        <div className="px-4 py-5 max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Админ-панель</h1>
            <p className="text-sm text-white/60">BARCELO BIAGI · Иваново</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-lg bg-white/10 border border-white/10 hover:bg-white/20 transition"
            >
              <Settings className="w-5 h-5" />
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-error/10 border border-error/20 text-error hover:bg-error/20 transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 py-10 max-w-7xl mx-auto space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-lg p-4 shadow-lg shadow-black/20"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span
                  className={`text-xs font-medium ${
                    stat.change.startsWith("+") ? "text-success" : "text-error"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-semibold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-white/60">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">Быстрые действия</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.path}
                className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-lg p-4 hover:border-white/30 hover:bg-white/20 transition shadow-lg shadow-black/10"
              >
                <div
                  className={`inline-flex p-2 rounded-xl mb-3 ${
                    action.color === "primary"
                      ? "bg-primary/10 text-primary"
                      : action.color === "accent"
                      ? "bg-accent/10 text-accent"
                      : action.color === "success"
                      ? "bg-success/10 text-success"
                      : "bg-warning/10 text-warning"
                  }`}
                >
                  <action.icon className="w-5 h-5" />
                </div>
                <h4 className="mb-1 text-sm font-semibold text-white">{action.label}</h4>
                <p className="text-xs text-white/70 leading-relaxed">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-lg p-5 shadow-lg shadow-black/10">
          <h3 className="mb-4 text-lg font-medium text-white">Последние события</h3>
          <div className="space-y-3">
            {[
              { action: "Новый заказ", details: "#BB-123456 на сумму 15 990 ₽", time: "5 мин назад" },
              { action: "Товар обновлен", details: "Ботинки Chelsea Black - изменена цена", time: "23 мин назад" },
              { action: "Низкий остаток", details: "Туфли Oxford Brown - осталось 2 шт", time: "1 час назад" },
              { action: "Заказ отправлен", details: "#BB-123440 - доставка курьером", time: "2 часа назад" },
            ].map((event, index) => (
              <div
                key={index}
                className="flex items-start gap-3 pb-3 border-b border-white/10 last:border-0"
              >
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{event.action}</p>
                  <p className="text-xs text-white/70">{event.details}</p>
                </div>
                <span className="text-xs text-white/50">{event.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

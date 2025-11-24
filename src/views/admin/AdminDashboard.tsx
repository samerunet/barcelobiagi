"use client";

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
		const lowStock = products.filter(
			(p) => p.stock_total < p.stock_low_threshold
		).length;
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
			{
				label: t("Мало на складе", "Low stock"),
				value: lowStock.toString(),
				change: lowStock > 0 ? "-1" : "0",
				icon: AlertTriangle,
				color: "text-warning",
				bgColor: "bg-warning/10",
			},
		];
	}, [products, t]);

	const quickActions = [
		{
			label: t("Управление товарами", "Inventory"),
			description: t(
				"Добавить, изменить или удалить товары",
				"Manage products and stock"
			),
			icon: Box,
			path: "/admin/inventory",
			color: "primary",
		},
		{
			label: t("Заказы", "Orders"),
			description: t(
				"Просмотр и управление заказами",
				"View and manage orders"
			),
			icon: ShoppingBag,
			path: "/admin/orders",
			color: "accent",
		},
		{
			label: t("Аналитика", "Analytics"),
			description: t("Продажи и статистика", "Sales and statistics"),
			icon: BarChart3,
			path: "/admin/analytics",
			color: "success",
		},
		{
			label: t("Клиенты", "Customers"),
			description: t("Управление аккаунтами", "Manage accounts"),
			icon: User2,
			path: "/admin/users",
			color: "warning",
		},
	];

	const recentProducts = products.slice(0, 3);

	const recentEvents = [
		{
			action: t("Новый заказ", "New order"),
			details: "#BB-123456 · 15 990 ₽",
			time: t("5 мин назад", "5 min ago"),
		},
		{
			action: t("Товар обновлен", "Product updated"),
			details: t(
				"Ботинки Chelsea Black — изменена цена",
				"Chelsea Black boots — price updated"
			),
			time: t("23 мин назад", "23 min ago"),
		},
		{
			action: t("Низкий остаток", "Low stock"),
			details: t(
				"Туфли Oxford Brown — осталось 2 шт",
				"Oxford Brown shoes — only 2 left"
			),
			time: t("1 час назад", "1 hour ago"),
		},
		{
			action: t("Заказ отправлен", "Order shipped"),
			details: "#BB-123440 · " + t("доставка курьером", "courier delivery"),
			time: t("2 часа назад", "2 hours ago"),
		},
	];

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Header (from first snippet, adapted for Next + language toggle) */}
			<header className='bg-white border-b border-gray-200'>
				<div className='px-4 py-4 max-w-7xl mx-auto'>
					<div className='flex items-center justify-between gap-4'>
						<div>
							<h1 className='text-xl font-bold text-gray-900'>
								{t("Админ-панель", "Admin panel")}
							</h1>
							<p className='text-sm text-gray-500'>BARCELO BIAGI — Иваново</p>
						</div>
						<div className='flex items-center gap-3'>
							<button
								onClick={() => setLanguage(language === "ru" ? "en" : "ru")}
								className='px-3 py-2 text-xs font-semibold rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50'
							>
								{language === "ru"
									? t("Русский", "Russian")
									: t("Английский", "English")}
							</button>
							<Link
								href='/'
								className='p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg'
							>
								<Settings className='w-5 h-5' />
							</Link>
							<button
								onClick={handleLogout}
								className='p-2 text-gray-600 hover:text-error hover:bg-error/10 rounded-lg'
							>
								<LogOut className='w-5 h-5' />
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content (styled like your first snippet) */}
			<div className='px-4 py-6 max-w-7xl mx-auto'>
				{/* Stats Grid */}
				<div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
					{stats.map((stat, index) => (
						<div
							key={index}
							className='bg-white rounded-lg border border-gray-200 p-4'
						>
							<div className='flex items-start justify-between mb-3'>
								<div className={`p-2 rounded-lg ${stat.bgColor}`}>
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
							<p className='text-2xl font-bold text-gray-900 mb-1'>
								{stat.value}
							</p>
							<p className='text-xs text-gray-500'>{stat.label}</p>
						</div>
					))}
				</div>

				{/* Quick Actions */}
				<div className='mb-6'>
					<h3 className='mb-4 text-sm font-semibold text-gray-900'>
						{t("Быстрые действия", "Quick actions")}
					</h3>
					<div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-4'>
						{quickActions.map((action, index) => (
							<Link
								key={index}
								href={action.path}
								className='bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow'
							>
								<div
									className={`inline-flex p-2 rounded-lg mb-3 ${
										action.color === "primary"
											? "bg-primary/10 text-primary"
											: action.color === "accent"
											? "bg-accent/10 text-accent"
											: action.color === "success"
											? "bg-success/10 text-success"
											: "bg-warning/10 text-warning"
									}`}
								>
									<action.icon className='w-5 h-5' />
								</div>
								<h4 className='mb-1 text-sm font-semibold text-gray-900'>
									{action.label}
								</h4>
								<p className='text-xs text-gray-500'>{action.description}</p>
							</Link>
						))}
					</div>
				</div>

				{/* Recent Activity + Latest Products */}
				<div className='grid lg:grid-cols-2 gap-4'>
					{/* Recent Activity (from first snippet) */}
					<div className='bg-white rounded-lg border border-gray-200 p-4'>
						<h3 className='mb-4 text-sm font-semibold text-gray-900'>
							{t("Последние события", "Recent activity")}
						</h3>
						<div className='space-y-3'>
							{recentEvents.map((event, index) => (
								<div
									key={index}
									className='flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0'
								>
									<div className='w-2 h-2 bg-primary rounded-full mt-2' />
									<div className='flex-1'>
										<p className='text-sm font-medium text-gray-900'>
											{event.action}
										</p>
										<p className='text-xs text-gray-500'>{event.details}</p>
									</div>
									<span className='text-xs text-gray-400'>{event.time}</span>
								</div>
							))}
						</div>
					</div>

					{/* Latest Products (your dynamic block, restyled to match) */}
					<div className='bg-white rounded-lg border border-gray-200 p-4'>
						<div className='flex items-center justify-between mb-4'>
							<h3 className='text-sm font-semibold text-gray-900'>
								{t("Последние товары", "Latest products")}
							</h3>
							<Link
								href='/admin/inventory'
								className='text-primary text-xs font-semibold hover:underline'
							>
								{t("Показать все", "View all")}
							</Link>
						</div>
						<div className='space-y-3'>
							{recentProducts.map((product) => (
								<div
									key={product.id}
									className='flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0'
								>
									<div className='h-10 w-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0'>
										<img
											src={
												product.images[0] || "https://via.placeholder.com/80"
											}
											alt={product.name_ru}
											className='h-full w-full object-cover'
										/>
									</div>
									<div className='flex-1 min-w-0'>
										<p className='text-sm font-medium text-gray-900 truncate'>
											{language === "ru" ? product.name_ru : product.name_en}
										</p>
										<p className='text-xs text-gray-500 capitalize'>
											{product.category}
										</p>
									</div>
									<div className='text-right'>
										<p className='text-sm font-semibold text-gray-900'>
											{product.price.toLocaleString(
												language === "ru" ? "ru-RU" : "en-US"
											)}{" "}
											₽
										</p>
										<p className='text-xs text-green-600'>
											{t("В наличии", "In stock")}
										</p>
									</div>
								</div>
							))}
							{recentProducts.length === 0 && (
								<div className='py-4 text-center text-xs text-gray-500'>
									{t("Нет товаров для отображения", "No products to show")}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

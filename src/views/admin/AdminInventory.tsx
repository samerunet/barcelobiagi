"use client";

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
} from "lucide-react";
import { loadAdminProducts } from "@/data/adminStore";
import { Product } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

type FilterStatus = "all" | "active" | "inactive" | "low_stock" | "featured";
type AdminProduct = Product & {
	status?: "active" | "inactive";
	featured?: boolean;
};

export function AdminInventory() {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");
	const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
	const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
		new Set()
	);
	const [showBulkActions, setShowBulkActions] = useState(false);
	const [products, setProducts] = useState<AdminProduct[]>([]);
	const { language, setLanguage, t } = useLanguage();

	// Load products from local storage (or other admin store)
	useEffect(() => {
		const loaded = loadAdminProducts().map((p) => ({
			...p,
			status: (p as AdminProduct).status || "active",
			featured: (p as AdminProduct).featured ?? false,
		}));
		setProducts(loaded);
	}, []);

	const filteredProducts = useMemo(
		() =>
			products.filter((product) => {
				const query = searchQuery.toLowerCase();
				const matchesSearch =
					product.name_ru.toLowerCase().includes(query) ||
					product.name_en.toLowerCase().includes(query) ||
					product.sku.includes(searchQuery);

				const matchesFilter =
					filterStatus === "all"
						? true
						: filterStatus === "active"
						? product.status === "active"
						: filterStatus === "inactive"
						? product.status === "inactive"
						: filterStatus === "low_stock"
						? product.stock_total < product.stock_low_threshold
						: filterStatus === "featured"
						? product.featured
						: true;

				return matchesSearch && matchesFilter;
			}),
		[products, searchQuery, filterStatus]
	);

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
			setSelectedProducts(new Set(filteredProducts.map((p) => p.id)));
			setShowBulkActions(true);
		}
	};

	const handleBulkAction = (action: string) => {
		console.log(
			`Bulk action: ${action} for products:`,
			Array.from(selectedProducts)
		);
		// TODO: call API here
		setSelectedProducts(new Set());
		setShowBulkActions(false);
	};

	return (
		<div className='min-h-screen bg-gray-50 text-slate-900 pb-20'>
			{/* Header (sticky, with search + filters like CRA version) */}
			<header className='bg-white border-b border-gray-200 sticky top-0 z-30'>
				<div className='px-4 py-4 max-w-7xl mx-auto'>
					{/* Top row */}
					<div className='flex flex-wrap items-center justify-between gap-3 mb-4'>
						<div className='flex items-center gap-3'>
							<Link
								href='/admin/dashboard'
								className='p-2 rounded-lg hover:bg-gray-100 transition'
							>
								<ArrowLeft className='w-5 h-5 text-gray-700' />
							</Link>
							<div>
								<h1 className='text-xl font-bold text-gray-900'>
									{t("Управление товарами", "Inventory management")}
								</h1>
								<p className='text-sm text-gray-500'>
									{t("Товаров в списке", "Products in list")}:{" "}
									{filteredProducts.length}
								</p>
							</div>
						</div>

						<div className='flex items-center gap-2'>
							<button
								onClick={() => setLanguage(language === "ru" ? "en" : "ru")}
								className='px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50'
							>
								{language === "ru" ? "RU" : "EN"}
							</button>
							<Link
								href='/'
								className='px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50'
							>
								{t("Посмотреть сайт", "View site")}
							</Link>
							<button
								onClick={() => router.push("/admin/inventory/add")}
								className='inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition shadow-sm'
							>
								<Plus className='w-4 h-4' />
								<span>{t("Добавить", "Add product")}</span>
							</button>
						</div>
					</div>

					{/* Search */}
					<div className='relative mb-3'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
						<input
							type='text'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder={t(
								"Поиск по названию или SKU...",
								"Search by name or SKU..."
							)}
							className='w-full rounded-xl border border-gray-200 bg-white pl-10 pr-3 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-primary/60 shadow-sm'
						/>
					</div>

					{/* Filters */}
					<div className='flex gap-2 overflow-x-auto pb-1'>
						{[
							{
								key: "all",
								label: t("Все", "All"),
								count: products.length,
							},
							{
								key: "active",
								label: t("Активные", "Active"),
								count: products.filter((p) => p.status === "active").length,
							},
							{
								key: "inactive",
								label: t("Скрытые", "Hidden"),
								count: products.filter((p) => p.status === "inactive").length,
							},
							{
								key: "low_stock",
								label: t("Мало на складе", "Low stock"),
								count: products.filter(
									(p) => p.stock_total < p.stock_low_threshold
								).length,
							},
							{
								key: "featured",
								label: t("Избранные", "Featured"),
								count: products.filter((p) => p.featured).length,
							},
						].map((filter) => (
							<button
								key={filter.key}
								onClick={() => setFilterStatus(filter.key as FilterStatus)}
								className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
									filterStatus === filter.key
										? "bg-primary text-white"
										: "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
				<div className='bg-white border-b border-gray-200 px-4 py-2'>
					<label className='flex items-center gap-2 cursor-pointer max-w-7xl mx-auto'>
						<input
							type='checkbox'
							checked={selectedProducts.size === filteredProducts.length}
							onChange={selectAll}
							className='w-4 h-4 accent-primary'
						/>
						<span className='text-sm text-gray-600'>
							{t("Выбрать все", "Select all")} ({selectedProducts.size}{" "}
							{t("из", "of")} {filteredProducts.length})
						</span>
					</label>
				</div>
			)}

			{/* Products List – card layout like new version */}
			<div className='px-4 py-4 max-w-7xl mx-auto'>
				<div className='space-y-3'>
					{filteredProducts.map((product) => (
						<div
							key={product.id}
							className={`bg-white rounded-lg border transition-all ${
								selectedProducts.has(product.id)
									? "border-primary shadow-sm"
									: "border-gray-200"
							}`}
						>
							<div className='p-4'>
								<div className='flex gap-3'>
									{/* Checkbox */}
									<div className='flex-shrink-0 pt-1'>
										<input
											type='checkbox'
											checked={selectedProducts.has(product.id)}
											onChange={() => toggleSelectProduct(product.id)}
											className='w-4 h-4 accent-primary'
										/>
									</div>

									{/* Image */}
									<div className='flex-shrink-0'>
										<img
											src={
												product.images[0] ||
												"https://via.placeholder.com/80?text=No+Image"
											}
											alt={product.name_ru}
											className='w-20 h-20 object-cover rounded-lg border border-gray-200'
										/>
									</div>

									{/* Info */}
									<div className='flex-1 min-w-0'>
										{/* Title + actions */}
										<div className='flex items-start justify-between gap-2 mb-1'>
											<div className='flex-1 min-w-0'>
												<h4 className='text-sm font-medium text-gray-900 mb-0.5 line-clamp-1'>
													{language === "ru"
														? product.name_ru
														: product.name_en}
												</h4>
												<p className='text-xs text-gray-500'>{product.sku}</p>
											</div>
											<div className='flex items-center gap-1'>
												{product.featured && (
													<span className='inline-flex items-center gap-1 px-2 py-0.5 bg-warning/10 text-warning rounded text-xs'>
														<Star className='w-3 h-3' />
													</span>
												)}
												<button className='p-1 hover:bg-gray-100 rounded'>
													<MoreVertical className='w-4 h-4 text-gray-400' />
												</button>
											</div>
										</div>

										{/* Badges */}
										<div className='flex flex-wrap items-center gap-2 mb-2'>
											<span
												className={`px-2 py-0.5 rounded text-xs font-medium ${
													product.status === "active"
														? "bg-success/10 text-success"
														: "bg-gray-200 text-gray-600"
												}`}
											>
												{product.status === "active"
													? t("Активен", "Active")
													: t("Скрыт", "Hidden")}
											</span>
											<span
												className={`px-2 py-0.5 rounded text-xs font-medium ${
													product.stock_total < product.stock_low_threshold
														? "bg-error/10 text-error"
														: "bg-gray-100 text-gray-600"
												}`}
											>
												{t("Склад", "Stock")}: {product.stock_total}
											</span>
											<span className='px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium capitalize'>
												{product.category}
											</span>
										</div>

										{/* Price + edit */}
										<div className='flex items-center justify-between'>
											<p className='text-lg font-bold text-gray-900'>
												{product.price.toLocaleString(
													language === "ru" ? "ru-RU" : "en-US"
												)}{" "}
												₽
											</p>
											<button
												onClick={() =>
													router.push(`/admin/inventory/edit/${product.id}`)
												}
												className='text-primary hover:text-primary-dark text-sm font-medium flex items-center gap-1'
											>
												<Edit className='w-4 h-4' />
												{t("Изменить", "Edit")}
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					))}

					{filteredProducts.length === 0 && (
						<div className='text-center py-12 text-sm text-gray-500'>
							{t("Товары не найдены", "No products found")}
						</div>
					)}
				</div>
			</div>

			{/* Bulk Actions Bar (fixed bottom, like new version) */}
			{showBulkActions && (
				<div className='mobile-bottom-bar'>
					<div className='px-4 py-3 bg-white border-t border-gray-200'>
						<div className='flex items-center justify-between mb-2'>
							<span className='text-sm font-medium text-gray-900'>
								{t("Выбрано", "Selected")}: {selectedProducts.size}
							</span>
							<button
								onClick={() => {
									setSelectedProducts(new Set());
									setShowBulkActions(false);
								}}
								className='text-sm text-gray-600 hover:text-gray-900'
							>
								{t("Отменить", "Cancel")}
							</button>
						</div>
						<div className='grid grid-cols-3 gap-2'>
							<button
								onClick={() => handleBulkAction("activate")}
								className='px-3 py-2 bg-success text-white rounded-lg text-sm font-medium hover:bg-success/90'
							>
								<Eye className='w-4 h-4 mx-auto mb-1' />
								{t("Активировать", "Activate")}
							</button>
							<button
								onClick={() => handleBulkAction("deactivate")}
								className='px-3 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700'
							>
								<EyeOff className='w-4 h-4 mx-auto mb-1' />
								{t("Скрыть", "Hide")}
							</button>
							<button
								onClick={() => handleBulkAction("feature")}
								className='px-3 py-2 bg-warning text-white rounded-lg text-sm font-medium hover:bg-warning/90'
							>
								<Star className='w-4 h-4 mx-auto mb-1' />
								{t("В избранное", "Feature")}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

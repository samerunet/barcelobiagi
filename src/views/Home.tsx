import React from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import { ArrowRight, TrendingUp, Heart, Star } from "lucide-react";
import { mockProducts } from "../data/mockData";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function Home() {
  const { language, t } = useLanguage();

  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1750032627171-6af2b5765b98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwc2hvZXMlMjBwcmVtaXVtJTIwYnJvd258ZW58MXx8fHwxNzY0MDAwMzA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      title_ru: 'Новая коллекция 2025',
      title_en: 'New Collection 2025',
      subtitle_ru: 'Премиальная кожаная обувь из Испании',
      subtitle_en: 'Premium Spanish Leather Footwear',
      cta_ru: 'Смотреть коллекцию',
      cta_en: 'View Collection',
      link: '/category/new',
    },
  ];

  const categories = [
    {
      name_ru: 'Мужская обувь',
      name_en: 'Men\'s Shoes',
      image: 'https://images.unsplash.com/photo-1758387813660-1ae7497ace27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYm9vdHMlMjBlbGVnYW50fGVufDF8fHx8MTc2NDAwMDMwNXww&ixlib=rb-4.1.0&q=80&w=1080',
      link: '/category/men',
      badge_ru: 'Хит',
      badge_en: 'Trending',
    },
    {
      name_ru: 'Женская обувь',
      name_en: 'Women\'s Shoes',
      image: 'https://images.unsplash.com/photo-1667862714309-359b48ec1f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhY2Nlc3NvcmllcyUyMGxlYXRoZXJ8ZW58MXx8fHwxNzY0MDAwMzA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      link: '/category/women',
    },
    {
      name_ru: 'Аксессуары',
      name_en: 'Accessories',
      image: 'https://images.unsplash.com/photo-1760302318620-261f5e4d1940?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwZm9vdHdlYXIlMjBzdG9yZXxlbnwxfHx8fDE3NjQwMDAzMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      link: '/category/accessories',
      badge_ru: 'Новое',
      badge_en: 'New',
    },
  ];

  const featuredProducts = mockProducts.slice(0, 8);

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={heroSlides[0].image}
            alt="Hero"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        </div>
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-2xl">
            <div className="inline-block mb-4 px-3 py-1 bg-brand-camel text-gray-900 rounded-full text-xs font-bold uppercase tracking-wider">
              Brand of Spain Since 1987
            </div>
            <h1 className="text-white mb-4">
              {language === 'ru' ? heroSlides[0].title_ru : heroSlides[0].title_en}
            </h1>
            <p className="text-lg text-gray-200 mb-8">
              {language === 'ru' ? heroSlides[0].subtitle_ru : heroSlides[0].subtitle_en}
            </p>
            <Link
              href={heroSlides[0].link}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
            >
              {language === 'ru' ? heroSlides[0].cta_ru : heroSlides[0].cta_en}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2>{t('Категории', 'Categories')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={category.link}
                className="group relative aspect-[4/5] overflow-hidden rounded-xl card-hover"
              >
                <ImageWithFallback
                  src={category.image}
                  alt={language === 'ru' ? category.name_ru : category.name_en}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {category.badge_ru && (
                    <span className="inline-block px-3 py-1 bg-accent text-white text-xs font-bold rounded-full mb-3">
                      {language === 'ru' ? category.badge_ru : category.badge_en}
                    </span>
                  )}
                  <h3 className="text-white mb-1">
                    {language === 'ru' ? category.name_ru : category.name_en}
                  </h3>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    {t('Смотреть', 'View')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2>{t('Популярные товары', 'Featured Products')}</h2>
            <Link
              href="/category/all"
              className="text-sm font-medium text-primary hover:text-primary-dark flex items-center gap-1"
            >
              {t('Все товары', 'View All')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => {
              const discount = product.old_price 
                ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
                : 0;
              
              return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group card card-hover"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <ImageWithFallback
                    src={product.images[0]}
                    alt={language === 'ru' ? product.name_ru : product.name_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {discount > 0 && (
                    <span className="absolute top-2 left-2 badge-sale">
                      -{discount}%
                    </span>
                  )}
                  <button className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="w-4 h-4 text-gray-700" />
                  </button>
                </div>

                {/* Info */}
                <div className="p-3 md:p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                    {language === 'ru' ? product.name_ru : product.name_en}
                  </h4>
                  <p className="text-xs text-gray-500 mb-2 capitalize">
                    {product.category}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        {product.price.toLocaleString('ru-RU')} ₽
                      </p>
                      {product.old_price && (
                        <p className="text-xs text-gray-400 line-through">
                          {product.old_price.toLocaleString('ru-RU')} ₽
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )})}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-16 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h4 className="mb-2">
                {t('Премиальное качество', 'Premium Quality')}
              </h4>
              <p className="text-sm text-gray-600">
                {t(
                  'Натураьная кожа и европейское качество с 1987 года',
                  'Genuine leather and European quality since 1987'
                )}
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-success/10 rounded-full mb-4">
                <Star className="w-6 h-6 text-success" />
              </div>
              <h4 className="mb-2">
                {t('Гарантия качества', 'Quality Guarantee')}
              </h4>
              <p className="text-sm text-gray-600">
                {t(
                  'Официальная гарантия на всю продукцию',
                  'Official warranty on all products'
                )}
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mb-4">
                <Heart className="w-6 h-6 text-accent" />
              </div>
              <h4 className="mb-2">
                {t('Бесплатная доставка', 'Free Shipping')}
              </h4>
              <p className="text-sm text-gray-600">
                {t(
                  'Бесплатная оставка по Иваново',
                  'Free delivery in Ivanovo'
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Store Info */}
      <section className="py-12 md:py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-white mb-4">
            {t('Посетите наш магазин', 'Visit Our Store')}
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            {t(
              'ТРЦ «Серебряный город», г. Иваново, ул. 8 Марта, 32',
              'Serebryany Gorod Mall, Ivanovo, 8 Marta St., 32'
            )}
          </p>
          <Link
            href="/stores"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            {t('Подробнее', 'Learn More')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

interface PlaceholderPageProps {
  title: string;
  titleEn: string;
  descriptionRu?: string;
  descriptionEn?: string;
}

export function PlaceholderPage({
  title,
  titleEn,
  descriptionRu,
  descriptionEn,
}: PlaceholderPageProps) {
  const { language } = useLanguage();

  const description =
    language === "ru"
      ? descriptionRu ||
        "Эта страница находится в разработке. Скоро здесь появится контент."
      : descriptionEn ||
        "This page is under construction. Content will be added soon.";

  return (
    <div className="min-h-screen bg-surface-light py-12">
      <div className="container mx-auto px-4">
        <h1 className="mb-6">
          {language === "ru" ? title : titleEn}
        </h1>
        <p className="text-text-light text-lg">{description}</p>
      </div>
    </div>
  );
}

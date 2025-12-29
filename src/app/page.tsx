'use client';

import { useLanguage } from "@/contexts/language-context";
import { ArticleHeader } from "@/components/article-header";
import { ArticleContent } from "@/components/article-content";
import { HomeArticleComments } from "@/components/home-article-comments";
import { ContentSidebar } from "@/components/content-sidebar";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="bg-gray-50">
      <div className="max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8 py-10 relative">
        {/* Layout para pantallas grandes (xl) con sidebar integrada */}
        <div className="xl:grid xl:grid-cols-4 xl:gap-8 2xl:hidden">
          {/* Sidebar - solo visible en xl y superior */}
          <aside className="xl:col-span-1 hidden xl:block">
            <ContentSidebar />
          </aside>

          {/* Contenido principal */}
          <main className="xl:col-span-3 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <ArticleHeader />
              <ArticleContent />
              <HomeArticleComments />
            </div>
          </main>
        </div>

        {/* Layout para pantallas extra grandes (2xl+) - sidebar flotante */}
        <div className="hidden 2xl:block">
          <main className="bg-white rounded-lg shadow-md overflow-hidden max-w-5xl mx-auto">
            <div className="p-6">
              <ArticleHeader />
              <ArticleContent />
              <HomeArticleComments />
            </div>
          </main>
          <ContentSidebar />
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/language-context";
import { ArticleHeader } from "@/components/article-header";
import { ArticleContent } from "@/components/article-content";
import { ArticleComments } from "@/components/article-comments";
import { ContentSidebar } from "@/components/content-sidebar";

export default function Home() {
  const { t } = useLanguage();
  const [postId, setPostId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMainPost = async () => {
      try {
        // Obtener el primer post publicado
        const response = await fetch('/api/posts?status=published&limit=1');
        if (response.ok) {
          const data = await response.json();
          if (data.posts && data.posts.length > 0) {
            setPostId(data.posts[0].id);
            console.log('Main post ID:', data.posts[0].id);
          } else {
            console.log('No published posts found');
          }
        }
      } catch (error) {
        console.error('Error fetching main post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMainPost();
  }, []);

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
              {!loading && postId && <ArticleComments postId={postId} />}
              {!loading && !postId && (
                <div className="mt-16 border-t pt-10">
                  <p className="text-gray-600">{t('article.loadingComments')}</p>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Layout para pantallas extra grandes (2xl+) - sidebar flotante */}
        <div className="hidden 2xl:block">
          <main className="bg-white rounded-lg shadow-md overflow-hidden max-w-5xl mx-auto">
            <div className="p-6">
              <ArticleHeader />
              <ArticleContent />
              {!loading && postId && <ArticleComments postId={postId} />}
              {!loading && !postId && (
                <div className="mt-16 border-t pt-10">
                  <p className="text-gray-600">{t('article.loadingComments')}</p>
                </div>
              )}
            </div>
          </main>
          <ContentSidebar />
        </div>
      </div>
    </div>
  );
}
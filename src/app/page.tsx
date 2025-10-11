import { ArticleHeader } from "@/components/article-header";
import { ArticleContent } from "@/components/article-content";
import { ArticleComments } from "@/components/article-comments";
import { Footer } from "@/components/footer";
import { ContentSidebar } from "@/components/content-sidebar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8 py-10 relative">
        {/* Layout para pantallas medianas y grandes (lg-xl) */}
        <div className="lg:grid lg:grid-cols-4 lg:gap-8 2xl:hidden">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <ContentSidebar />
          </aside>
          
          {/* Contenido principal */}
          <main className="lg:col-span-3 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <ArticleHeader />
              <ArticleContent />
              <ArticleComments />
            </div>
          </main>
        </div>

        {/* Layout para pantallas extra grandes (2xl+) - como antes */}
        <div className="hidden 2xl:block">
          <main className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <ArticleHeader />
              <ArticleContent />
              <ArticleComments />
            </div>
          </main>
          <ContentSidebar />
        </div>
      </div>
      <Footer />
    </div>
  );
}
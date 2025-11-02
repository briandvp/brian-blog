'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'es' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Traducciones completas
const translations: Record<Language, Record<string, string>> = {
  es: {
    // Navegación
    'nav.home': 'Inicio',
    'nav.blog': 'Blog',
    'nav.store': 'Tienda',
    'nav.dashboard': 'Dashboard',
    'nav.newPost': 'Nueva Publicación',
    'nav.myAccount': 'Mi cuenta',
    'nav.logout': 'Cerrar sesión',
    'nav.login': 'Iniciar sesión',
    'nav.language': 'Idioma',
    'nav.cart': 'Carrito',
    'nav.welcomeText': 'Blog sobre estoicismo y desarrollo personal',
    
    // Configuración de idioma
    'language.spanish': 'Español',
    'language.english': 'English',
    'language.change': 'Cambiar idioma',
    
    // Dashboard Sidebar
    'dashboard.sidebar.title': 'Panel de Control',
    'dashboard.sidebar.subtitle': 'Gestiona brian-blog',
    'dashboard.sidebar.dashboard': 'Dashboard',
    'dashboard.sidebar.posts': 'Publicaciones',
    'dashboard.sidebar.newPost': 'Nueva publicación',
    'dashboard.sidebar.users': 'Usuarios',
    'dashboard.sidebar.comments': 'Comentarios',
    'dashboard.sidebar.store': 'Tienda',
    'dashboard.sidebar.analytics': 'Analíticas',
    'dashboard.sidebar.settings': 'Configuración',
    'dashboard.sidebar.quickActions': 'Acciones rápidas',
    'dashboard.sidebar.createPost': 'Crear publicación',
    'dashboard.sidebar.managePosts': 'Gestionar posts',
    'dashboard.sidebar.viewBlog': 'Ver blog',
    
    // Dashboard Principal
    'dashboard.main.title': 'Dashboard',
    'dashboard.main.subtitle': 'Gestiona tus publicaciones y contenido',
    'dashboard.main.newPublication': 'Nueva publicación',
    'dashboard.main.posts': 'Publicaciones',
    'dashboard.main.totalViews': 'Vistas totales',
    'dashboard.main.comments': 'Comentarios',
    'dashboard.main.publishedPosts': 'Publicaciones publicadas',
    'dashboard.main.noPosts': 'No hay publicaciones publicadas',
    'dashboard.main.createFirst': 'Crea tu primera publicación para comenzar',
    'dashboard.main.titleCol': 'Título',
    'dashboard.main.categoryCol': 'Categoría',
    'dashboard.main.viewsCol': 'Vistas',
    'dashboard.main.dateCol': 'Fecha',
    'dashboard.main.actionsCol': 'Acciones',
    
    // Estados de publicación
    'post.status.published': 'Publicado',
    'post.status.draft': 'Borrador',
    'post.status.archived': 'Archivado',
    
    // Dashboard Store
    'dashboard.store.title': 'Gestión de Tienda',
    'dashboard.store.subtitle': 'Administra productos y pedidos',
    'dashboard.store.products': 'Productos',
    'dashboard.store.manageProducts': 'Gestiona el catálogo de productos',
    'dashboard.store.newProduct': 'Nuevo Producto',
    'dashboard.store.viewCatalog': 'Ver Catálogo',
    'dashboard.store.orders': 'Pedidos',
    'dashboard.store.manageOrders': 'Administra los pedidos recibidos',
    'dashboard.store.viewOrders': 'Ver Pedidos',
    'dashboard.store.settings': 'Configuración',
    'dashboard.store.adjustSettings': 'Ajusta la configuración de la tienda',
    'dashboard.store.configure': 'Configurar',
    
    // Dashboard Settings
    'dashboard.settings.title': 'Configuración',
    'dashboard.settings.subtitle': 'Gestiona la configuración de tu blog',
    'dashboard.settings.tabs.general': 'General',
    'dashboard.settings.tabs.appearance': 'Apariencia',
    'dashboard.settings.tabs.language': 'Idioma',
    'dashboard.settings.tabs.seo': 'SEO',
    'dashboard.settings.tabs.notifications': 'Notificaciones',
    'dashboard.settings.tabs.security': 'Seguridad',
    'dashboard.settings.language.title': 'Configuración de Idioma',
    'dashboard.settings.language.description': 'Selecciona el idioma preferido para la interfaz del dashboard y del sitio',
    'dashboard.settings.language.note': 'El cambio de idioma afectará a toda la interfaz del sitio, incluyendo el dashboard, blog, tienda y todas las páginas.',
    
    // Dashboard Layout
    'dashboard.layout.loading': 'Cargando dashboard...',
    'dashboard.layout.loginRequired': 'Debes iniciar sesión para acceder al dashboard',
    'dashboard.layout.noPermissions': 'No tienes permisos para acceder al dashboard',
    'dashboard.store.noPermissions': 'No tienes permisos para acceder a esta página',
    
    // Blog
    'blog.title': 'Blog Estoico',
    'blog.subtitle': 'Explora artículos sobre filosofía estoica, desarrollo personal y sabiduría ancestral',
    'blog.searchPlaceholder': 'Buscar artículos...',
    'blog.allCategories': 'Todas las categorías',
    'blog.sort.newest': 'Más recientes',
    'blog.sort.oldest': 'Más antiguos',
    'blog.sort.mostViewed': 'Más vistos',
    'blog.sort.mostCommented': 'Más comentados',
    'blog.loading': 'Cargando artículos...',
    'blog.noArticles': 'No se encontraron artículos',
    'blog.adjustFilters': 'Intenta ajustar los filtros de búsqueda',
    'blog.noArticlesYet': 'Aún no hay artículos publicados',
    'blog.readMore': 'Leer más',
    'blog.cta.title': '¿Te gusta el contenido?',
    'blog.cta.subtitle': 'Suscríbete para recibir las últimas publicaciones sobre estoicismo',
    'blog.cta.subscribe': 'Suscribirse',
    'blog.min': 'min',
    
    // Tienda
    'store.title': 'Tienda Estoica',
    'store.subtitle': 'Descubre productos inspirados en la filosofía estoica para tu crecimiento personal y reflexión diaria',
    'store.searchPlaceholder': 'Buscar productos...',
    'store.sortBy': 'Ordenar por:',
    'store.sort.featured': 'Destacados',
    'store.sort.priceLow': 'Precio: menor a mayor',
    'store.sort.priceHigh': 'Precio: mayor a menor',
    'store.sort.rating': 'Mejor valorados',
    'store.allProducts': 'Todos los productos',
    'store.categoryProducts': 'Productos de',
    'store.productCount': 'producto',
    'store.productCountPlural': 'productos',
    'store.noProducts': 'No se encontraron productos',
    'store.adjustFilters': 'Intenta ajustar tus filtros de búsqueda',
    'store.featured': 'Destacado',
    'store.outOfStock': 'Agotado',
    'store.add': 'Agregar',
    'store.addedToCart': 'agregado al carrito',
    'store.whyChoose': '¿Por qué elegir nuestros productos?',
    'store.qualityPremium': 'Calidad Premium',
    'store.qualityDesc': 'Productos cuidadosamente seleccionados con materiales de alta calidad',
    'store.stoicInspiration': 'Inspiración Estoica',
    'store.stoicDesc': 'Cada producto está diseñado para inspirar reflexión y crecimiento personal',
    'store.fastShipping': 'Envío Rápido',
    'store.shippingDesc': 'Entrega rápida y segura para que puedas comenzar tu práctica estoica',
    'store.categories.all': 'Todos',
    'store.categories.books': 'Libros',
    'store.categories.clothing': 'Ropa',
    'store.categories.accessories': 'Accesorios',
    
    // Acciones comunes
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.view': 'Ver',
    'common.confirm': 'Confirmar',
    'common.confirmDelete': '¿Estás seguro de que quieres eliminar esta publicación?',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.loading': 'Cargando...',
    'common.create': 'Crear',
    'common.update': 'Actualizar',
    'common.close': 'Cerrar',
    
    // Artículos y páginas
    'article.backToBlog': 'Volver al Blog',
    'article.postNotFound': 'Post no encontrado',
    'article.postDeleted': 'El post que buscas no existe o ha sido eliminado.',
    'article.readingTime': 'min de lectura',
    'article.views': 'vistas',
    'article.comments': 'comentarios',
    'article.comment': 'comentar',
    'article.author': 'Autor',
    'article.morePosts': 'Más Posts',
    'article.comment': 'Comentar',
    'article.loadingComments': 'Cargando comentarios...',
    'article.tableOfContents': 'Tabla de contenidos',
    'article.categories': 'Categorías',
    'article.principles': 'Principios',
    'article.commentsLabel': 'Comments',
    
    // Cuenta de usuario
    'account.title': 'Mi Cuenta',
    'account.subtitle': 'Gestiona tu información personal y preferencias',
    'account.saved': 'Configuración guardada exitosamente',
    'account.language.title': 'Configuración de Idioma',
    'account.language.description': 'Selecciona el idioma preferido para la interfaz',
    'account.info.title': 'Información Personal',
    'account.info.name': 'Nombre',
    'account.info.email': 'Correo electrónico',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.blog': 'Blog',
    'nav.store': 'Store',
    'nav.dashboard': 'Dashboard',
    'nav.newPost': 'New Post',
    'nav.myAccount': 'My Account',
    'nav.logout': 'Log out',
    'nav.login': 'Log in',
    'nav.language': 'Language',
    'nav.cart': 'Cart',
    'nav.welcomeText': 'Blog about stoicism and personal development',
    
    // Language settings
    'language.spanish': 'Español',
    'language.english': 'English',
    'language.change': 'Change language',
    
    // Dashboard Sidebar
    'dashboard.sidebar.title': 'Control Panel',
    'dashboard.sidebar.subtitle': 'Manage brian-blog',
    'dashboard.sidebar.dashboard': 'Dashboard',
    'dashboard.sidebar.posts': 'Posts',
    'dashboard.sidebar.newPost': 'New Post',
    'dashboard.sidebar.users': 'Users',
    'dashboard.sidebar.comments': 'Comments',
    'dashboard.sidebar.store': 'Store',
    'dashboard.sidebar.analytics': 'Analytics',
    'dashboard.sidebar.settings': 'Settings',
    'dashboard.sidebar.quickActions': 'Quick Actions',
    'dashboard.sidebar.createPost': 'Create Post',
    'dashboard.sidebar.managePosts': 'Manage Posts',
    'dashboard.sidebar.viewBlog': 'View Blog',
    
    // Dashboard Principal
    'dashboard.main.title': 'Dashboard',
    'dashboard.main.subtitle': 'Manage your posts and content',
    'dashboard.main.newPublication': 'New Post',
    'dashboard.main.posts': 'Posts',
    'dashboard.main.totalViews': 'Total Views',
    'dashboard.main.comments': 'Comments',
    'dashboard.main.publishedPosts': 'Published Posts',
    'dashboard.main.noPosts': 'No published posts',
    'dashboard.main.createFirst': 'Create your first post to get started',
    'dashboard.main.titleCol': 'Title',
    'dashboard.main.categoryCol': 'Category',
    'dashboard.main.viewsCol': 'Views',
    'dashboard.main.dateCol': 'Date',
    'dashboard.main.actionsCol': 'Actions',
    
    // Post Status
    'post.status.published': 'Published',
    'post.status.draft': 'Draft',
    'post.status.archived': 'Archived',
    
    // Dashboard Store
    'dashboard.store.title': 'Store Management',
    'dashboard.store.subtitle': 'Manage products and orders',
    'dashboard.store.products': 'Products',
    'dashboard.store.manageProducts': 'Manage product catalog',
    'dashboard.store.newProduct': 'New Product',
    'dashboard.store.viewCatalog': 'View Catalog',
    'dashboard.store.orders': 'Orders',
    'dashboard.store.manageOrders': 'Manage received orders',
    'dashboard.store.viewOrders': 'View Orders',
    'dashboard.store.settings': 'Settings',
    'dashboard.store.adjustSettings': 'Adjust store settings',
    'dashboard.store.configure': 'Configure',
    
    // Dashboard Settings
    'dashboard.settings.title': 'Settings',
    'dashboard.settings.subtitle': 'Manage your blog settings',
    'dashboard.settings.tabs.general': 'General',
    'dashboard.settings.tabs.appearance': 'Appearance',
    'dashboard.settings.tabs.language': 'Language',
    'dashboard.settings.tabs.seo': 'SEO',
    'dashboard.settings.tabs.notifications': 'Notifications',
    'dashboard.settings.tabs.security': 'Security',
    'dashboard.settings.language.title': 'Language Settings',
    'dashboard.settings.language.description': 'Select your preferred language for the dashboard and site interface',
    'dashboard.settings.language.note': 'Changing the language will affect the entire site interface, including the dashboard, blog, store and all pages.',
    
    // Dashboard Layout
    'dashboard.layout.loading': 'Loading dashboard...',
    'dashboard.layout.loginRequired': 'You must log in to access the dashboard',
    'dashboard.layout.noPermissions': 'You do not have permission to access the dashboard',
    'dashboard.store.noPermissions': 'You do not have permission to access this page',
    
    // Blog
    'blog.title': 'Stoic Blog',
    'blog.subtitle': 'Explore articles about stoic philosophy, personal development and ancestral wisdom',
    'blog.searchPlaceholder': 'Search articles...',
    'blog.allCategories': 'All Categories',
    'blog.sort.newest': 'Newest',
    'blog.sort.oldest': 'Oldest',
    'blog.sort.mostViewed': 'Most Viewed',
    'blog.sort.mostCommented': 'Most Commented',
    'blog.loading': 'Loading articles...',
    'blog.noArticles': 'No articles found',
    'blog.adjustFilters': 'Try adjusting your search filters',
    'blog.noArticlesYet': 'No articles published yet',
    'blog.readMore': 'Read More',
    'blog.cta.title': 'Do you like the content?',
    'blog.cta.subtitle': 'Subscribe to receive the latest posts about stoicism',
    'blog.cta.subscribe': 'Subscribe',
    'blog.min': 'min',
    
    // Store
    'store.title': 'Stoic Store',
    'store.subtitle': 'Discover products inspired by stoic philosophy for your personal growth and daily reflection',
    'store.searchPlaceholder': 'Search products...',
    'store.sortBy': 'Sort by:',
    'store.sort.featured': 'Featured',
    'store.sort.priceLow': 'Price: Low to High',
    'store.sort.priceHigh': 'Price: High to Low',
    'store.sort.rating': 'Best Rated',
    'store.allProducts': 'All Products',
    'store.categoryProducts': 'Products from',
    'store.productCount': 'product',
    'store.productCountPlural': 'products',
    'store.noProducts': 'No products found',
    'store.adjustFilters': 'Try adjusting your search filters',
    'store.featured': 'Featured',
    'store.outOfStock': 'Out of Stock',
    'store.add': 'Add',
    'store.addedToCart': 'added to cart',
    'store.whyChoose': 'Why choose our products?',
    'store.qualityPremium': 'Premium Quality',
    'store.qualityDesc': 'Carefully selected products with high quality materials',
    'store.stoicInspiration': 'Stoic Inspiration',
    'store.stoicDesc': 'Each product is designed to inspire reflection and personal growth',
    'store.fastShipping': 'Fast Shipping',
    'store.shippingDesc': 'Fast and secure delivery so you can start your stoic practice',
    'store.categories.all': 'All',
    'store.categories.books': 'Books',
    'store.categories.clothing': 'Clothing',
    'store.categories.accessories': 'Accessories',
    
    // Common Actions
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.confirm': 'Confirm',
    'common.confirmDelete': 'Are you sure you want to delete this post?',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.loading': 'Loading...',
    'common.create': 'Create',
    'common.update': 'Update',
    'common.close': 'Close',
    
    // Articles and Pages
    'article.backToBlog': 'Back to Blog',
    'article.postNotFound': 'Post not found',
    'article.postDeleted': 'The post you are looking for does not exist or has been deleted.',
    'article.readingTime': 'min read',
    'article.views': 'views',
    'article.comments': 'comments',
    'article.comment': 'comment',
    'article.author': 'Author',
    'article.morePosts': 'More Posts',
    'article.comment': 'Comment',
    'article.loadingComments': 'Loading comments...',
    'article.tableOfContents': 'Table of Contents',
    'article.categories': 'Categories',
    'article.principles': 'Principles',
    'article.commentsLabel': 'Comments',
    
    // User Account
    'account.title': 'My Account',
    'account.subtitle': 'Manage your personal information and preferences',
    'account.saved': 'Settings saved successfully',
    'account.language.title': 'Language Settings',
    'account.language.description': 'Select your preferred language for the interface',
    'account.info.title': 'Personal Information',
    'account.info.name': 'Name',
    'account.info.email': 'Email',
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es')

  useEffect(() => {
    // Cargar idioma guardado desde localStorage
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage)
      if (typeof document !== 'undefined') {
        document.documentElement.lang = savedLanguage
      }
    } else {
      // Detectar idioma del navegador
      const browserLang = navigator.language.split('-')[0]
      const initialLang: Language = browserLang === 'en' ? 'en' : 'es'
      setLanguageState(initialLang)
      if (typeof document !== 'undefined') {
        document.documentElement.lang = initialLang
      }
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
    // Actualizar el atributo lang del HTML
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang
    }
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage debe ser usado dentro de un LanguageProvider')
  }
  return context
}


"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { 
  ShoppingCart, 
  Star, 
  Heart, 
  Search, 
  Filter,
  BookOpen,
  Coffee,
  Shirt,
  Gift,
  Award
} from "lucide-react";

// Datos de ejemplo para los productos
const mockProducts = [
  {
    id: 1,
    name: "Meditaciones de Marco Aurelio",
    description: "Edición especial con comentarios y reflexiones modernas",
    price: 25.99,
    originalPrice: 32.99,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=500&fit=crop",
    category: "Libros",
    rating: 4.8,
    reviews: 124,
    inStock: true,
    featured: true
  },
  {
    id: 2,
    name: "Taza Estoica Premium",
    description: "Taza de cerámica con citas inspiradoras de los filósofos estoicos",
    price: 18.50,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=500&fit=crop",
    category: "Accesorios",
    rating: 4.6,
    reviews: 89,
    inStock: true,
    featured: false
  },
  {
    id: 3,
    name: "Camiseta 'Amor Fati'",
    description: "Camiseta de algodón orgánico con el principio estoico del amor al destino",
    price: 22.00,
    originalPrice: 28.00,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
    category: "Ropa",
    rating: 4.7,
    reviews: 67,
    inStock: true,
    featured: true
  }
];

const categories = [
  { name: "Todos", icon: Gift, value: "all" },
  { name: "Libros", icon: BookOpen, value: "Libros" },
  { name: "Ropa", icon: Shirt, value: "Ropa" },
  { name: "Accesorios", icon: Award, value: "Accesorios" }
];

export default function Tienda() {
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [wishlist, setWishlist] = useState<number[]>([]);

  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "featured":
      default:
        return b.featured ? 1 : -1;
    }
  });

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const ProductCard = ({ product }: { product: any }) => (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={() => window.location.href = `/tienda/producto/${product.id}`}
    >
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-64 object-cover"
        />
        {product.featured && (
          <div className="absolute top-2 left-2 bg-[#42403e] text-white px-2 py-1 text-xs font-medium rounded">
            Destacado
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded text-sm font-medium">
              Agotado
            </span>
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
        >
          <Heart 
            className={`h-4 w-4 ${
              wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-400"
            }`} 
          />
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#42403e] bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
            <span className="text-xs text-gray-400 ml-1">({product.reviews})</span>
          </div>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-[#42403e]">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          
          <Button
            disabled={!product.inStock}
            onClick={(e) => {
              e.stopPropagation();
              if (product.inStock) {
                addItem({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  category: product.category,
                });
                alert(`"${product.name}" agregado al carrito`);
              }
            }}
            className="bg-[#42403e] hover:bg-[#36312f] text-white text-sm px-3 py-1"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            {product.inStock ? "Agregar" : "Agotado"}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Tienda Estoica</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubre productos inspirados en la filosofía estoica para tu crecimiento personal y reflexión diaria
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
              >
                <option value="featured">Destacados</option>
                <option value="price-low">Precio: menor a mayor</option>
                <option value="price-high">Precio: mayor a menor</option>
                <option value="rating">Mejor valorados</option>
              </select>
            </div>
          </div>

          {/* Categories */}
          <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.value
                        ? "bg-[#42403e] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === "all" ? "Todos los productos" : `Productos de ${selectedCategory}`}
            </h2>
            <span className="text-sm text-gray-500">
              {sortedProducts.length} producto{sortedProducts.length !== 1 ? 's' : ''}
            </span>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
              <p className="text-gray-500">Intenta ajustar tus filtros de búsqueda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* Featured Section */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            ¿Por qué elegir nuestros productos?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-[#42403e] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Calidad Premium</h3>
              <p className="text-gray-600">
                Productos cuidadosamente seleccionados con materiales de alta calidad
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#42403e] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Inspiración Estoica</h3>
              <p className="text-gray-600">
                Cada producto está diseñado para inspirar reflexión y crecimiento personal
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#42403e] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Coffee className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Envío Rápido</h3>
              <p className="text-gray-600">
                Entrega rápida y segura para que puedas comenzar tu práctica estoica
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
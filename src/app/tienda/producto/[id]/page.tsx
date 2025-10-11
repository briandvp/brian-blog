"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { 
  ShoppingCart, 
  Star, 
  Heart, 
  ArrowLeft,
  Truck,
  Shield,
  RotateCcw,
  Share2,
  Minus,
  Plus,
  Check
} from "lucide-react";

// Datos de ejemplo para los productos (en producción vendrían de una API)
const mockProducts = [
  {
    id: 1,
    name: "Meditaciones de Marco Aurelio",
    description: "Edición especial con comentarios y reflexiones modernas sobre la obra maestra del emperador filósofo. Esta versión incluye notas explicativas que conectan las enseñanzas antiguas con la vida moderna.",
    longDescription: `
      <p>Las <em>Meditaciones</em> de Marco Aurelio representan uno de los textos más importantes de la filosofía estoica. Escritas durante las campañas militares del emperador, estas reflexiones personales ofrecen una guía práctica para vivir con virtud y sabiduría.</p>
      
      <p>Esta edición especial incluye:</p>
      <ul>
        <li>Traducción moderna y accesible</li>
        <li>Comentarios explicativos de expertos en estoicismo</li>
        <li>Reflexiones sobre la aplicación práctica en la vida moderna</li>
        <li>Biografía detallada de Marco Aurelio</li>
        <li>Glosario de términos filosóficos</li>
      </ul>
      
      <p>Perfecto para estudiantes de filosofía, practicantes del estoicismo y cualquier persona interesada en el crecimiento personal y la sabiduría antigua.</p>
    `,
    price: 25.99,
    originalPrice: 32.99,
    images: [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=800&fit=crop"
    ],
    category: "Libros",
    rating: 4.8,
    reviews: 124,
    inStock: true,
    stock: 15,
    features: [
      "Edición de lujo con tapa dura",
      "Papel de alta calidad",
      "Tipografía legible y elegante",
      "Incluye marcador de página",
      "Tamaño perfecto para lectura"
    ],
    specifications: {
      "Páginas": "320",
      "Editorial": "Sabiduría Antigua",
      "Idioma": "Español",
      "Formato": "Tapa dura",
      "Dimensiones": "15 x 23 cm",
      "Peso": "450g"
    }
  },
  {
    id: 2,
    name: "Taza Estoica Premium",
    description: "Taza de cerámica de alta calidad con citas inspiradoras de los filósofos estoicos. Perfecta para comenzar el día con sabiduría.",
    longDescription: `
      <p>Esta taza premium está diseñada para acompañarte en tus momentos de reflexión matutina. Cada sorbo te recordará los principios fundamentales del estoicismo.</p>
      
      <p>Características especiales:</p>
      <ul>
        <li>Cerámica de alta calidad, libre de plomo</li>
        <li>Capacidad de 350ml</li>
        <li>Diseño ergonómico para un agarre cómodo</li>
        <li>Lavable en lavavajillas</li>
        <li>Resistente a microondas</li>
      </ul>
      
      <p>Ideal para el café matutino, té de la tarde o cualquier bebida caliente que prefieras mientras reflexionas sobre la sabiduría estoica.</p>
    `,
    price: 18.50,
    originalPrice: null,
    images: [
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=800&fit=crop"
    ],
    category: "Accesorios",
    rating: 4.6,
    reviews: 89,
    inStock: true,
    stock: 8,
    features: [
      "Cerámica premium",
      "Diseño ergonómico",
      "Lavable en lavavajillas",
      "Resistente a microondas",
      "Citas estoicas grabadas"
    ],
    specifications: {
      "Material": "Cerámica",
      "Capacidad": "350ml",
      "Altura": "10cm",
      "Diámetro": "8cm",
      "Peso": "280g",
      "Origen": "Hecho a mano en España"
    }
  }
];

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const { addItem, isInCart, getItemQuantity } = useCart();
  const productId = parseInt(params.id as string);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [selectedSize, setSelectedSize] = useState("M");

  const product = mockProducts.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
          <Button onClick={() => router.push("/tienda")} className="bg-[#42403e] hover:bg-[#36312f] text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la tienda
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Agregar el producto al carrito usando el contexto
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        category: product.category,
      });
    }
    
    // Mostrar confirmación
    alert(`Se agregaron ${quantity} unidad(es) de "${product.name}" al carrito`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Enlace copiado al portapapeles");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <button 
              onClick={() => router.push("/tienda")}
              className="text-gray-500 hover:text-[#42403e] transition-colors"
            >
              Tienda
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-500">{product.category}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? "border-[#42403e]" : "border-gray-200"
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#42403e] bg-gray-100 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsInWishlist(!isInWishlist)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Heart 
                      className={`h-5 w-5 ${
                        isInWishlist ? "fill-red-500 text-red-500" : "text-gray-400"
                      }`} 
                    />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Share2 className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) 
                          ? "text-yellow-400 fill-current" 
                          : "text-gray-300"
                      }`} 
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviews} reseñas)
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-[#42403e]">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">
                  ${product.originalPrice}
                </span>
              )}
              {product.originalPrice && (
                <span className="bg-red-100 text-red-800 px-2 py-1 text-sm font-medium rounded">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center space-x-2">
              {product.inStock ? (
                <>
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-green-600 font-medium">
                    En stock ({product.stock} disponibles)
                  </span>
                </>
              ) : (
                <>
                  <span className="h-5 w-5 bg-red-500 rounded-full"></span>
                  <span className="text-red-600 font-medium">Agotado</span>
                </>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Cantidad:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full bg-[#42403e] hover:bg-[#36312f] text-white py-3 text-lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.inStock ? "Agregar al carrito" : "Agotado"}
              </Button>
              
              <Button
                variant="outline"
                className="w-full border-[#42403e] text-[#42403e] hover:bg-[#42403e] hover:text-white"
              >
                Comprar ahora
              </Button>
            </div>

            {/* Features */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Características destacadas</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Description */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Descripción detallada</h2>
              <div 
                className="prose prose-lg max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: product.longDescription }}
              />
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Especificaciones</h2>
            <dl className="space-y-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                  <dt className="font-medium text-gray-700">{key}</dt>
                  <dd className="text-gray-600">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Información de envío</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="bg-[#42403e] rounded-full p-3">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Envío gratuito</h3>
                <p className="text-gray-600 text-sm">
                  Envío gratuito en pedidos superiores a $50
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-[#42403e] rounded-full p-3">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Garantía</h3>
                <p className="text-gray-600 text-sm">
                  30 días de garantía de satisfacción
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-[#42403e] rounded-full p-3">
                <RotateCcw className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Devoluciones</h3>
                <p className="text-gray-600 text-sm">
                  Devoluciones gratuitas en 14 días
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

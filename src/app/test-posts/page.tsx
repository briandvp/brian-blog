"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function TestPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/posts?status=published');
      const data = await response.json();
      console.log('Posts fetched:', data);
      setPosts(data.posts || []);
      setMessage(`Encontrados ${data.posts?.length || 0} posts`);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setMessage('Error al cargar posts');
    } finally {
      setLoading(false);
    }
  };

  const createTestPost = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Post de prueba ${new Date().toLocaleTimeString()}`,
          content: "Este es un post de prueba para verificar que la API funciona correctamente.",
          excerpt: "Post de prueba para verificar la API...",
          category: "Pruebas",
          status: "published"
        }),
      });

      const data = await response.json();
      console.log('Post created:', data);
      setMessage(`Post creado: ${data.post?.title || 'Error'}`);
      
      // Recargar posts después de crear uno nuevo
      setTimeout(fetchPosts, 1000);
    } catch (error) {
      console.error('Error creating post:', error);
      setMessage('Error al crear post');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Prueba de Posts API</h1>
      
      <div className="space-y-4 mb-6">
        <Button onClick={fetchPosts} disabled={loading}>
          {loading ? 'Cargando...' : 'Cargar Posts'}
        </Button>
        
        <Button onClick={createTestPost} disabled={loading} variant="outline">
          {loading ? 'Creando...' : 'Crear Post de Prueba'}
        </Button>
      </div>

      {message && (
        <div className="mb-4 p-4 bg-blue-100 border border-blue-300 rounded">
          {message}
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Posts encontrados ({posts.length}):</h2>
        {posts.map((post: any) => (
          <div key={post.id} className="p-4 border rounded-lg">
            <h3 className="font-semibold">{post.title}</h3>
            <p className="text-gray-600">{post.excerpt}</p>
            <div className="text-sm text-gray-500 mt-2">
              <span>Categoría: {post.category}</span> | 
              <span> Estado: {post.status}</span> | 
              <span> Creado: {new Date(post.createdAt).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

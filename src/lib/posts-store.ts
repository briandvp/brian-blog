// Store con persistencia en archivo JSON (temporal hasta resolver Prisma)
import fs from 'fs';
import path from 'path';

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  status: string;
  views: number;
  comments: number;
  author: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'posts.json');

// Asegurar que el directorio data existe
const ensureDataDir = () => {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Cargar posts desde archivo
const loadPosts = (): Post[] => {
  try {
    ensureDataDir();
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading posts:', error);
  }
  return [];
};

// Guardar posts en archivo
const savePosts = (posts: Post[]) => {
  try {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));
  } catch (error) {
    console.error('Error saving posts:', error);
  }
};

// Array de posts con persistencia
let posts: Post[] = loadPosts();

// Funciones para manejar los posts
export const getPosts = () => posts;

export const getPostById = (id: string) => {
  return posts.find(post => post.id === id);
};

export const addPost = (post: Post) => {
  posts.unshift(post);
  savePosts(posts);
  return post;
};

export const updatePost = (id: string, updates: Partial<Post>) => {
  const index = posts.findIndex(post => post.id === id);
  if (index !== -1) {
    posts[index] = { ...posts[index], ...updates, updatedAt: new Date().toISOString() };
    savePosts(posts);
    return posts[index];
  }
  return null;
};

export const deletePost = (id: string) => {
  const index = posts.findIndex(post => post.id === id);
  if (index !== -1) {
    const deletedPost = posts.splice(index, 1)[0];
    savePosts(posts);
    return deletedPost;
  }
  return null;
};

export const incrementViews = (id: string) => {
  const post = getPostById(id);
  if (post) {
    post.views = (post.views || 0) + 1;
    savePosts(posts);
    return post;
  }
  return null;
};
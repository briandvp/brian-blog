"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus, 
  Settings,
  BookOpen,
  ShoppingBag,
  Heart,
  Bell,
  Shield,
  LogOut
} from "lucide-react";

type AuthMode = 'login' | 'register' | 'profile';

export default function MiCuentaPage() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Estados para formularios
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [profileData, setProfileData] = useState({
    name: 'Usuario Ejemplo',
    email: 'usuario@ejemplo.com',
    bio: 'Apasionado del estoicismo y el desarrollo personal',
    newsletter: true,
    notifications: true
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular login exitoso
    setIsLoggedIn(true);
    setAuthMode('profile');
    alert('¡Inicio de sesión exitoso!');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    // Simular registro exitoso
    setIsLoggedIn(true);
    setAuthMode('profile');
    alert('¡Registro exitoso! Bienvenido/a');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthMode('login');
    alert('Sesión cerrada');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Perfil actualizado correctamente');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="mx-auto w-16 h-16 bg-[#42403e] rounded-full flex items-center justify-center mb-6">
                <User className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </h1>
              <p className="text-gray-600 mt-3">
                {authMode === 'login' 
                  ? 'Accede a tu cuenta para continuar' 
                  : 'Únete a nuestra comunidad estoica'
                }
              </p>
            </div>

            {/* Toggle entre Login y Register */}
            <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  authMode === 'login'
                    ? 'bg-white text-[#42403e] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LogIn className="h-4 w-4 inline mr-2" />
                Iniciar Sesión
              </button>
              <button
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  authMode === 'register'
                    ? 'bg-white text-[#42403e] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <UserPlus className="h-4 w-4 inline mr-2" />
                Registrarse
              </button>
            </div>

            {/* Formulario de Login */}
            {authMode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      id="login-email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="login-password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded" />
                    <span className="ml-2 text-sm text-gray-600">Recordarme</span>
                  </label>
                  <a href="#" className="text-sm text-[#D4AF37] hover:underline">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <Button type="submit" className="w-full bg-[#42403e] hover:bg-[#36312f] text-white">
                  <LogIn className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </Button>
              </form>
            )}

            {/* Formulario de Registro */}
            {authMode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      id="register-name"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                      placeholder="Tu nombre completo"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      id="register-email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="register-password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="register-confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="register-confirm-password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded" required />
                  <span className="ml-2 text-sm text-gray-600">
                    Acepto los <a href="#" className="text-[#D4AF37] hover:underline">términos y condiciones</a>
                  </span>
                </div>

                <Button type="submit" className="w-full bg-[#42403e] hover:bg-[#36312f] text-white">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Crear Cuenta
                </Button>
              </form>
            )}

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                {authMode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                <button
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="ml-1 text-[#D4AF37] hover:underline font-medium"
                >
                  {authMode === 'login' ? 'Regístrate aquí' : 'Inicia sesión aquí'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista del perfil cuando el usuario está logueado
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-[#42403e] rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profileData.name}</h1>
                <p className="text-gray-600">{profileData.email}</p>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Perfil */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Información del Perfil
              </h2>
              
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      id="profile-name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 mb-1">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      id="profile-email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="profile-bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Biografía
                  </label>
                  <textarea
                    id="profile-bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                    placeholder="Cuéntanos sobre ti..."
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">Preferencias</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profileData.newsletter}
                        onChange={(e) => setProfileData({...profileData, newsletter: e.target.checked})}
                        className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded"
                      />
                      <Mail className="h-4 w-4 ml-3 mr-2 text-gray-400" />
                      <span className="text-sm text-gray-700">Recibir newsletter con artículos y recursos</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profileData.notifications}
                        onChange={(e) => setProfileData({...profileData, notifications: e.target.checked})}
                        className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded"
                      />
                      <Bell className="h-4 w-4 ml-3 mr-2 text-gray-400" />
                      <span className="text-sm text-gray-700">Recibir notificaciones de nuevos contenidos</span>
                    </label>
                  </div>
                </div>

                <Button type="submit" className="bg-[#42403e] hover:bg-[#36312f] text-white">
                  <Settings className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Estadísticas */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Mi Actividad</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-[#D4AF37] mr-3" />
                    <span className="text-sm text-gray-600">Artículos leídos</span>
                  </div>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Heart className="h-5 w-5 text-red-500 mr-3" />
                    <span className="text-sm text-gray-600">Favoritos</span>
                  </div>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ShoppingBag className="h-5 w-5 text-[#42403e] mr-3" />
                    <span className="text-sm text-gray-600">Compras</span>
                  </div>
                  <span className="font-semibold">3</span>
                </div>
              </div>
            </div>

            {/* Acciones rápidas */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Mis Artículos Favoritos
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Historial de Compras
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Cambiar Contraseña
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

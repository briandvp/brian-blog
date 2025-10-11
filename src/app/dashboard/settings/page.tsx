"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Settings as SettingsIcon, 
  User, 
  Globe, 
  Bell, 
  Shield, 
  Palette,
  Save,
  Eye,
  EyeOff
} from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // General settings
    siteName: "brian-blog",
    siteDescription: "Un blog dedicado al estoicismo y la filosofía de vida",
    siteUrl: "https://blog-brianmep.com",
    authorName: "Brian",
    authorEmail: "brian@blog-brianmep.com",
    
    // Appearance settings
    theme: "light",
    primaryColor: "#42403e",
    fontFamily: "Inter",
    showSidebar: true,
    
    // SEO settings
    metaTitle: "brian-blog - Filosofía y Sabiduría Antigua",
    metaDescription: "Descubre la sabiduría del estoicismo y cómo aplicarla en tu vida moderna",
    enableComments: true,
    moderateComments: true,
    
    // Notification settings
    emailNotifications: true,
    commentNotifications: true,
    newPostNotifications: false,
    
    // Security settings
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // Aquí se implementaría la lógica para guardar la configuración
    console.log("Guardando configuración:", settings);
    alert("Configuración guardada exitosamente");
  };

  const tabs = [
    { id: "general", name: "General", icon: SettingsIcon },
    { id: "appearance", name: "Apariencia", icon: Palette },
    { id: "seo", name: "SEO", icon: Globe },
    { id: "notifications", name: "Notificaciones", icon: Bell },
    { id: "security", name: "Seguridad", icon: Shield },
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información del sitio</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del sitio
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => handleSettingChange("siteName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL del sitio
            </label>
            <input
              type="url"
              value={settings.siteUrl}
              onChange={(e) => handleSettingChange("siteUrl", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción del sitio
          </label>
          <textarea
            value={settings.siteDescription}
            onChange={(e) => handleSettingChange("siteDescription", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información del autor</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del autor
            </label>
            <input
              type="text"
              value={settings.authorName}
              onChange={(e) => handleSettingChange("authorName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email del autor
            </label>
            <input
              type="email"
              value={settings.authorEmail}
              onChange={(e) => handleSettingChange("authorEmail", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tema y colores</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tema
            </label>
            <select
              value={settings.theme}
              onChange={(e) => handleSettingChange("theme", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
            >
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
              <option value="auto">Automático</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color primario
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => handleSettingChange("primaryColor", e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings.primaryColor}
                onChange={(e) => handleSettingChange("primaryColor", e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tipografía</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Familia de fuentes
          </label>
          <select
            value={settings.fontFamily}
            onChange={(e) => handleSettingChange("fontFamily", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
          >
            <option value="Inter">Inter</option>
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Lato">Lato</option>
            <option value="Merriweather">Merriweather</option>
          </select>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Layout</h3>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showSidebar"
            checked={settings.showSidebar}
            onChange={(e) => handleSettingChange("showSidebar", e.target.checked)}
            className="h-4 w-4 text-[#42403e] focus:ring-[#42403e] border-gray-300 rounded"
          />
          <label htmlFor="showSidebar" className="text-sm font-medium text-gray-700">
            Mostrar barra lateral
          </label>
        </div>
      </div>
    </div>
  );

  const renderSEOSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Meta información</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título meta
            </label>
            <input
              type="text"
              value={settings.metaTitle}
              onChange={(e) => handleSettingChange("metaTitle", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              {settings.metaTitle.length}/60 caracteres
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción meta
            </label>
            <textarea
              value={settings.metaDescription}
              onChange={(e) => handleSettingChange("metaDescription", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              {settings.metaDescription.length}/160 caracteres
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Comentarios</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enableComments"
              checked={settings.enableComments}
              onChange={(e) => handleSettingChange("enableComments", e.target.checked)}
              className="h-4 w-4 text-[#42403e] focus:ring-[#42403e] border-gray-300 rounded"
            />
            <label htmlFor="enableComments" className="text-sm font-medium text-gray-700">
              Habilitar comentarios
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="moderateComments"
              checked={settings.moderateComments}
              onChange={(e) => handleSettingChange("moderateComments", e.target.checked)}
              className="h-4 w-4 text-[#42403e] focus:ring-[#42403e] border-gray-300 rounded"
            />
            <label htmlFor="moderateComments" className="text-sm font-medium text-gray-700">
              Moderar comentarios antes de publicar
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notificaciones por email</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="emailNotifications"
              checked={settings.emailNotifications}
              onChange={(e) => handleSettingChange("emailNotifications", e.target.checked)}
              className="h-4 w-4 text-[#42403e] focus:ring-[#42403e] border-gray-300 rounded"
            />
            <label htmlFor="emailNotifications" className="text-sm font-medium text-gray-700">
              Recibir notificaciones por email
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="commentNotifications"
              checked={settings.commentNotifications}
              onChange={(e) => handleSettingChange("commentNotifications", e.target.checked)}
              className="h-4 w-4 text-[#42403e] focus:ring-[#42403e] border-gray-300 rounded"
            />
            <label htmlFor="commentNotifications" className="text-sm font-medium text-gray-700">
              Notificar nuevos comentarios
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="newPostNotifications"
              checked={settings.newPostNotifications}
              onChange={(e) => handleSettingChange("newPostNotifications", e.target.checked)}
              className="h-4 w-4 text-[#42403e] focus:ring-[#42403e] border-gray-300 rounded"
            />
            <label htmlFor="newPostNotifications" className="text-sm font-medium text-gray-700">
              Notificar nuevas publicaciones
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Autenticación</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Autenticación de dos factores</h4>
              <p className="text-xs text-gray-500">Añade una capa extra de seguridad a tu cuenta</p>
            </div>
            <input
              type="checkbox"
              checked={settings.twoFactorAuth}
              onChange={(e) => handleSettingChange("twoFactorAuth", e.target.checked)}
              className="h-4 w-4 text-[#42403e] focus:ring-[#42403e] border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Alertas de inicio de sesión</h4>
              <p className="text-xs text-gray-500">Recibe notificaciones cuando alguien inicie sesión</p>
            </div>
            <input
              type="checkbox"
              checked={settings.loginAlerts}
              onChange={(e) => handleSettingChange("loginAlerts", e.target.checked)}
              className="h-4 w-4 text-[#42403e] focus:ring-[#42403e] border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sesión</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tiempo de expiración de sesión (minutos)
          </label>
          <select
            value={settings.sessionTimeout}
            onChange={(e) => handleSettingChange("sessionTimeout", parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
          >
            <option value={15}>15 minutos</option>
            <option value={30}>30 minutos</option>
            <option value={60}>1 hora</option>
            <option value={120}>2 horas</option>
            <option value={480}>8 horas</option>
          </select>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Cambiar contraseña</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña actual
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nueva contraseña
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar nueva contraseña
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return renderGeneralSettings();
      case "appearance":
        return renderAppearanceSettings();
      case "seo":
        return renderSEOSettings();
      case "notifications":
        return renderNotificationSettings();
      case "security":
        return renderSecuritySettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600 mt-2">Gestiona la configuración de tu blog</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-[#42403e] text-[#42403e]"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {renderTabContent()}
          </div>

          {/* Save Button */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <Button
              onClick={handleSave}
              className="bg-[#42403e] hover:bg-[#36312f] text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar cambios
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

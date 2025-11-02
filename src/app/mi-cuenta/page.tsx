"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { LanguageSelector } from "@/components/language-selector";
import { User, Mail, Globe, Shield, Bell, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function MiCuentaPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Si no hay usuario, redirigir
  if (!user) {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
    return null;
  }

  const handleSave = async () => {
    setIsSaving(true);
    // Aquí se implementaría la lógica para guardar la configuración
    setTimeout(() => {
      setIsSaving(false);
      alert(t('account.saved'));
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('account.title')}</h1>
          <p className="text-gray-600 mt-2">{t('account.subtitle')}</p>
        </div>

        {/* Información del usuario */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-[#42403e] rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user.name || user.email}</h2>
              <p className="text-gray-600">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-[#42403e]/10 text-[#42403e] text-sm rounded-full">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Configuración de idioma */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="h-5 w-5 text-[#42403e]" />
            <h2 className="text-xl font-semibold text-gray-900">{t('account.language.title')}</h2>
          </div>
          <p className="text-gray-600 mb-4">{t('account.language.description')}</p>
          <div className="border-t pt-4">
            <LanguageSelector variant="desktop" />
          </div>
        </div>

        {/* Información de cuenta */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="h-5 w-5 text-[#42403e]" />
            <h2 className="text-xl font-semibold text-gray-900">{t('account.info.title')}</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('account.info.name')}
              </label>
              <input
                type="text"
                value={user.name || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('account.info.email')}
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Botón guardar */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#42403e] hover:bg-[#36312f] text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? t('common.loading') : t('common.save')}
          </Button>
        </div>
      </div>
    </div>
  );
}


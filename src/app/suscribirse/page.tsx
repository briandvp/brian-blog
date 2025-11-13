"use client";

import { SubscribeForm } from "@/components/subscribe-form";
import { useLanguage } from "@/contexts/language-context";
import { Mail, CheckCircle, Star, Users } from "lucide-react";

export default function SuscribirsePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#42403e] rounded-full mb-6">
            <Mail className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('subscribe.page.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('subscribe.page.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Formulario de suscripción */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('subscribe.page.formTitle')}
            </h2>
            <SubscribeForm variant="default" />
            <p className="text-xs text-gray-500 mt-4 text-center">
              {t('subscribe.page.privacy')}
            </p>
          </div>

          {/* Beneficios */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {t('subscribe.page.benefitsTitle')}
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-[#42403e] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {t('subscribe.page.benefit1.title')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t('subscribe.page.benefit1.description')}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-[#42403e] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {t('subscribe.page.benefit2.title')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t('subscribe.page.benefit2.description')}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-[#42403e] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {t('subscribe.page.benefit3.title')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t('subscribe.page.benefit3.description')}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-[#42403e] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {t('subscribe.page.benefit4.title')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t('subscribe.page.benefit4.description')}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Estadísticas */}
            <div className="bg-gradient-to-br from-[#42403e] to-[#36312f] rounded-xl shadow-lg p-6 text-white">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-80" />
                  <p className="text-2xl font-bold">{t('subscribe.page.stats.subscribers')}</p>
                  <p className="text-sm opacity-80">{t('subscribe.page.stats.subscribersLabel')}</p>
                </div>
                <div className="text-center">
                  <Star className="h-8 w-8 mx-auto mb-2 opacity-80" />
                  <p className="text-2xl font-bold">{t('subscribe.page.stats.content')}</p>
                  <p className="text-sm opacity-80">{t('subscribe.page.stats.contentLabel')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-12 bg-gray-50 rounded-xl p-8 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
            {t('subscribe.page.faqTitle')}
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {t('subscribe.page.faq1.question')}
              </h4>
              <p className="text-sm text-gray-600">
                {t('subscribe.page.faq1.answer')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {t('subscribe.page.faq2.question')}
              </h4>
              <p className="text-sm text-gray-600">
                {t('subscribe.page.faq2.answer')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


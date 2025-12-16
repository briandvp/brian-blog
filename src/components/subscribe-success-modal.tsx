"use client";

import { CheckCircle2, Mail, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";

interface SubscribeSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email?: string;
}

export function SubscribeSuccessModal({
  open,
  onOpenChange,
  email,
}: SubscribeSuccessModalProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-2 border-[#42403e] shadow-2xl">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-[#42403e] rounded-full opacity-20 animate-ping"></div>
              <div className="relative bg-gradient-to-br from-[#42403e] to-[#36312f] rounded-full p-4 shadow-lg">
                <CheckCircle2 className="h-10 w-10 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-center text-gray-900 mb-2">
            {t('subscribe.modal.title')}
          </DialogTitle>
          <div className="text-center text-gray-600 pt-2 space-y-2 text-sm">
            {email && (
              <p className="mb-2 text-base">
                {t('subscribe.modal.emailSent')} <strong className="text-[#42403e]">{email}</strong>
              </p>
            )}
            <p className="text-base">{t('subscribe.modal.description')}</p>
          </div>
        </DialogHeader>
        <div className="mt-6 space-y-4">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 space-y-3 border border-gray-200">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <Mail className="h-5 w-5 text-[#42403e]" />
              <span>{t('subscribe.modal.whatNext')}</span>
            </div>
            <ul className="text-sm text-gray-700 space-y-2 ml-7 list-disc">
              <li className="leading-relaxed">{t('subscribe.modal.step1')}</li>
              <li className="leading-relaxed">{t('subscribe.modal.step2')}</li>
              <li className="leading-relaxed">{t('subscribe.modal.step3')}</li>
            </ul>
          </div>
          <Button
            onClick={() => onOpenChange(false)}
            size="lg"
            className="w-full bg-[#42403e] hover:bg-[#36312f] text-white font-semibold shadow-md hover:shadow-lg transition-all"
          >
            {t('subscribe.modal.closeButton')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

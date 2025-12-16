"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { SubscribeSuccessModal } from "@/components/subscribe-success-modal";

interface SubscribeFormProps {
  variant?: "default" | "inline" | "compact";
  className?: string;
}

export function SubscribeForm({ variant = "default", className = "" }: SubscribeFormProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error(t('subscribe.emailRequired'));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name: name || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscribedEmail(email);
        setEmail("");
        setName("");
        // Mostrar el modal después de un pequeño delay para mejor UX
        setTimeout(() => {
          setShowSuccessModal(true);
        }, 100);
        toast.success(data.message || t('subscribe.success'));
      } else {
        toast.error(data.error || t('subscribe.error'));
      }
    } catch (error) {
      console.error("Error al suscribirse:", error);
      toast.error(t('subscribe.error'));
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "inline") {
    return (
      <>
        <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <input
          type="email"
          placeholder={t('subscribe.emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
          required
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#42403e] hover:bg-[#36312f] text-white"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            t('subscribe.button')
          )}
        </Button>
      </form>
      <SubscribeSuccessModal
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        email={subscribedEmail}
      />
      </>
    );
  }

  if (variant === "compact") {
    return (
      <>
        <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
        <input
          type="email"
          placeholder={t('subscribe.emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
          required
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#42403e] hover:bg-[#36312f] text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {t('subscribe.submitting')}
            </>
          ) : (
            <>
              <Mail className="h-4 w-4 mr-2" />
              {t('subscribe.button')}
            </>
          )}
        </Button>
      </form>
      <SubscribeSuccessModal
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        email={subscribedEmail}
      />
      </>
    );
  }

  // Variant default
  return (
    <>
      <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="space-y-3">
        <input
          type="text"
          placeholder={t('subscribe.namePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
          disabled={isLoading}
        />
        <input
          type="email"
          placeholder={t('subscribe.emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#42403e] focus:border-transparent"
          required
          disabled={isLoading}
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        size="lg"
        className="w-full bg-[#42403e] hover:bg-[#36312f] text-white"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            {t('subscribe.submitting')}
          </>
        ) : (
          <>
            <Mail className="h-5 w-5 mr-2" />
            {t('subscribe.button')}
          </>
        )}
      </Button>
    </form>
    <SubscribeSuccessModal
      open={showSuccessModal}
      onOpenChange={setShowSuccessModal}
      email={subscribedEmail}
    />
    </>
  );
}


"use client";

import { Button } from "@/components/ui/button";
import { Plus, Settings, Package } from "lucide-react";

interface StoreAdminControlsProps {
  onAddProduct?: () => void;
  onManageProducts?: () => void;
  onManageSettings?: () => void;
}

export function StoreAdminControls({
  onAddProduct,
  onManageProducts,
  onManageSettings,
}: StoreAdminControlsProps) {
  return (
    <div className="mb-6 flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h2 className="text-sm font-medium text-gray-600 mr-auto">
        Panel de Administración
      </h2>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={onAddProduct}
      >
        <Plus className="h-4 w-4" />
        Nuevo Producto
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={onManageProducts}
      >
        <Package className="h-4 w-4" />
        Gestionar Productos
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={onManageSettings}
      >
        <Settings className="h-4 w-4" />
        Configuración
      </Button>
    </div>
  );
}
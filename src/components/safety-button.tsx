"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SafetyButtonProps {
  onPanic?: () => void;
  className?: string;
}

export function SafetyButton({ onPanic, className = "" }: SafetyButtonProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [emergencyActivated, setEmergencyActivated] = useState(false);

  const handleEmergencyExit = () => {
    setEmergencyActivated(true);
    
    // Clear any ongoing activities
    if (onPanic) {
      onPanic();
    }
    
    // Clear session data if needed
    try {
      localStorage.removeItem('scarborn_current_ritual');
      localStorage.removeItem('scarborn_session_state');
    } catch (error) {
      console.log('No session data to clear');
    }
    
    // Show confirmation and redirect to safety page
    setTimeout(() => {
      window.location.href = '/safety';
    }, 2000);
  };

  const handleSafeWordCheck = () => {
    setShowDialog(true);
  };

  if (emergencyActivated) {
    return (
      <div className={`fixed top-4 right-4 z-50 ${className}`}>
        <div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">
          ✅ Círculo roto. Redirigiendo a espacio seguro...
        </div>
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={handleSafeWordCheck}
        className={`fixed top-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg transition-all duration-200 hover:scale-105 ${className}`}
        size="sm"
      >
        🚨 Romper el círculo
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-gray-900 border-red-500/50 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-400 font-serif text-xl">
              🚨 Activación de Emergencia
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Estás activando el protocolo de seguridad. ¿Estás segura?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Card className="bg-red-900/20 border-red-500/30">
              <CardHeader>
                <CardTitle className="text-red-400 text-lg">
                  Protocolo de Emergencia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-gray-300">
                  Al activar este protocolo:
                </p>
                <ul className="space-y-1 text-gray-400">
                  <li>• Se detendrán todas las actividades</li>
                  <li>• Serás redirigida a un espacio seguro</li>
                  <li>• Se borrará la sesión actual</li>
                  <li>• Tendrás acceso a recursos de apoyo</li>
                </ul>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleEmergencyExit}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                🚨 SÍ, activar emergencia
              </Button>
              <Button
                onClick={() => setShowDialog(false)}
                variant="outline"
                className="border-gray-500 text-gray-300"
              >
                ❌ Cancelar
              </Button>
            </div>

            <div className="text-xs text-gray-500 text-center space-y-1">
              <p>💡 Si solo necesitas una pausa, cierra esta ventana</p>
              <p>🔒 Tu privacidad y seguridad son prioritarias</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function HomePage() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('scarborn_onboarding_complete');
    if (hasCompletedOnboarding) {
      // Redirect to dashboard if already onboarded
      window.location.href = '/dashboard';
    } else {
      setIsReady(true);
    }
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-8 h-8 bg-amber-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-black to-gray-900">
      {/* Background Mystical Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full space-y-8 text-center">
        {/* Temple Logo/Symbol */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-4 border-2 border-amber-500 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-amber-500 rounded-full animate-pulse"></div>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-amber-500 mb-2">
            Scarborn Temple
          </h1>
          <p className="text-gray-300 text-lg">
            El Umbral te espera
          </p>
        </div>

        {/* Welcome Card */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-amber-500">
              Bienvenida al Templo
            </CardTitle>
            <CardDescription className="text-gray-300 text-base leading-relaxed">
              Un espacio sagrado para mujeres que buscan poder, rendición y transformación. 
              Aquí encontrarás rituales guiados, meditaciones profundas y un camino hacia 
              tu verdadero ser.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Age Verification & Disclaimers */}
            <div className="text-sm text-gray-400 space-y-2">
              <p className="border-l-2 border-amber-500 pl-3">
                <strong className="text-amber-500">Importante:</strong> Debes ser mayor de 18 años para continuar.
              </p>
              <p className="border-l-2 border-gray-600 pl-3">
                <strong className="text-gray-300">Nota:</strong> Este espacio no sustituye terapia profesional. 
                Si necesitas ayuda inmediata, contacta servicios de emergencia.
              </p>
            </div>

            {/* Entry Button */}
            <Link href="/onboarding">
              <Button 
                size="lg" 
                className="w-full bg-amber-600 hover:bg-amber-700 text-black font-semibold py-4 text-lg transition-all duration-300 hover:scale-105"
              >
                Cruzar el Umbral
              </Button>
            </Link>

            {/* Safety Information */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>🛡️ Tu privacidad y seguridad son sagradas</p>
              <p>🚨 Botón de emergencia siempre disponible</p>
              <p>⚡ Controles de intensidad personalizables</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="flex justify-center space-x-6 text-sm text-gray-400">
          <Link href="/privacy" className="hover:text-amber-500 transition-colors">
            Privacidad
          </Link>
          <Link href="/terms" className="hover:text-amber-500 transition-colors">
            Términos
          </Link>
          <Link href="/safety" className="hover:text-amber-500 transition-colors">
            Seguridad
          </Link>
          <Link href="/support" className="hover:text-amber-500 transition-colors">
            Apoyo
          </Link>
        </div>
      </div>
    </div>
  );
}
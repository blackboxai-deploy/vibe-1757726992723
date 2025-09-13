"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface EmergencyContact {
  name: string;
  number: string;
  description: string;
}

const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    name: "Línea Nacional de Prevención del Suicidio",
    number: "988",
    description: "Disponible 24/7 para crisis emocionales"
  },
  {
    name: "Crisis Text Line",
    number: "Text HOME to 741741",
    description: "Apoyo por mensaje de texto 24/7"
  },
  {
    name: "SAMHSA National Helpline",
    number: "1-800-662-4357",
    description: "Salud mental y abuso de sustancias 24/7"
  }
];

const SAFETY_RESOURCES = [
  {
    title: "Técnica 5-4-3-2-1",
    description: "Para mantenerte presente y calmada",
    steps: [
      "5 cosas que puedes ver",
      "4 cosas que puedes tocar",
      "3 cosas que puedes escuchar",
      "2 cosas que puedes oler",
      "1 cosa que puedes saborear"
    ]
  },
  {
    title: "Respiración de Calma",
    description: "Para reducir la ansiedad inmediatamente",
    steps: [
      "Inhala por 4 segundos",
      "Mantén por 4 segundos",
      "Exhala por 6 segundos",
      "Repite hasta sentirte mejor"
    ]
  },
  {
    title: "Afirmaciones de Seguridad",
    description: "Recuérdatelo a ti misma",
    steps: [
      "Estoy segura ahora",
      "Tengo control de mis decisiones",
      "Puedo pedir ayuda cuando la necesite",
      "Mis límites son válidos e importantes"
    ]
  }
];

export default function SafetyPage() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [sessionCleared, setSessionCleared] = useState(false);

  useEffect(() => {
    // Clear any active session data
    try {
      localStorage.removeItem('scarborn_current_ritual');
      localStorage.removeItem('scarborn_session_state');
      setSessionCleared(true);
    } catch (error) {
      console.log('No active session to clear');
    }

    // Load user profile for safe word display
    try {
      const savedProfile = localStorage.getItem('scarborn_profile');
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.log('No profile found');
    }
  }, []);

  const handleReturnToApp = () => {
    window.location.href = '/dashboard';
  };

  const handleCompleteExit = () => {
    if (confirm('¿Estás segura de que quieres cerrar la sesión completamente?')) {
      // Clear all app data
      try {
        localStorage.removeItem('scarborn_profile');
        localStorage.removeItem('scarborn_onboarding_complete');
        localStorage.removeItem('scarborn_current_ritual');
        localStorage.removeItem('scarborn_session_state');
      } catch (error) {
        console.log('Error clearing data');
      }
      
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-green-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🛡️</span>
          </div>
          
          <h1 className="font-serif text-3xl text-green-400">
            Espacio Seguro
          </h1>
          
          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Estás en un lugar seguro. Respira. Toma el tiempo que necesites. 
            Aquí tienes recursos y opciones para continuar de la forma que te sientas cómoda.
          </p>

          {sessionCleared && (
            <Badge variant="outline" className="border-green-500 text-green-500">
              ✅ Sesión activa detenida de forma segura
            </Badge>
          )}
        </div>

        {/* User Info */}
        {userProfile && (
          <Card className="bg-gray-800/50 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400">Tu Información de Seguridad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-gray-300">
                  <strong>Tu nombre en el templo:</strong> {userProfile.alias}
                </p>
                {userProfile.limits?.safeWord && (
                  <p className="text-gray-300">
                    <strong>Tu palabra sagrada:</strong> 
                    <span className="text-amber-400 font-semibold ml-2">
                      "{userProfile.limits.safeWord}"
                    </span>
                  </p>
                )}
                <p className="text-gray-300">
                  <strong>Intensidad configurada:</strong> {userProfile.limits?.intensity || 3}/5
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Immediate Resources */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAFETY_RESOURCES.map((resource, index) => (
            <Card key={index} className="bg-gray-800/50 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400 text-lg">
                  {resource.title}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {resource.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {resource.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="text-gray-300 text-sm">
                      <span className="text-blue-400 font-semibold">{stepIndex + 1}.</span> {step}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="bg-gray-700" />

        {/* Emergency Contacts */}
        <Card className="bg-red-900/20 border-red-500/50">
          <CardHeader>
            <CardTitle className="text-red-400 font-serif text-xl">
              🚨 Contactos de Emergencia
            </CardTitle>
            <CardDescription className="text-gray-300">
              Si necesitas ayuda profesional inmediata, no dudes en contactar estos recursos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {EMERGENCY_CONTACTS.map((contact, index) => (
                <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-red-500/30">
                  <h4 className="font-semibold text-red-300 mb-2">{contact.name}</h4>
                  <p className="text-2xl font-bold text-white mb-2">{contact.number}</p>
                  <p className="text-sm text-gray-400">{contact.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-red-900/30 rounded-lg">
              <p className="text-red-200 text-sm">
                <strong>⚠️ Importante:</strong> Si tienes pensamientos de autolesión o suicidio, 
                por favor contacta servicios de emergencia locales (911 en EE.UU.) o ve al hospital más cercano.
              </p>
            </div>
          </CardContent>
        </Card>

        <Separator className="bg-gray-700" />

        {/* Next Steps */}
        <Card className="bg-gray-800/50 border-amber-500/30">
          <CardHeader>
            <CardTitle className="text-amber-400 font-serif">
              ¿Qué quieres hacer ahora?
            </CardTitle>
            <CardDescription className="text-gray-300">
              Tienes control total. Elige la opción que te haga sentir más cómoda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={handleReturnToApp}
                className="bg-amber-600 hover:bg-amber-700 text-black font-semibold py-6"
              >
                🏠 Volver al Dashboard
                <span className="block text-sm opacity-80">
                  Continuar de forma segura
                </span>
              </Button>
              
              <Button
                onClick={handleCompleteExit}
                variant="outline"
                className="border-gray-500 text-gray-300 hover:bg-gray-800 py-6"
              >
                🚪 Cerrar Sesión Completamente
                <span className="block text-sm opacity-80">
                  Borrar todos los datos
                </span>
              </Button>
            </div>

            <div className="mt-6 space-y-2">
              <p className="text-sm text-gray-400 text-center">
                También puedes explorar otras secciones:
              </p>
              <div className="flex justify-center space-x-4 text-sm">
                <Link href="/privacy" className="text-blue-400 hover:underline">
                  Política de Privacidad
                </Link>
                <Link href="/terms" className="text-blue-400 hover:underline">
                  Términos de Uso
                </Link>
                <Link href="/support" className="text-blue-400 hover:underline">
                  Soporte
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Padding */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}
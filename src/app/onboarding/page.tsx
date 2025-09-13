"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";

type OnboardingStep = 'welcome' | 'alias' | 'archetype' | 'limits' | 'micro-order' | 'complete';

interface UserProfile {
  alias: string;
  archetype: 'hambre' | 'control' | 'rendicion' | 'fuga' | '';
  limits: {
    intensity: number;
    safeWord: string;
    topics: string[];
  };
  oath: boolean;
}

const ARCHETYPE_QUESTIONS = [
  {
    id: 1,
    question: "Cuando enfrentas un desafío, tu primera reacción es:",
    options: {
      hambre: "Atacarlo directamente, consumirlo",
      control: "Planificar cada movimiento",
      rendicion: "Aceptar lo que viene y fluir",
      fuga: "Buscar una ruta alternativa"
    }
  },
  {
    id: 2,
    question: "En una situación de poder, prefieres:",
    options: {
      hambre: "Tomar todo lo que puedas",
      control: "Mantener las reglas claras",
      rendicion: "Entregarte completamente",
      fuga: "Mantener tu libertad intacta"
    }
  },
  {
    id: 3,
    question: "Tu mayor miedo secreto es:",
    options: {
      hambre: "Quedarte vacía, sin nada",
      control: "Perder el dominio de tu vida",
      rendicion: "No ser digna de entregarte",
      fuga: "Quedar atrapada sin escape"
    }
  }
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [profile, setProfile] = useState<UserProfile>({
    alias: '',
    archetype: '',
    limits: {
      intensity: 3,
      safeWord: '',
      topics: []
    },
    oath: false
  });
  const [archetypeAnswers, setArchetypeAnswers] = useState<Record<number, string>>({});
  const [microOrderComplete, setMicroOrderComplete] = useState(false);

  const stepIndex = {
    welcome: 0,
    alias: 1,
    archetype: 2,
    limits: 3,
    'micro-order': 4,
    complete: 5
  };

  const progress = ((stepIndex[currentStep] + 1) / 6) * 100;

  const calculateArchetype = () => {
    const scores = { hambre: 0, control: 0, rendicion: 0, fuga: 0 };
    Object.values(archetypeAnswers).forEach((answer: string) => {
      if (answer in scores) {
        scores[answer as keyof typeof scores]++;
      }
    });
    
    const maxScore = Math.max(...Object.values(scores));
    const dominantArchetype = Object.entries(scores).find(([_, score]) => score === maxScore);
    return dominantArchetype ? dominantArchetype[0] as UserProfile['archetype'] : 'hambre';
  };

  const saveProfile = async () => {
    try {
      const finalProfile = { ...profile, archetype: calculateArchetype() };
      localStorage.setItem('scarborn_profile', JSON.stringify(finalProfile));
      localStorage.setItem('scarborn_onboarding_complete', 'true');
      
      console.log("Perfil guardado. Bienvenida al Templo.");
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (error) {
      console.error("Error al guardar el perfil. Inténtalo de nuevo.");
    }
  };

  const renderWelcome = () => (
    <Card className="bg-gray-900/80 border-amber-500/30">
      <CardHeader className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 border-2 border-amber-500 rounded-full flex items-center justify-center">
          <div className="w-6 h-6 bg-amber-500 rounded-full animate-pulse"></div>
        </div>
        <CardTitle className="font-serif text-3xl text-amber-500">
          El Ritual del Umbral
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <p className="text-gray-300 leading-relaxed">
            Estás a punto de cruzar el umbral hacia un espacio sagrado. 
            Aquí, exploraremos las profundidades de tu poder, tu rendición y tu transformación.
          </p>
          
          <div className="bg-gray-800/50 p-4 rounded-lg text-sm text-gray-400">
            <p className="font-semibold text-amber-500 mb-2">Juramento del Umbral:</p>
            <p className="italic">
              "Entro en este espacio con respeto por mi seguridad y la de otras. 
              Acepto que estos rituales son herramientas de autoconocimiento, 
              no terapia. Me comprometo a usar mis límites y mi palabra sagrada 
              cuando lo necesite."
            </p>
          </div>

          <Button 
            onClick={() => setCurrentStep('alias')}
            className="w-full bg-amber-600 hover:bg-amber-700 text-black font-semibold"
          >
            Acepto el Juramento
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderAlias = () => (
    <Card className="bg-gray-900/80 border-amber-500/30">
      <CardHeader>
        <CardTitle className="font-serif text-2xl text-amber-500">
          Tu Nombre-Sello
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-gray-300">
          En este templo, tu identidad real permanece oculta. 
          Elige un nombre que represente quien deseas ser en este espacio sagrado.
        </p>
        
        <div className="space-y-2">
          <Label htmlFor="alias" className="text-gray-200">Nombre-Sello</Label>
          <Input
            id="alias"
            placeholder="Ej: Luna Rota, Fuego Quieto, Sombra Dorada..."
            value={profile.alias}
            onChange={(e) => setProfile(prev => ({ ...prev, alias: e.target.value }))}
            className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
            maxLength={30}
          />
          <p className="text-xs text-gray-400">
            Solo tú conocerás tu verdadero nombre. Aquí eres {profile.alias || 'tu alias'}.
          </p>
        </div>

        <Button 
          onClick={() => setCurrentStep('archetype')}
          disabled={!profile.alias.trim()}
          className="w-full bg-amber-600 hover:bg-amber-700 text-black font-semibold disabled:opacity-50"
        >
          Sellar mi Nombre
        </Button>
      </CardContent>
    </Card>
  );

  const renderArchetype = () => (
    <Card className="bg-gray-900/80 border-amber-500/30">
      <CardHeader>
        <CardTitle className="font-serif text-2xl text-amber-500">
          Descubre tu Arquetipo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-gray-300">
          Responde con honestidad. No hay respuestas correctas, solo tu verdad.
        </p>

        {ARCHETYPE_QUESTIONS.map((q) => (
          <div key={q.id} className="space-y-3">
            <p className="font-medium text-gray-200">{q.question}</p>
            <RadioGroup
              value={archetypeAnswers[q.id] || ''}
              onValueChange={(value) => 
                setArchetypeAnswers(prev => ({ ...prev, [q.id]: value }))
              }
            >
              {Object.entries(q.options).map(([key, option]) => (
                <div key={key} className="flex items-center space-x-2">
                  <RadioGroupItem value={key} id={`${q.id}-${key}`} />
                  <Label 
                    htmlFor={`${q.id}-${key}`} 
                    className="text-gray-300 cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}

        <Button 
          onClick={() => setCurrentStep('limits')}
          disabled={Object.keys(archetypeAnswers).length < ARCHETYPE_QUESTIONS.length}
          className="w-full bg-amber-600 hover:bg-amber-700 text-black font-semibold disabled:opacity-50"
        >
          Revelar mi Arquetipo
        </Button>
      </CardContent>
    </Card>
  );

  const renderLimits = () => (
    <Card className="bg-gray-900/80 border-amber-500/30">
      <CardHeader>
        <CardTitle className="font-serif text-2xl text-amber-500">
          Sello de Límites
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-gray-300">
          Tus límites son sagrados. Define tu espacio seguro.
        </p>

        <div className="space-y-4">
          <div>
            <Label className="text-gray-200 mb-2 block">
              Intensidad máxima (1-5): {profile.limits.intensity}
            </Label>
            <Slider
              value={[profile.limits.intensity]}
              onValueChange={(value) => 
                setProfile(prev => ({ 
                  ...prev, 
                  limits: { ...prev.limits, intensity: value[0] } 
                }))
              }
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Suave</span>
              <span>Intenso</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="safeword" className="text-gray-200">
              Palabra Sagrada (para parar inmediatamente)
            </Label>
            <Input
              id="safeword"
              placeholder="Una palabra que uses solo para esto"
              value={profile.limits.safeWord}
              onChange={(e) => 
                setProfile(prev => ({ 
                  ...prev, 
                  limits: { ...prev.limits, safeWord: e.target.value } 
                }))
              }
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
        </div>

        <Button 
          onClick={() => setCurrentStep('micro-order')}
          disabled={!profile.limits.safeWord.trim()}
          className="w-full bg-amber-600 hover:bg-amber-700 text-black font-semibold disabled:opacity-50"
        >
          Sellar mis Límites
        </Button>
      </CardContent>
    </Card>
  );

  const renderMicroOrder = () => (
    <Card className="bg-gray-900/80 border-amber-500/30">
      <CardHeader>
        <CardTitle className="font-serif text-2xl text-amber-500">
          Primera Orden
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-gray-300">
          Un pequeño ritual para crear el vínculo sagrado. Tómate 30 segundos.
        </p>

        <div className="bg-gray-800/50 p-4 rounded-lg">
          <p className="font-medium text-amber-400 mb-3">Tu primera orden:</p>
          <ol className="space-y-2 text-gray-300 text-sm">
            <li>1. Coloca tu mano derecha sobre tu corazón</li>
            <li>2. Respira profundo tres veces</li>
            <li>3. Di en voz baja: "Acepto mi poder"</li>
            <li>4. Mantén la mano ahí por 10 segundos</li>
            <li>5. Baja la mano cuando te sientas lista</li>
          </ol>
        </div>

        <div className="text-center">
          <Button 
            onClick={() => setMicroOrderComplete(true)}
            disabled={microOrderComplete}
            variant={microOrderComplete ? "secondary" : "default"}
            className="bg-amber-600 hover:bg-amber-700 text-black font-semibold disabled:bg-green-600"
          >
            {microOrderComplete ? "Orden Completada ✓" : "Completar Orden"}
          </Button>
        </div>

        {microOrderComplete && (
          <div className="text-center">
            <p className="text-amber-400 mb-4">
              Bien hecho. El vínculo está creado.
            </p>
            <Button 
              onClick={() => setCurrentStep('complete')}
              className="bg-amber-600 hover:bg-amber-700 text-black font-semibold"
            >
              Finalizar Ritual de Iniciación
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderComplete = () => (
    <Card className="bg-gray-900/80 border-amber-500/30">
      <CardHeader className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 border-2 border-amber-500 rounded-full flex items-center justify-center">
          <div className="w-8 h-8 bg-amber-500 rounded-full animate-pulse"></div>
        </div>
        <CardTitle className="font-serif text-3xl text-amber-500">
          El Umbral se Abre
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        <div className="space-y-4">
          <p className="text-gray-300 text-lg">
            Bienvenida al Templo, <span className="text-amber-500 font-semibold">{profile.alias}</span>
          </p>
          
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <p className="text-amber-400 font-medium mb-2">Tu arquetipo dominante:</p>
            <p className="text-2xl font-serif text-amber-500 capitalize">
              {calculateArchetype()}
            </p>
          </div>

          <p className="text-gray-400 text-sm">
            Tu perfil está guardado de forma segura. 
            Recuerda: tu palabra sagrada es "<span className="text-amber-500">{profile.limits.safeWord}</span>"
          </p>
        </div>

        <Button 
          onClick={saveProfile}
          className="w-full bg-amber-600 hover:bg-amber-700 text-black font-semibold py-4 text-lg"
        >
          Entrar al Templo
        </Button>
      </CardContent>
    </Card>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome': return renderWelcome();
      case 'alias': return renderAlias();
      case 'archetype': return renderArchetype();
      case 'limits': return renderLimits();
      case 'micro-order': return renderMicroOrder();
      case 'complete': return renderComplete();
      default: return renderWelcome();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-black to-gray-900">
      {/* Progress Bar */}
      <div className="w-full max-w-2xl mb-6">
        <Progress value={progress} className="h-2" />
        <p className="text-center text-sm text-gray-400 mt-2">
          Paso {stepIndex[currentStep] + 1} de 6
        </p>
      </div>

      {/* Background Mystical Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-amber-600/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        {renderStep()}
      </div>
    </div>
  );
}
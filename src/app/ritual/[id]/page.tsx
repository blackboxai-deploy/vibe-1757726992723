"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface RitualData {
  id: string;
  title: string;
  level: number;
  duration: number;
  intensity: number;
  type: 'breve' | 'profundo' | 'carta' | 'tarea' | 'diario' | 'prueba';
  description: string;
  instructions: string[];
  script: string;
  reflection: {
    prompts: string[];
    required: boolean;
  };
  aftercare: {
    title: string;
    instructions: string[];
  };
}

interface RitualState {
  phase: 'preparation' | 'execution' | 'reflection' | 'aftercare' | 'complete';
  startTime?: number;
  currentStep: number;
  emotionalState: number;
  notes: string;
  completed: boolean;
}

const RITUAL_DATABASE: Record<string, RitualData> = {
  "0-1": {
    id: "0-1",
    title: "Respiración Umbral",
    level: 0,
    duration: 3,
    intensity: 1,
    type: 'breve',
    description: "Un ejercicio suave de respiración consciente para conectar con el momento presente.",
    instructions: [
      "Encuentra un lugar cómodo donde puedas sentarte",
      "Asegúrate de no ser interrumpida por 5 minutos",
      "Ten agua cerca por si la necesitas",
      "Recuerda que puedes parar en cualquier momento"
    ],
    script: `Cierra los ojos suavemente, como si fueras a dormir.

Respira normalmente. No cambies nada todavía.

Ahora, lleva tu atención a tu respiración. Siente el aire entrando por tu nariz.

Inhala por 4 segundos... 1... 2... 3... 4...

Mantén por 2 segundos... 1... 2...

Exhala lentamente por 6 segundos... 1... 2... 3... 4... 5... 6...

Muy bien. Repite esto 5 veces más, a tu propio ritmo.

Cuando termines, abre los ojos lentamente y respira normalmente.

Has completado tu primera práctica en el templo.`,
    reflection: {
      prompts: [
        "¿Cómo se siente tu cuerpo ahora comparado con hace 5 minutos?",
        "¿Hubo algún momento en que tu mente se distrajo? ¿Con qué?",
        "En una escala del 1-5, ¿qué tan presente te sientes ahora?"
      ],
      required: false
    },
    aftercare: {
      title: "Integración Suave",
      instructions: [
        "Toma un sorbo de agua",
        "Mueve suavemente los dedos de manos y pies",
        "Date las gracias por este momento contigo misma",
        "Anota cualquier sensación o pensamiento si quieres"
      ]
    }
  },
  "0-2": {
    id: "0-2",
    title: "Primera Obediencia",
    level: 0,
    duration: 5,
    intensity: 2,
    type: 'profundo',
    description: "Un ejercicio de conexión con órdenes simples y seguras, estableciendo el patrón de atención y respuesta.",
    instructions: [
      "Asegúrate de tener privacidad completa",
      "Usa ropa cómoda que no restrinja movimiento",
      "Ten tu palabra sagrada presente en tu mente",
      "Recuerda: esto es para tu crecimiento, no para complacer a nadie más"
    ],
    script: `Ponte de pie en el centro de tu espacio.

Mira al frente. Respira tres veces profundamente.

ORDEN 1: Cierra los ojos y cuenta hasta 10 en voz baja.

Cuando termines, abre los ojos.

ORDEN 2: Levanta tu mano derecha sobre tu cabeza. Manténla ahí por 10 segundos.

Siente el peso de tu brazo, la tensión en tu hombro. Esto es consciencia corporal.

Baja tu brazo lentamente.

ORDEN 3: Camina hasta la pared más cercana. Tócala con tu palma izquierda.

Siente la textura, la temperatura. Mantén la palma ahí por 5 segundos.

ORDEN 4: Regresa al centro y siéntate en el suelo o en una silla.

ORDEN FINAL: Di en voz alta: "He completado mis órdenes conscientemente".

Has demostrado que puedes seguir instrucciones simples con plena atención.`,
    reflection: {
      prompts: [
        "¿Hubo alguna orden que te resultó difícil o incómoda?",
        "¿Cómo se sintió seguir instrucciones específicas?",
        "¿En algún momento sentiste resistencia? ¿A qué?",
        "¿Te sentiste segura durante todo el ejercicio?"
      ],
      required: true
    },
    aftercare: {
      title: "Regreso al Control",
      instructions: [
        "Estira tu cuerpo como te apetezca",
        "Respira libremente, sin patrones",
        "Recuerda: tú elegiste hacer esto",
        "Felicítate por completar el ejercicio",
        "Bebe agua y come algo si lo necesitas"
      ]
    }
  },
  "1-1": {
    id: "1-1",
    title: "Reconocer el Cuerpo",
    level: 1,
    duration: 4,
    intensity: 2,
    type: 'breve',
    description: "Escaneo corporal consciente para desarrollar conexión mente-cuerpo.",
    instructions: [
      "Usa ropa cómoda o quédate en ropa interior si te sientes segura",
      "Acuéstate en una superficie cómoda",
      "Ten una manta cerca por si sientes frío",
      "Este ejercicio es sobre consciencia, no sobre juzgar tu cuerpo"
    ],
    script: `Acuéstate cómodamente. Cierra los ojos.

Vamos a recorrer tu cuerpo con atención amorosa.

Comienza por tus pies. Siente tus dedos, las plantas, los talones.
¿Están fríos? ¿Calientes? ¿Tensos? Solo observa.

Sube a tus pantorrillas y muslos. 
Siente el peso de tus piernas sobre la superficie.

Tu pelvis y caderas. Esta es tu base, tu centro de poder.
Respira hacia esta zona. Siéntela expandirse.

Tu abdomen. Tu estómago. Tu pecho.
¿Cómo se mueven con tu respiración?

Tus brazos, desde los hombros hasta las puntas de los dedos.
¿Están relajados o tensos?

Tu cuello y tu cabeza. Tu rostro.
Relaja tu mandíbula, tus mejillas, tu frente.

Todo tu cuerpo existe. Todo tu cuerpo es tuyo.
Todo tu cuerpo merece atención y cuidado.

Respira profundo tres veces y abre los ojos.`,
    reflection: {
      prompts: [
        "¿Qué partes de tu cuerpo sintieron más tensión?",
        "¿Hubo alguna zona que fue difícil de 'sentir'?",
        "¿Cómo es tu relación actual con tu cuerpo?",
        "¿Qué necesita tu cuerpo ahora mismo?"
      ],
      required: false
    },
    aftercare: {
      title: "Honrar al Cuerpo",
      instructions: [
        "Muévete como tu cuerpo te pida",
        "Bebe agua lentamente",
        "Date un abrazo o tócate de manera cariñosa",
        "Agradece a tu cuerpo por existir y sostenerte"
      ]
    }
  }
};

export default function RitualPage() {
  const params = useParams();
  const ritualId = params.id as string;
  
  const [ritual, setRitual] = useState<RitualData | null>(null);
  const [state, setState] = useState<RitualState>({
    phase: 'preparation',
    currentStep: 0,
    emotionalState: 3,
    notes: '',
    completed: false
  });
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    // Load ritual data
    const ritualData = RITUAL_DATABASE[ritualId];
    if (ritualData) {
      setRitual(ritualData);
      
      // Check if already completed
      const completedRituals = JSON.parse(localStorage.getItem('scarborn_completed_rituals') || '[]');
      if (completedRituals.includes(ritualId)) {
        setState(prev => ({ ...prev, completed: true }));
      }
    }
  }, [ritualId]);

  useEffect(() => {
    // Timer for ritual execution
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (state.phase === 'execution' && state.startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - state.startTime!) / 1000);
        setTimeElapsed(elapsed);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.phase, state.startTime]);

  const startRitual = () => {
    setState(prev => ({
      ...prev,
      phase: 'execution',
      startTime: Date.now()
    }));
  };

  const completeExecution = () => {
    setState(prev => ({ ...prev, phase: 'reflection' }));
  };

  const completeReflection = () => {
    setState(prev => ({ ...prev, phase: 'aftercare' }));
  };

  const completeRitual = () => {
    // Save completion
    const completedRituals = JSON.parse(localStorage.getItem('scarborn_completed_rituals') || '[]');
    if (!completedRituals.includes(ritualId)) {
      completedRituals.push(ritualId);
      localStorage.setItem('scarborn_completed_rituals', JSON.stringify(completedRituals));
    }

    // Update progress
    const profile = JSON.parse(localStorage.getItem('scarborn_profile') || '{}');
    if (profile.progress) {
      profile.progress.ceniza = (profile.progress.ceniza || 0) + 10;
      profile.progress.completedRituals = completedRituals;
      localStorage.setItem('scarborn_profile', JSON.stringify(profile));
    }

    setState(prev => ({ ...prev, phase: 'complete', completed: true }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!ritual) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-300">Ritual no encontrado</p>
          <Link href="/dashboard">
            <Button className="mt-4">Volver al Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const renderPreparation = () => (
    <div className="space-y-6">
      <Card className="bg-gray-900/80 border-amber-500/50">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-serif text-2xl text-amber-500">
                {ritual.title}
              </CardTitle>
              <div className="flex space-x-2 mt-2">
                <Badge variant="outline" className="border-amber-500 text-amber-500">
                  Nivel {ritual.level}
                </Badge>
                <Badge variant="outline" className="border-blue-500 text-blue-500">
                  {ritual.duration} min
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`${
                    ritual.intensity <= 2 ? 'border-green-500 text-green-500' :
                    ritual.intensity <= 3 ? 'border-yellow-500 text-yellow-500' :
                    'border-red-500 text-red-500'
                  }`}
                >
                  Intensidad {ritual.intensity}/5
                </Badge>
              </div>
            </div>
            {state.completed && (
              <Badge className="bg-green-600">✓ Completado</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 leading-relaxed mb-6">
            {ritual.description}
          </p>

          <div className="space-y-4">
            <h4 className="font-semibold text-amber-400">Preparación:</h4>
            <ul className="space-y-2">
              {ritual.instructions.map((instruction, index) => (
                <li key={index} className="text-gray-300 text-sm flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  {instruction}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {ritual.intensity >= 3 && (
        <Card className="bg-red-900/20 border-red-500/50">
          <CardContent className="p-4">
            <p className="text-red-200 text-sm">
              <strong>⚠️ Intensidad {ritual.intensity}/5:</strong> Este ritual puede generar 
              emociones fuertes. Recuerda tu palabra sagrada "{
                JSON.parse(localStorage.getItem('scarborn_profile') || '{}').limits?.safeWord || '[palabra sagrada]'
              }" y el botón de emergencia.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex space-x-4">
        <Button
          onClick={startRitual}
          className="flex-1 bg-amber-600 hover:bg-amber-700 text-black font-semibold py-4"
        >
          🔥 Comenzar Ritual
        </Button>
        <Link href="/dashboard">
          <Button variant="outline" className="px-6 py-4">
            ← Volver
          </Button>
        </Link>
      </div>
    </div>
  );

  const renderExecution = () => (
    <div className="space-y-6">
      <Card className="bg-gray-900/80 border-amber-500">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="font-serif text-xl text-amber-500">
              Ejecutando: {ritual.title}
            </CardTitle>
            <Badge className="bg-amber-600 animate-pulse">
              En progreso
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-amber-500 mb-2">
              {formatTime(timeElapsed)}
            </div>
            <Progress 
              value={(timeElapsed / (ritual.duration * 60)) * 100} 
              className="h-2"
            />
            <p className="text-gray-400 text-sm mt-2">
              Duración estimada: {ritual.duration} minutos
            </p>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg mb-6">
            <div className="whitespace-pre-line text-gray-200 leading-relaxed text-center">
              {ritual.script}
            </div>
          </div>

          <div className="text-center">
            <Button
              onClick={completeExecution}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8"
            >
              ✓ He completado el ritual
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReflection = () => (
    <div className="space-y-6">
      <Card className="bg-gray-900/80 border-blue-500/50">
        <CardHeader>
          <CardTitle className="font-serif text-xl text-blue-400">
            Reflexión y Integración
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-300">
            Tómate un momento para reflexionar sobre la experiencia que acabas de vivir.
          </p>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-200 mb-2 block">
                ¿Cómo te sientes ahora? ({state.emotionalState}/5)
              </Label>
              <Slider
                value={[state.emotionalState]}
                onValueChange={(value) => 
                  setState(prev => ({ ...prev, emotionalState: value[0] }))
                }
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Agitada</span>
                <span>Neutral</span>
                <span>Muy bien</span>
              </div>
            </div>

            <div className="space-y-4">
              {ritual.reflection.prompts.map((prompt, index) => (
                <div key={index} className="space-y-2">
                  <Label className="text-gray-200">{prompt}</Label>
                  <Textarea
                    placeholder="Tu respuesta (opcional)..."
                    className="bg-gray-800 border-gray-600 text-white resize-none"
                    rows={3}
                  />
                </div>
              ))}
            </div>

            <div>
              <Label className="text-gray-200 mb-2 block">
                Notas adicionales (opcional)
              </Label>
              <Textarea
                value={state.notes}
                onChange={(e) => 
                  setState(prev => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Cualquier otra observación, sensación o pensamiento..."
                className="bg-gray-800 border-gray-600 text-white resize-none"
                rows={4}
              />
            </div>
          </div>

          <Button
            onClick={completeReflection}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            Continuar al Aftercare
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderAftercare = () => (
    <div className="space-y-6">
      <Card className="bg-gray-900/80 border-green-500/50">
        <CardHeader>
          <CardTitle className="font-serif text-xl text-green-400">
            {ritual.aftercare.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-300">
            Es importante cerrar la experiencia de forma segura y consciente.
          </p>

          <div className="bg-green-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-green-400 mb-3">
              Pasos para la integración:
            </h4>
            <ul className="space-y-2">
              {ritual.aftercare.instructions.map((instruction, index) => (
                <li key={index} className="text-gray-200 text-sm flex items-start">
                  <span className="text-green-400 mr-2">{index + 1}.</span>
                  {instruction}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center">
            <Button
              onClick={completeRitual}
              className="bg-amber-600 hover:bg-amber-700 text-black font-semibold px-8 py-4"
            >
              🎉 Finalizar y Guardar Progreso
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderComplete = () => (
    <div className="space-y-6 text-center">
      <Card className="bg-gray-900/80 border-amber-500">
        <CardContent className="p-8">
          <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✨</span>
          </div>
          
          <h2 className="font-serif text-2xl text-amber-500 mb-4">
            Ritual Completado
          </h2>
          
          <p className="text-gray-300 mb-6">
            Has completado "<strong>{ritual.title}</strong>" con éxito. 
            Tu progreso ha sido guardado.
          </p>

          <div className="flex justify-center space-x-4">
            <Link href="/dashboard">
              <Button className="bg-amber-600 hover:bg-amber-700 text-black font-semibold">
                🏠 Volver al Dashboard
              </Button>
            </Link>
            <Button
              onClick={() => setState(prev => ({ ...prev, phase: 'preparation' }))}
              variant="outline"
              className="border-amber-500 text-amber-500"
            >
              🔄 Repetir Ritual
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">{ritual.level}</span>
            </div>
            <h1 className="font-serif text-3xl text-amber-500">
              {ritual.title}
            </h1>
          </div>
          
          {/* Phase indicator */}
          <div className="flex space-x-2">
            {['preparation', 'execution', 'reflection', 'aftercare', 'complete'].map((phase, index) => (
              <div
                key={phase}
                className={`h-2 flex-1 rounded ${
                  state.phase === phase
                    ? 'bg-amber-500'
                    : index < ['preparation', 'execution', 'reflection', 'aftercare', 'complete'].indexOf(state.phase)
                      ? 'bg-green-500'
                      : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        {state.phase === 'preparation' && renderPreparation()}
        {state.phase === 'execution' && renderExecution()}
        {state.phase === 'reflection' && renderReflection()}
        {state.phase === 'aftercare' && renderAftercare()}
        {state.phase === 'complete' && renderComplete()}
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

interface UserProfile {
  alias: string;
  archetype: 'hambre' | 'control' | 'rendicion' | 'fuga';
  limits: {
    intensity: number;
    safeWord: string;
    topics: string[];
  };
  progress: {
    currentLevel: number;
    vigilia: number; // Daily streak
    ceniza: number; // Points
    completedRituals: string[];
  };
}

interface Level {
  id: number;
  title: string;
  description: string;
  unlocked: boolean;
  completed: boolean;
  rituals: Array<{
    id: string;
    title: string;
    duration: number;
    intensity: number;
    completed: boolean;
    type: 'breve' | 'profundo' | 'carta' | 'tarea' | 'diario' | 'prueba';
  }>;
}

const LEVELS_DATA: Omit<Level, 'unlocked' | 'completed'>[] = [
  {
    id: 0,
    title: "El Umbral",
    description: "Aprender a detenerse, respirar, obedecer algo pequeño",
    rituals: [
      { id: "0-1", title: "Respiración Umbral", duration: 3, intensity: 1, completed: false, type: 'breve' },
      { id: "0-2", title: "Primera Obediencia", duration: 5, intensity: 2, completed: false, type: 'profundo' }
    ]
  },
  {
    id: 1,
    title: "La Grieta",
    description: "Micro-rituales de consciencia corporal + diario guiado",
    rituals: [
      { id: "1-1", title: "Reconocer el Cuerpo", duration: 4, intensity: 2, completed: false, type: 'breve' },
      { id: "1-2", title: "Diario de Sensaciones", duration: 10, intensity: 2, completed: false, type: 'diario' },
      { id: "1-3", title: "Ritual de Presencia", duration: 8, intensity: 3, completed: false, type: 'profundo' }
    ]
  },
  {
    id: 2,
    title: "El Quiebre",
    description: "Tareas simbólicas que desafían orgullo y evitación",
    rituals: [
      { id: "2-1", title: "Desafío al Orgullo", duration: 6, intensity: 3, completed: false, type: 'tarea' },
      { id: "2-2", title: "Carta al Miedo", duration: 15, intensity: 4, completed: false, type: 'carta' },
      { id: "2-3", title: "Prueba del Quiebre", duration: 12, intensity: 4, completed: false, type: 'prueba' }
    ]
  },
  {
    id: 3,
    title: "La Rota",
    description: "Carta a la sombra + ritual de rendición psicológica segura",
    rituals: [
      { id: "3-1", title: "Enfrentar la Sombra", duration: 20, intensity: 4, completed: false, type: 'carta' },
      { id: "3-2", title: "Ritual de Rendición", duration: 18, intensity: 5, completed: false, type: 'profundo' },
      { id: "3-3", title: "Integración Profunda", duration: 25, intensity: 4, completed: false, type: 'diario' }
    ]
  },
  {
    id: 4,
    title: "Olvidar el Nombre",
    description: "Desidentificación temporal y creación del Sello",
    rituals: [
      { id: "4-1", title: "Ritual del Olvido", duration: 30, intensity: 5, completed: false, type: 'profundo' },
      { id: "4-2", title: "Forjar el Sello", duration: 15, intensity: 3, completed: false, type: 'tarea' },
      { id: "4-3", title: "Renacimiento", duration: 22, intensity: 4, completed: false, type: 'carta' }
    ]
  },
  {
    id: 5,
    title: "Reprogramación",
    description: "Pactos internos, hábitos de vigilancia, voto de claridad",
    rituals: [
      { id: "5-1", title: "Pacto Interior", duration: 25, intensity: 4, completed: false, type: 'carta' },
      { id: "5-2", title: "Vigilancia Sagrada", duration: 20, intensity: 3, completed: false, type: 'tarea' },
      { id: "5-3", title: "Voto de Claridad", duration: 35, intensity: 5, completed: false, type: 'prueba' }
    ]
  }
];

const ARCHETYPE_DESCRIPTIONS = {
  hambre: "El fuego que consume y transforma. Buscas intensidad y plenitud.",
  control: "La arquitecta del orden. Necesitas estructura y dominio.",
  rendicion: "El agua que fluye y se adapta. Encuentras poder en la entrega.",
  fuga: "El viento libre. Valoras la autonomía y los espacios abiertos."
};

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user profile
    const savedProfile = localStorage.getItem('scarborn_profile');
    const onboardingComplete = localStorage.getItem('scarborn_onboarding_complete');

    if (!savedProfile || !onboardingComplete) {
      window.location.href = '/onboarding';
      return;
    }

    try {
      const userProfile = JSON.parse(savedProfile);
      
      // Set default progress if not exists
      if (!userProfile.progress) {
        userProfile.progress = {
          currentLevel: 0,
          vigilia: 0,
          ceniza: 0,
          completedRituals: []
        };
      }

      setProfile(userProfile);

      // Initialize levels with user progress
      const initializedLevels = LEVELS_DATA.map(levelData => ({
        ...levelData,
        unlocked: levelData.id <= userProfile.progress.currentLevel,
        completed: levelData.rituals.every(ritual => 
          userProfile.progress.completedRituals.includes(ritual.id)
        ),
        rituals: levelData.rituals.map(ritual => ({
          ...ritual,
          completed: userProfile.progress.completedRituals.includes(ritual.id)
        }))
      }));

      setLevels(initializedLevels);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading profile:', error);
      window.location.href = '/onboarding';
    }
  }, []);

  const getLevelProgress = (level: Level) => {
    const completedCount = level.rituals.filter(r => r.completed).length;
    return (completedCount / level.rituals.length) * 100;
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-pulse">
          <div className="w-8 h-8 bg-amber-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="font-serif text-3xl text-amber-500 mb-2">
              Templo Scarborn
            </h1>
            <p className="text-gray-300">
              Bienvenida, <span className="text-amber-400 font-semibold">{profile.alias}</span>
            </p>
          </div>
          
          {/* Stats */}
          <div className="flex space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-500">{profile.progress.vigilia}</div>
              <div className="text-xs text-gray-400">Vigilia</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-500">{profile.progress.ceniza}</div>
              <div className="text-xs text-gray-400">Ceniza</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-500">{profile.progress.currentLevel}</div>
              <div className="text-xs text-gray-400">Nivel</div>
            </div>
          </div>
        </div>

        {/* Archetype Badge */}
        <div className="mb-6">
          <Badge variant="outline" className="border-amber-500 text-amber-500 font-serif text-lg px-4 py-1">
            Arquetipo: {profile.archetype.charAt(0).toUpperCase() + profile.archetype.slice(1)}
          </Badge>
          <p className="text-gray-400 text-sm mt-2">
            {ARCHETYPE_DESCRIPTIONS[profile.archetype]}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/altar">
            <Button variant="outline" className="w-full border-amber-500/50 hover:bg-amber-500/10">
              🎵 Altar de Audio
            </Button>
          </Link>
          <Link href="/grimorio">
            <Button variant="outline" className="w-full border-amber-500/50 hover:bg-amber-500/10">
              ⭐ Grimorio & Sigilos
            </Button>
          </Link>
          <Link href="/diario">
            <Button variant="outline" className="w-full border-amber-500/50 hover:bg-amber-500/10">
              📖 Diario de la Grieta
            </Button>
          </Link>
        </div>
      </div>

      {/* Camino del Fuego - Level Grid */}
      <div className="max-w-6xl mx-auto">
        <h2 className="font-serif text-2xl text-amber-500 mb-6 text-center">
          Camino del Fuego
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level) => (
            <Card 
              key={level.id}
              className={`bg-gray-900/80 border-2 transition-all duration-300 ${
                level.unlocked 
                  ? level.completed 
                    ? 'border-green-500/50 hover:border-green-500' 
                    : 'border-amber-500/50 hover:border-amber-500'
                  : 'border-gray-700/50 opacity-60'
              }`}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge 
                    variant={level.unlocked ? "default" : "secondary"}
                    className={level.unlocked ? "bg-amber-600" : ""}
                  >
                    Nivel {level.id}
                  </Badge>
                  {level.completed && (
                    <Badge variant="outline" className="border-green-500 text-green-500">
                      ✓ Completo
                    </Badge>
                  )}
                </div>
                <CardTitle className="font-serif text-xl text-amber-500">
                  {level.title}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {level.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {level.unlocked && (
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Progreso</span>
                        <span className="text-amber-500">{Math.round(getLevelProgress(level))}%</span>
                      </div>
                      <Progress value={getLevelProgress(level)} className="h-2" />
                    </div>

                    {/* Rituals */}
                    <div className="space-y-2">
                      {level.rituals.map((ritual) => (
                        <Link 
                          key={ritual.id}
                          href={`/ritual/${ritual.id}`}
                        >
                          <div className={`p-3 rounded-lg border transition-colors ${
                            ritual.completed
                              ? 'bg-green-900/30 border-green-500/50'
                              : 'bg-gray-800/50 border-gray-600/50 hover:border-amber-500/50'
                          }`}>
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-white">{ritual.title}</p>
                                <p className="text-xs text-gray-400">
                                  {ritual.duration} min • Intensidad {ritual.intensity}/5 • {ritual.type}
                                </p>
                              </div>
                              {ritual.completed && (
                                <div className="text-green-500 text-lg">✓</div>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {!level.unlocked && (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">
                      Completa el nivel anterior para desbloquear
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Daily Order Section */}
        <div className="mt-12">
          <Card className="bg-gray-900/80 border-amber-500/30">
            <CardHeader className="text-center">
              <CardTitle className="font-serif text-2xl text-amber-500">
                Orden del Día
              </CardTitle>
              <CardDescription className="text-gray-300">
                Un desafío de 3 minutos para mantener tu Vigilia
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/orden-diaria">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-black font-semibold">
                  Recibir la Orden de Hoy
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
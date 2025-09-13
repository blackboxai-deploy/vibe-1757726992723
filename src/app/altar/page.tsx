"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

interface AudioTrack {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  category: 'respiracion' | 'meditacion' | 'ritual' | 'aftercare' | 'emergencia';
  intensity: number; // 1-5
  premium: boolean;
  audioUrl?: string; // In real implementation, this would be actual audio files
  script?: string; // For text-based guidance
}

interface AudioPlayerState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  loop: boolean;
}

const AUDIO_LIBRARY: AudioTrack[] = [
  {
    id: "breath-basic",
    title: "Respiración Básica del Umbral",
    description: "Ejercicio fundamental de respiración 4-4-6 para calmar la mente",
    duration: 300, // 5 minutes
    category: 'respiracion',
    intensity: 1,
    premium: false,
    script: `Siéntate cómodamente con la espalda recta...

Vamos a respirar juntas con un ritmo suave y seguro.

Inhala por la nariz durante 4 segundos... 1... 2... 3... 4...

Mantén el aire durante 4 segundos... 1... 2... 3... 4...

Exhala lentamente por la boca durante 6 segundos... 1... 2... 3... 4... 5... 6...

Muy bien. Continuemos con este ritmo...

[Este patrón se repetirá durante 5 minutos]`
  },
  {
    id: "grounding-emergency",
    title: "Técnica 5-4-3-2-1 de Emergencia",
    description: "Para momentos de ansiedad alta o disociación. Úsala cuando necesites volver al presente",
    duration: 180, // 3 minutes
    category: 'emergencia',
    intensity: 1,
    premium: false,
    script: `Si estás escuchando esto, estás segura. Respira conmigo.

Vamos a hacer el ejercicio 5-4-3-2-1 para volver al presente.

Mira a tu alrededor y encuentra:

5 cosas que puedes VER... nombra cada una en voz alta o en tu mente:
1... 2... 3... 4... 5...

4 cosas que puedes TOCAR... tócalas si es seguro hacerlo:
1... 2... 3... 4...

3 cosas que puedes ESCUCHAR... incluye mi voz si quieres:
1... 2... 3...

2 cosas que puedes OLER... respira profundo:
1... 2...

1 cosa que puedes SABOREAR... puede ser tu propia saliva:
1...

Estás aquí. Estás presente. Estás segura.`
  },
  {
    id: "power-meditation",
    title: "Meditación del Poder Interior",
    description: "Conexión con tu fuerza personal y autoridad interna",
    duration: 600, // 10 minutes
    category: 'meditacion',
    intensity: 3,
    premium: true,
    script: `Cierra los ojos y respira profundamente tres veces...

Visualiza una llama dorada en el centro de tu pecho.

Esta llama es tu poder. Siempre ha estado ahí.

Con cada respiración, la llama crece más brillante...

Siente cómo el calor se extiende por todo tu cuerpo...

Tú tienes el poder de elegir.
Tú tienes el poder de decir no.
Tú tienes el poder de decir sí.

Repite conmigo: "Soy poderosa. Soy capaz. Soy suficiente."

[Continúa la meditación guiada...]`
  },
  {
    id: "surrender-ritual",
    title: "Ritual de Rendición Guiada",
    description: "Para momentos de entrega consciente y transformación profunda",
    duration: 900, // 15 minutes
    category: 'ritual',
    intensity: 4,
    premium: true,
    script: `Este es un espacio sagrado para la rendición consciente...

Rendirse no es debilidad. Es elegir soltar el control para encontrar una fuerza más profunda...

Respira y permite que tu cuerpo se relaje completamente...

¿Qué necesitas soltar hoy?
¿Qué peso cargas que no te pertenece?

Con cada exhalación, libera un poco más...

[Guía profunda de rendición y transformación...]`
  },
  {
    id: "aftercare-gentle",
    title: "Aftercare Suave",
    description: "Transición gentil de vuelta a la vida cotidiana",
    duration: 420, // 7 minutes
    category: 'aftercare',
    intensity: 1,
    premium: false,
    script: `Has hecho un trabajo valioso contigo misma...

Ahora es momento de regresar suavemente.

Siente tus pies en el suelo. Tus manos en tu regazo.

Eres la misma persona de siempre, pero has crecido.

Respira y date las gracias por este tiempo contigo misma...

Cuando estés lista, abre los ojos lentamente.

Recuerda: siempre puedes volver a este lugar interno.`
  },
  {
    id: "body-awareness",
    title: "Consciencia Corporal Profunda",
    description: "Conexión íntima con las sensaciones y energía del cuerpo",
    duration: 720, // 12 minutes
    category: 'meditacion',
    intensity: 3,
    premium: true,
    script: `Tu cuerpo es tu templo, tu hogar, tu sabiduría...

Vamos a explorarlo con respeto y curiosidad.

Comienza por la coronilla de tu cabeza...

Siente la vida que pulsa en cada célula...

[Escaneo corporal detallado y consciente...]`
  }
];

const CATEGORY_LABELS = {
  respiracion: "Respiración",
  meditacion: "Meditación",
  ritual: "Ritual",
  aftercare: "Aftercare",
  emergencia: "Emergencia"
};

const CATEGORY_COLORS = {
  respiracion: "border-blue-500 text-blue-500",
  meditacion: "border-purple-500 text-purple-500",
  ritual: "border-amber-500 text-amber-500",
  aftercare: "border-green-500 text-green-500",
  emergencia: "border-red-500 text-red-500"
};

export default function AltarPage() {
  const [playerState, setPlayerState] = useState<AudioPlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    volume: 70,
    loop: false
  });
  
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    // Load user profile for premium access
    try {
      const profile = JSON.parse(localStorage.getItem('scarborn_profile') || '{}');
      setUserProfile(profile);
    } catch (error) {
      console.log('No profile found');
    }
  }, []);

  useEffect(() => {
    // Audio timer simulation
    if (playerState.isPlaying && playerState.currentTrack) {
      timerRef.current = setInterval(() => {
        setPlayerState(prev => {
          const newTime = prev.currentTime + 1;
          
          if (newTime >= prev.currentTrack!.duration) {
            if (prev.loop) {
              return { ...prev, currentTime: 0 };
            } else {
              return { ...prev, isPlaying: false, currentTime: 0 };
            }
          }
          
          return { ...prev, currentTime: newTime };
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [playerState.isPlaying, playerState.currentTrack, playerState.loop]);

  const playTrack = (track: AudioTrack) => {
    if (track.premium && !userProfile?.premium) {
      alert('Este audio requiere suscripción premium. Visita la sección Tesoro para más información.');
      return;
    }

    setPlayerState({
      currentTrack: track,
      isPlaying: true,
      currentTime: 0,
      volume: playerState.volume,
      loop: playerState.loop
    });
  };

  const togglePlayPause = () => {
    setPlayerState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const stopTrack = () => {
    setPlayerState(prev => ({
      ...prev,
      isPlaying: false,
      currentTime: 0,
      currentTrack: null
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredTracks = AUDIO_LIBRARY.filter(track => {
    const matchesCategory = selectedCategory === "all" || track.category === selectedCategory;
    const matchesSearch = track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         track.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 2) return 'text-green-400';
    if (intensity <= 3) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-amber-500/20 border border-amber-500 rounded-full flex items-center justify-center">
            <span className="text-2xl">🎵</span>
          </div>
          <h1 className="font-serif text-4xl text-amber-500 mb-2">
            Altar de Audio
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Audios guiados para respiración, meditación, rituales y aftercare. 
            Encuentra el sonido que tu alma necesita.
          </p>
        </div>

        {/* Audio Player */}
        {playerState.currentTrack && (
          <Card className="mb-8 bg-gray-900/80 border-amber-500">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-amber-500 font-serif text-xl">
                    {playerState.currentTrack.title}
                  </CardTitle>
                  <CardDescription className="text-gray-300 mt-1">
                    {playerState.currentTrack.description}
                  </CardDescription>
                </div>
                <Button
                  onClick={stopTrack}
                  variant="outline"
                  size="sm"
                  className="border-red-500 text-red-500"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>{formatTime(playerState.currentTime)}</span>
                  <span>{formatTime(playerState.currentTrack.duration)}</span>
                </div>
                <Progress 
                  value={(playerState.currentTime / playerState.currentTrack.duration) * 100} 
                  className="h-2"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-4">
                <Button
                  onClick={togglePlayPause}
                  className="bg-amber-600 hover:bg-amber-700 text-black font-semibold"
                >
                  {playerState.isPlaying ? '⏸️ Pausar' : '▶️ Reproducir'}
                </Button>

                <Button
                  onClick={() => setPlayerState(prev => ({ ...prev, loop: !prev.loop }))}
                  variant="outline"
                  className={`${
                    playerState.loop 
                      ? 'border-amber-500 text-amber-500' 
                      : 'border-gray-500 text-gray-300'
                  }`}
                >
                  🔄 {playerState.loop ? 'Repetir: ON' : 'Repetir: OFF'}
                </Button>

                <div className="flex items-center space-x-2 flex-1">
                  <span className="text-gray-400 text-sm">🔊</span>
                  <Slider
                    value={[playerState.volume]}
                    onValueChange={(value) => 
                      setPlayerState(prev => ({ ...prev, volume: value[0] }))
                    }
                    max={100}
                    min={0}
                    step={1}
                    className="flex-1 max-w-32"
                  />
                  <span className="text-gray-400 text-sm w-8">{playerState.volume}</span>
                </div>
              </div>

              {/* Script Display */}
              {playerState.currentTrack.script && playerState.isPlaying && (
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-gray-300 text-sm italic leading-relaxed">
                    {playerState.currentTrack.script.split('\n')[0]}...
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    💡 El audio te guiará paso a paso
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4 items-center">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 bg-gray-800 border-gray-600">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              <SelectItem value="emergencia">🚨 Emergencia</SelectItem>
              <SelectItem value="respiracion">🫁 Respiración</SelectItem>
              <SelectItem value="meditacion">🧘‍♀️ Meditación</SelectItem>
              <SelectItem value="ritual">🔥 Ritual</SelectItem>
              <SelectItem value="aftercare">💚 Aftercare</SelectItem>
            </SelectContent>
          </Select>

          <input
            type="text"
            placeholder="Buscar audios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 max-w-sm px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400"
          />
        </div>

        {/* Emergency Section - Always Visible */}
        <div className="mb-8">
          <h3 className="font-serif text-xl text-red-400 mb-4 flex items-center">
            🚨 Audios de Emergencia
            <span className="text-sm font-normal text-gray-400 ml-2">
              - Siempre disponibles
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AUDIO_LIBRARY.filter(track => track.category === 'emergencia').map((track) => (
              <Card key={track.id} className="bg-red-900/20 border-red-500/50 hover:border-red-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-red-400 font-serif">
                        {track.title}
                      </CardTitle>
                      <CardDescription className="text-gray-300 mt-1">
                        {track.description}
                      </CardDescription>
                    </div>
                    <Badge className="bg-red-600 ml-2">
                      GRATIS
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                      {formatTime(track.duration)}
                    </div>
                    <Button
                      onClick={() => playTrack(track)}
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      ⚡ Usar Ahora
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Audio Library Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTracks.filter(track => track.category !== 'emergencia').map((track) => (
            <Card 
              key={track.id} 
              className={`bg-gray-900/80 border transition-all duration-300 hover:scale-105 ${
                track.premium ? 'border-amber-500/50' : 'border-gray-600/50'
              } hover:border-amber-500`}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge 
                    variant="outline" 
                    className={CATEGORY_COLORS[track.category]}
                  >
                    {CATEGORY_LABELS[track.category]}
                  </Badge>
                  {track.premium && (
                    <Badge className="bg-amber-600">
                      PREMIUM
                    </Badge>
                  )}
                </div>
                
                <CardTitle className="font-serif text-xl text-amber-500">
                  {track.title}
                </CardTitle>
                
                <CardDescription className="text-gray-300">
                  {track.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Duración:</span>
                    <span className="text-white">{formatTime(track.duration)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Intensidad:</span>
                    <span className={getIntensityColor(track.intensity)}>
                      {'★'.repeat(track.intensity)}{'☆'.repeat(5-track.intensity)} ({track.intensity}/5)
                    </span>
                  </div>

                  <Button
                    onClick={() => playTrack(track)}
                    className={`w-full font-semibold ${
                      track.premium && !userProfile?.premium
                        ? 'bg-gray-600 hover:bg-gray-700 text-gray-300'
                        : 'bg-amber-600 hover:bg-amber-700 text-black'
                    }`}
                    disabled={track.premium && !userProfile?.premium}
                  >
                    {track.premium && !userProfile?.premium 
                      ? '🔒 Requiere Premium' 
                      : '▶️ Reproducir'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTracks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-400">
              No se encontraron audios con los filtros seleccionados
            </p>
          </div>
        )}

        {/* Back to Dashboard */}
        <div className="mt-12 text-center">
          <Link href="/dashboard">
            <Button variant="outline" className="border-amber-500 text-amber-500">
              ← Volver al Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RitualCardProps {
  id: string;
  title: string;
  level: number;
  length: number; // in minutes
  intensity: number; // 1-5 scale
  type: 'breve' | 'profundo' | 'carta' | 'tarea' | 'diario' | 'prueba';
  state: 'locked' | 'ready' | 'in_progress' | 'done';
  description?: string;
  tags?: string[];
}

const getRitualTypeColor = (type: RitualCardProps['type']) => {
  const colors = {
    breve: 'bg-blue-600',
    profundo: 'bg-purple-600',
    carta: 'bg-amber-600',
    tarea: 'bg-green-600',
    diario: 'bg-orange-600',
    prueba: 'bg-red-600'
  };
  return colors[type];
};

const getRitualTypeLabel = (type: RitualCardProps['type']) => {
  const labels = {
    breve: 'Ritual Breve',
    profundo: 'Ritual Profundo',
    carta: 'Carta/Audio',
    tarea: 'Tarea',
    diario: 'Diario',
    prueba: 'Prueba'
  };
  return labels[type];
};

export function RitualCard({ 
  id, 
  title, 
  level, 
  length, 
  intensity, 
  type, 
  state, 
  description, 
  tags 
}: RitualCardProps) {
  const isLocked = state === 'locked';
  const isCompleted = state === 'done';
  const isInProgress = state === 'in_progress';

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 2) return 'text-green-400';
    if (intensity <= 3) return 'text-yellow-400';
    if (intensity <= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <Card 
      className={`transition-all duration-300 ${
        isLocked
          ? 'bg-gray-900/30 border-gray-700/50 opacity-60'
          : isCompleted
            ? 'bg-gray-900/80 border-green-500/50 hover:border-green-500'
            : isInProgress
              ? 'bg-gray-900/80 border-amber-500 animate-pulse'
              : 'bg-gray-900/80 border-gray-600/50 hover:border-amber-500/80 hover:scale-105'
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge 
            variant="secondary" 
            className={`${getRitualTypeColor(type)} text-white text-xs`}
          >
            {getRitualTypeLabel(type)}
          </Badge>
          
          <div className="flex space-x-2">
            {isCompleted && (
              <Badge variant="outline" className="border-green-500 text-green-500 text-xs">
                ✓
              </Badge>
            )}
            {isInProgress && (
              <Badge variant="outline" className="border-amber-500 text-amber-500 text-xs animate-pulse">
                En progreso
              </Badge>
            )}
          </div>
        </div>

        <CardTitle className="font-serif text-lg text-amber-500 leading-tight">
          {title}
        </CardTitle>
        
        {description && (
          <CardDescription className="text-gray-300 text-sm">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent>
        {/* Ritual Metadata */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Duración:</span>
            <span className="text-white">{length} min</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Intensidad:</span>
            <span className={getIntensityColor(intensity)}>
              {'★'.repeat(intensity)}{'☆'.repeat(5-intensity)} ({intensity}/5)
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Nivel:</span>
            <span className="text-amber-400">{level}</span>
          </div>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs border-gray-600 text-gray-400"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Action Button */}
        <div className="mt-4">
          {isLocked ? (
            <Button disabled className="w-full" variant="secondary">
              🔒 Bloqueado
            </Button>
          ) : isCompleted ? (
            <Link href={`/ritual/${id}`}>
              <Button variant="outline" className="w-full border-green-500/50 hover:bg-green-500/10">
                ⚡ Repetir Ritual
              </Button>
            </Link>
          ) : (
            <Link href={`/ritual/${id}`}>
              <Button 
                className="w-full bg-amber-600 hover:bg-amber-700 text-black font-semibold"
              >
                {isInProgress ? '▶️ Continuar' : '🔥 Comenzar Ritual'}
              </Button>
            </Link>
          )}
        </div>

        {/* Safety Reminder for High Intensity */}
        {!isLocked && intensity >= 4 && (
          <div className="mt-3 p-2 bg-red-900/20 border border-red-500/30 rounded text-xs text-red-200">
            ⚠️ Ritual de alta intensidad. Recuerda tu palabra sagrada y usa el botón de emergencia si lo necesitas.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
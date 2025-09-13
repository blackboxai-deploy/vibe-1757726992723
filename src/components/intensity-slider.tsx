"use client";

import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface IntensitySliderProps {
  value: number;
  onValueChange: (value: number) => void;
  labels?: string[];
  description?: string;
  className?: string;
  disabled?: boolean;
}

const DEFAULT_LABELS = [
  "Muy suave",
  "Suave", 
  "Moderado",
  "Intenso",
  "Muy intenso"
];

const INTENSITY_DESCRIPTIONS = [
  "Ejercicios muy ligeros y contemplativos",
  "Práticas suaves con autoexploración básica",
  "Ejercicios moderados que pueden generar algo de incomodidad",
  "Prácticas intensas que desafían límites personales",
  "Experiencias muy intensas que requieren preparación mental"
];

const getIntensityColor = (value: number) => {
  if (value <= 1) return 'text-green-400 bg-green-900/20 border-green-500/50';
  if (value <= 2) return 'text-blue-400 bg-blue-900/20 border-blue-500/50';
  if (value <= 3) return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/50';
  if (value <= 4) return 'text-orange-400 bg-orange-900/20 border-orange-500/50';
  return 'text-red-400 bg-red-900/20 border-red-500/50';
};

const getIntensityWarning = (value: number) => {
  if (value <= 2) return null;
  if (value === 3) return "⚠️ Intensidad moderada - asegúrate de estar cómoda";
  if (value === 4) return "🚨 Alta intensidad - recuerda tu palabra sagrada";
  return "⚡ Intensidad máxima - extrema precaución requerida";
};

export function IntensitySlider({ 
  value, 
  onValueChange, 
  labels = DEFAULT_LABELS,
  description,
  className = "",
  disabled = false
}: IntensitySliderProps) {
  const currentLabel = labels[value - 1] || labels[0];
  const currentDescription = INTENSITY_DESCRIPTIONS[value - 1] || INTENSITY_DESCRIPTIONS[0];
  const warning = getIntensityWarning(value);

  return (
    <Card className={`bg-gray-900/80 border-gray-600/50 ${className}`}>
      <CardHeader>
        <CardTitle className="text-amber-500 font-serif">
          Control de Intensidad
        </CardTitle>
        {description && (
          <CardDescription className="text-gray-300">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Value Display */}
        <div className="text-center">
          <div className="text-3xl font-bold text-amber-500 mb-2">
            {value}/5
          </div>
          <Badge 
            variant="outline" 
            className={`${getIntensityColor(value)} font-semibold px-3 py-1`}
          >
            {currentLabel}
          </Badge>
        </div>

        {/* Slider */}
        <div className="space-y-4">
          <Slider
            value={[value]}
            onValueChange={(values) => onValueChange(values[0])}
            max={5}
            min={1}
            step={1}
            disabled={disabled}
            className="w-full"
          />
          
          {/* Labels */}
          <div className="flex justify-between text-xs text-gray-400">
            {labels.map((_, index) => (
              <span 
                key={index}
                className={`text-center ${
                  index + 1 === value ? 'text-amber-500 font-semibold' : ''
                }`}
              >
                {index + 1}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-800/50 p-3 rounded-lg">
          <p className="text-sm text-gray-300 leading-relaxed">
            {currentDescription}
          </p>
        </div>

        {/* Warning */}
        {warning && (
          <div className={`p-3 rounded-lg border ${getIntensityColor(value)}`}>
            <p className="text-sm font-medium">
              {warning}
            </p>
          </div>
        )}

        {/* Safety Reminder */}
        <div className="bg-amber-900/20 border border-amber-500/30 p-3 rounded-lg">
          <div className="text-xs text-amber-200 space-y-1">
            <p className="font-semibold">🛡️ Recordatorios de Seguridad:</p>
            <ul className="space-y-1 text-amber-300/80">
              <li>• Puedes cambiar la intensidad en cualquier momento</li>
              <li>• Tu palabra sagrada detiene todo inmediatamente</li>
              <li>• El botón "Romper el círculo" siempre está disponible</li>
              <li>• Tu comodidad y seguridad son lo más importante</li>
            </ul>
          </div>
        </div>

        {/* Visual Intensity Indicators */}
        <div className="flex justify-center space-x-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`w-6 h-6 rounded-full transition-all duration-200 ${
                level <= value
                  ? level <= 2 ? 'bg-green-500' 
                    : level <= 3 ? 'bg-yellow-500'
                    : level <= 4 ? 'bg-orange-500' 
                    : 'bg-red-500'
                  : 'bg-gray-700'
              } ${
                level === value ? 'scale-125 ring-2 ring-amber-500' : ''
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
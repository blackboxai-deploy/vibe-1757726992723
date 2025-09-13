"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

interface Sigil {
  id: string;
  name: string;
  description: string;
  phrase: string;
  rarity: 'common' | 'rare' | 'lunar' | 'legendary';
  locked: boolean;
  dateUnlocked?: string;
  category: 'poder' | 'rendicion' | 'transformacion' | 'proteccion' | 'claridad';
  svg: string; // SVG path or simple geometric pattern
  unlockCondition?: string;
}

interface UserSigilCollection {
  owned: string[];
  favorites: string[];
  customSigils: Sigil[];
}

const SIGIL_COLLECTION: Sigil[] = [
  {
    id: "umbral-power",
    name: "Fuerza del Umbral",
    description: "Para conectar con tu poder interior en momentos de duda",
    phrase: "Acepto mi poder",
    rarity: 'common',
    locked: false,
    category: 'poder',
    svg: `<circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="3"/>
         <path d="M30 50 L70 50 M50 30 L50 70" stroke="currentColor" stroke-width="3"/>`,
    unlockCondition: "Completar el ritual de iniciación"
  },
  {
    id: "breath-harmony",
    name: "Armonía Respirante",
    description: "Sigilo para calmar la mente agitada y encontrar paz interior",
    phrase: "Respiro y me calmo",
    rarity: 'common',
    locked: true,
    category: 'claridad',
    svg: `<path d="M25 50 Q50 25 75 50 Q50 75 25 50" fill="none" stroke="currentColor" stroke-width="3"/>
         <circle cx="50" cy="50" r="8" fill="currentColor"/>`,
    unlockCondition: "Completar 3 ejercicios de respiración"
  },
  {
    id: "shadow-acceptance",
    name: "Abrazo de Sombra",
    description: "Para integrar aspectos rechazados de ti misma con compasión",
    phrase: "Acepto toda mi verdad",
    rarity: 'rare',
    locked: true,
    category: 'transformacion',
    svg: `<path d="M20 80 Q50 20 80 80" fill="none" stroke="currentColor" stroke-width="3"/>
         <path d="M20 80 Q50 80 80 80" fill="currentColor" opacity="0.3"/>
         <circle cx="35" cy="65" r="5" fill="currentColor"/>
         <circle cx="65" cy="65" r="5" fill="currentColor"/>`,
    unlockCondition: "Completar ritual de Nivel 3: La Rota"
  },
  {
    id: "surrender-flow",
    name: "Fluir en Rendición",
    description: "Para soltar el control y confiar en el proceso de la vida",
    phrase: "Me rindo y fluyo",
    rarity: 'rare',
    locked: true,
    category: 'rendicion',
    svg: `<path d="M10 30 Q30 10, 50 30 Q70 10, 90 30 Q70 50, 50 30 Q30 50, 10 30" 
         fill="none" stroke="currentColor" stroke-width="3"/>
         <path d="M50 30 L50 70" stroke="currentColor" stroke-width="2" stroke-dasharray="5,5"/>`,
    unlockCondition: "Completar ritual de entrega de Nivel 4"
  },
  {
    id: "lunar-wisdom",
    name: "Sabiduría Lunar",
    description: "Conecta con los ciclos naturales y la intuición profunda",
    phrase: "Sigo mi sabiduría interna",
    rarity: 'lunar',
    locked: true,
    category: 'claridad',
    svg: `<circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" stroke-width="2"/>
         <path d="M35 50 A15 15 0 0 1 65 50 A15 15 0 0 1 35 50" fill="currentColor"/>
         <circle cx="42" cy="40" r="2" fill="currentColor"/>
         <circle cx="58" cy="40" r="2" fill="currentColor"/>
         <circle cx="50" cy="60" r="2" fill="currentColor"/>`,
    unlockCondition: "Participar en un evento lunar especial"
  },
  {
    id: "protection-shield",
    name: "Escudo Sagrado",
    description: "Para establecer límites energéticos y protección personal",
    phrase: "Mis límites son sagrados",
    rarity: 'common',
    locked: true,
    category: 'proteccion',
    svg: `<path d="M50 10 L70 30 L70 60 L50 85 L30 60 L30 30 Z" 
         fill="none" stroke="currentColor" stroke-width="3"/>
         <path d="M40 45 L47 52 L60 35" stroke="currentColor" stroke-width="3" 
         fill="none" stroke-linecap="round"/>`,
    unlockCondition: "Configurar límites personales"
  },
  {
    id: "flame-transformation",
    name: "Llama Transformadora",
    description: "Para quemar lo que ya no sirve y renacer renovada",
    phrase: "Me transformo en fuego sagrado",
    rarity: 'legendary',
    locked: true,
    category: 'transformacion',
    svg: `<path d="M50 80 Q40 60, 45 40 Q35 30, 40 15 Q50 25, 55 15 Q65 30, 55 40 Q60 60, 50 80" 
         fill="currentColor" opacity="0.7"/>
         <path d="M50 70 Q45 55, 48 45 Q42 38, 45 28 Q50 33, 52 28 Q58 38, 52 45 Q55 55, 50 70" 
         fill="currentColor"/>
         <circle cx="50" cy="50" r="3" fill="white"/>`,
    unlockCondition: "Completar todos los niveles del Camino del Fuego"
  }
];

const RARITY_COLORS = {
  common: "border-gray-500 text-gray-300",
  rare: "border-blue-500 text-blue-400",
  lunar: "border-purple-500 text-purple-400",
  legendary: "border-amber-500 text-amber-400"
};

const RARITY_LABELS = {
  common: "Común",
  rare: "Raro",
  lunar: "Lunar",
  legendary: "Legendario"
};

const CATEGORY_LABELS = {
  poder: "Poder",
  rendicion: "Rendición", 
  transformacion: "Transformación",
  proteccion: "Protección",
  claridad: "Claridad"
};

const CATEGORY_COLORS = {
  poder: "bg-red-900/30 border-red-500/50",
  rendicion: "bg-blue-900/30 border-blue-500/50",
  transformacion: "bg-purple-900/30 border-purple-500/50",
  proteccion: "bg-green-900/30 border-green-500/50",
  claridad: "bg-yellow-900/30 border-yellow-500/50"
};

export default function GrimorioPage() {
  const [collection, setCollection] = useState<UserSigilCollection>({
    owned: ['umbral-power'], // User starts with first sigil
    favorites: [],
    customSigils: []
  });
  
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRarity, setSelectedRarity] = useState<string>("all");
  const [customSigilForm, setCustomSigilForm] = useState({
    phrase: '',
    name: '',
    description: '',
    category: 'poder' as Sigil['category']
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Load user collection
    try {
      const savedCollection = localStorage.getItem('scarborn_sigil_collection');
      if (savedCollection) {
        setCollection(JSON.parse(savedCollection));
      }
    } catch (error) {
      console.log('No collection found, using defaults');
    }
  }, []);

  const saveCollection = (newCollection: UserSigilCollection) => {
    setCollection(newCollection);
    localStorage.setItem('scarborn_sigil_collection', JSON.stringify(newCollection));
  };

  const toggleFavorite = (sigilId: string) => {
    const newCollection = {
      ...collection,
      favorites: collection.favorites.includes(sigilId)
        ? collection.favorites.filter(id => id !== sigilId)
        : [...collection.favorites, sigilId]
    };
    saveCollection(newCollection);
  };

  const generateCustomSigil = async () => {
    if (!customSigilForm.phrase.trim()) return;

    setIsGenerating(true);

    // Simulate AI sigil generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate simple geometric sigil based on phrase
    const generateSimpleSigil = (phrase: string) => {
      const hash = phrase.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      const patterns = [
        `<circle cx="50" cy="50" r="${20 + (hash % 15)}" fill="none" stroke="currentColor" stroke-width="3"/>`,
        `<rect x="${25 + (hash % 10)}" y="${25 + (hash % 10)}" width="${30 + (hash % 20)}" height="${30 + (hash % 20)}" fill="none" stroke="currentColor" stroke-width="3"/>`,
        `<path d="M${30 + (hash % 20)} 50 Q50 ${30 + (hash % 20)} ${70 + (hash % 10)} 50" fill="none" stroke="currentColor" stroke-width="3"/>`,
      ];
      return patterns[hash % patterns.length];
    };

    const newSigil: Sigil = {
      id: `custom-${Date.now()}`,
      name: customSigilForm.name || `Sigilo de "${customSigilForm.phrase}"`,
      description: customSigilForm.description || `Sigilo personalizado creado para la frase: "${customSigilForm.phrase}"`,
      phrase: customSigilForm.phrase,
      rarity: 'rare',
      locked: false,
      category: customSigilForm.category,
      svg: generateSimpleSigil(customSigilForm.phrase),
      dateUnlocked: new Date().toLocaleDateString()
    };

    const newCollection = {
      ...collection,
      customSigils: [...collection.customSigils, newSigil],
      owned: [...collection.owned, newSigil.id]
    };

    saveCollection(newCollection);
    setIsGenerating(false);

    // Reset form
    setCustomSigilForm({
      phrase: '',
      name: '',
      description: '',
      category: 'poder'
    });
  };

  const allSigils = [...SIGIL_COLLECTION, ...collection.customSigils];
  
  const filteredSigils = allSigils.filter(sigil => {
    const matchesCategory = selectedCategory === "all" || sigil.category === selectedCategory;
    const matchesRarity = selectedRarity === "all" || sigil.rarity === selectedRarity;
    const isOwned = collection.owned.includes(sigil.id);
    return matchesCategory && matchesRarity && isOwned;
  });

  const ownedCount = allSigils.filter(sigil => collection.owned.includes(sigil.id)).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/20 border border-purple-500 rounded-full flex items-center justify-center">
            <span className="text-2xl">⭐</span>
          </div>
          <h1 className="font-serif text-4xl text-amber-500 mb-2">
            Grimorio & Sigilos
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto mb-4">
            Tu colección personal de símbolos de poder. Cada sigilo porta la energía 
            de una intención específica para acompañarte en tu camino.
          </p>
          
          {/* Collection Stats */}
          <div className="flex justify-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-500">{ownedCount}</div>
              <div className="text-xs text-gray-400">Sigilos Poseídos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{collection.favorites.length}</div>
              <div className="text-xs text-gray-400">Favoritos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{collection.customSigils.length}</div>
              <div className="text-xs text-gray-400">Personalizados</div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="collection" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="collection" className="data-[state=active]:bg-amber-600">
              📚 Mi Colección
            </TabsTrigger>
            <TabsTrigger value="forge" className="data-[state=active]:bg-purple-600">
              ⚒️ Forja de Sigilos
            </TabsTrigger>
          </TabsList>

          {/* Collection Tab */}
          <TabsContent value="collection" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
              >
                <option value="all">Todas las categorías</option>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>

              <select
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
              >
                <option value="all">Todas las rarezas</option>
                {Object.entries(RARITY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedRarity("all");
                }}
                className="border-gray-500 text-gray-300"
              >
                Limpiar filtros
              </Button>
            </div>

            {/* Sigil Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSigils.map((sigil) => (
                <Card 
                  key={sigil.id}
                  className={`${CATEGORY_COLORS[sigil.category]} transition-all duration-300 hover:scale-105`}
                >
                  <CardHeader className="text-center">
                    <div className="flex justify-between items-start mb-2">
                      <Badge 
                        variant="outline" 
                        className={RARITY_COLORS[sigil.rarity]}
                      >
                        {RARITY_LABELS[sigil.rarity]}
                      </Badge>
                      <Button
                        onClick={() => toggleFavorite(sigil.id)}
                        variant="ghost"
                        size="sm"
                        className={`p-1 ${
                          collection.favorites.includes(sigil.id)
                            ? 'text-yellow-400'
                            : 'text-gray-400'
                        }`}
                      >
                        ⭐
                      </Button>
                    </div>

                    {/* Sigil Symbol */}
                    <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                      <svg 
                        width="96" 
                        height="96" 
                        viewBox="0 0 100 100" 
                        className="text-amber-500"
                        dangerouslySetInnerHTML={{ __html: sigil.svg }}
                      />
                    </div>

                    <CardTitle className="font-serif text-lg text-amber-500">
                      {sigil.name}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <CardDescription className="text-gray-300 text-sm mb-3">
                      {sigil.description}
                    </CardDescription>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Frase:</span>
                        <span className="text-amber-400 italic">"{sigil.phrase}"</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-400">Categoría:</span>
                        <span className="text-white">{CATEGORY_LABELS[sigil.category]}</span>
                      </div>

                      {sigil.dateUnlocked && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Desbloqueado:</span>
                          <span className="text-green-400">{sigil.dateUnlocked}</span>
                        </div>
                      )}
                    </div>

                    <Button 
                      className="w-full mt-4 text-xs"
                      variant="outline"
                      onClick={() => {
                        // Copy phrase to clipboard
                        navigator.clipboard?.writeText(sigil.phrase);
                      }}
                    >
                      📋 Copiar Frase
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredSigils.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔮</div>
                <p className="text-gray-400">
                  No tienes sigilos que coincidan con los filtros seleccionados
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Completa más rituales para desbloquear nuevos sigilos
                </p>
              </div>
            )}
          </TabsContent>

          {/* Forge Tab */}
          <TabsContent value="forge" className="space-y-6">
            <Card className="bg-purple-900/20 border-purple-500/50">
              <CardHeader>
                <CardTitle className="font-serif text-2xl text-purple-400">
                  ⚒️ Forja de Sigilos Personalizados
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Crea un sigilo único basado en tu intención personal. 
                  La IA transformará tu frase en un símbolo geométrico sagrado.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="phrase" className="text-purple-300">
                      Frase de Poder (requerida)
                    </Label>
                    <Input
                      id="phrase"
                      value={customSigilForm.phrase}
                      onChange={(e) => setCustomSigilForm(prev => ({ 
                        ...prev, 
                        phrase: e.target.value 
                      }))}
                      placeholder="Ej: Soy libre de elegir mi camino"
                      className="bg-gray-800 border-purple-500/50 text-white"
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Escribe una afirmación positiva en presente que represente tu intención
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="name" className="text-purple-300">
                      Nombre del Sigilo (opcional)
                    </Label>
                    <Input
                      id="name"
                      value={customSigilForm.name}
                      onChange={(e) => setCustomSigilForm(prev => ({ 
                        ...prev, 
                        name: e.target.value 
                      }))}
                      placeholder="Ej: Libertad de Elección"
                      className="bg-gray-800 border-purple-500/50 text-white"
                      maxLength={50}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-purple-300">
                      Descripción (opcional)
                    </Label>
                    <Textarea
                      id="description"
                      value={customSigilForm.description}
                      onChange={(e) => setCustomSigilForm(prev => ({ 
                        ...prev, 
                        description: e.target.value 
                      }))}
                      placeholder="¿Para qué situaciones usarías este sigilo?"
                      className="bg-gray-800 border-purple-500/50 text-white resize-none"
                      rows={3}
                      maxLength={200}
                    />
                  </div>

                  <div>
                    <Label className="text-purple-300">Categoría</Label>
                    <select
                      value={customSigilForm.category}
                      onChange={(e) => setCustomSigilForm(prev => ({ 
                        ...prev, 
                        category: e.target.value as Sigil['category']
                      }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-purple-500/50 rounded-lg text-white"
                    >
                      {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button
                  onClick={generateCustomSigil}
                  disabled={!customSigilForm.phrase.trim() || isGenerating}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4"
                >
                  {isGenerating ? (
                    <>
                      <span className="animate-spin mr-2">⚡</span>
                      Forjando Sigilo...
                    </>
                  ) : (
                    '✨ Forjar Sigilo Personalizado'
                  )}
                </Button>

                {isGenerating && (
                  <div className="text-center text-purple-300 text-sm">
                    <p>La IA está transformando tu intención en forma geométrica...</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Esto puede tomar unos momentos
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Custom Sigils Preview */}
            {collection.customSigils.length > 0 && (
              <div>
                <h3 className="font-serif text-xl text-purple-400 mb-4">
                  Tus Sigilos Personalizados
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {collection.customSigils.map((sigil) => (
                    <Card key={sigil.id} className="bg-purple-900/20 border-purple-500/50">
                      <CardContent className="p-4 text-center">
                        <div className="w-16 h-16 mx-auto mb-2">
                          <svg 
                            width="64" 
                            height="64" 
                            viewBox="0 0 100 100" 
                            className="text-purple-400"
                            dangerouslySetInnerHTML={{ __html: sigil.svg }}
                          />
                        </div>
                        <h4 className="font-semibold text-purple-300">{sigil.name}</h4>
                        <p className="text-xs text-gray-400 italic">"{sigil.phrase}"</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

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
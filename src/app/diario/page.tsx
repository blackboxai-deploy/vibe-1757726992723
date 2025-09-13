"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: number; // 1-5 scale
  ritualId?: string;
  prompts?: {
    question: string;
    answer: string;
  }[];
  private: boolean;
  tags: string[];
}

interface JournalPrompt {
  id: string;
  category: 'poder' | 'rendicion' | 'transformacion' | 'reflexion';
  question: string;
  description: string;
  level: number;
}

const JOURNAL_PROMPTS: JournalPrompt[] = [
  {
    id: "power-1",
    category: 'poder',
    question: "¿En qué momento de hoy sentiste tu poder personal?",
    description: "Reflexiona sobre situaciones donde ejerciste tu autoridad interna",
    level: 0
  },
  {
    id: "power-2", 
    category: 'poder',
    question: "¿Qué le dirías a tu yo de hace un año sobre tu poder?",
    description: "Conecta con el crecimiento de tu fuerza personal",
    level: 1
  },
  {
    id: "surrender-1",
    category: 'rendicion',
    question: "¿Qué necesitas soltar para sentirte más libre?",
    description: "Explora qué pesos emocionales o mentales cargas innecesariamente",
    level: 1
  },
  {
    id: "surrender-2",
    category: 'rendicion',
    question: "¿Cómo sería tu vida si no necesitaras controlar todo?",
    description: "Imagina la libertad de la rendición consciente",
    level: 2
  },
  {
    id: "transformation-1",
    category: 'transformacion',
    question: "¿Qué parte de ti está pidiendo cambiar?",
    description: "Escucha las señales internas de transformación",
    level: 2
  },
  {
    id: "transformation-2",
    category: 'transformacion',
    question: "Si fueras tu propia mentora, ¿qué consejo te darías hoy?",
    description: "Accede a tu sabiduría interior",
    level: 3
  },
  {
    id: "reflection-1",
    category: 'reflexion',
    question: "¿Cómo has crecido desde que comenzaste este camino?",
    description: "Celebra tu evolución personal",
    level: 1
  },
  {
    id: "reflection-2",
    category: 'reflexion',
    question: "¿Qué aspectos de ti misma has comenzado a aceptar?",
    description: "Reconoce tu trabajo de auto-aceptación",
    level: 2
  }
];

const CATEGORY_COLORS = {
  poder: "bg-red-900/30 border-red-500/50",
  rendicion: "bg-blue-900/30 border-blue-500/50",
  transformacion: "bg-purple-900/30 border-purple-500/50",
  reflexion: "bg-green-900/30 border-green-500/50"
};

const CATEGORY_LABELS = {
  poder: "Poder",
  rendicion: "Rendición",
  transformacion: "Transformación",
  reflexion: "Reflexión"
};

export default function DiarioPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>({
    title: '',
    content: '',
    mood: 3,
    private: true,
    tags: [],
    prompts: []
  });

  const [newTag, setNewTag] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userLevel, setUserLevel] = useState(0);

  useEffect(() => {
    // Load entries from localStorage
    try {
      const savedEntries = localStorage.getItem('scarborn_journal_entries');
      if (savedEntries) {
        setEntries(JSON.parse(savedEntries));
      }

      // Get user level from profile
      const profile = JSON.parse(localStorage.getItem('scarborn_profile') || '{}');
      setUserLevel(profile.progress?.currentLevel || 0);
    } catch (error) {
      console.log('Error loading journal entries');
    }
  }, []);

  const saveEntries = (newEntries: JournalEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem('scarborn_journal_entries', JSON.stringify(newEntries));
  };

  const saveCurrentEntry = () => {
    if (!currentEntry.content?.trim()) return;

    const entry: JournalEntry = {
      id: `entry-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      title: currentEntry.title || `Entrada del ${new Date().toLocaleDateString()}`,
      content: currentEntry.content,
      mood: currentEntry.mood || 3,
      prompts: currentEntry.prompts || [],
      private: currentEntry.private ?? true,
      tags: currentEntry.tags || []
    };

    const newEntries = [entry, ...entries];
    saveEntries(newEntries);

    // Reset form
    setCurrentEntry({
      title: '',
      content: '',
      mood: 3,
      private: true,
      tags: [],
      prompts: []
    });
  };

  const deleteEntry = (entryId: string) => {
    if (confirm('¿Estás segura de que quieres eliminar esta entrada? Esta acción no se puede deshacer.')) {
      const newEntries = entries.filter(entry => entry.id !== entryId);
      saveEntries(newEntries);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !currentEntry.tags?.includes(newTag.trim())) {
      setCurrentEntry(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const selectPrompt = (prompt: JournalPrompt) => {
    setCurrentEntry(prev => ({
      ...prev,
      prompts: [
        ...(prev.prompts || []),
        { question: prompt.question, answer: '' }
      ]
    }));
  };

  const updatePromptAnswer = (question: string, answer: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      prompts: prev.prompts?.map(p => 
        p.question === question ? { ...p, answer } : p
      ) || []
    }));
  };

  const availablePrompts = JOURNAL_PROMPTS.filter(prompt => prompt.level <= userLevel);
  
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = !searchTerm || 
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
      entry.prompts?.some(p => p.question.includes(selectedCategory));
    
    return matchesSearch && matchesCategory;
  });

  const getMoodEmoji = (mood: number) => {
    const emojis = ['😔', '😕', '😐', '😊', '🌟'];
    return emojis[mood - 1] || '😐';
  };

  const getMoodLabel = (mood: number) => {
    const labels = ['Muy bajo', 'Bajo', 'Neutral', 'Bien', 'Excelente'];
    return labels[mood - 1] || 'Neutral';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-500/20 border border-orange-500 rounded-full flex items-center justify-center">
            <span className="text-2xl">📖</span>
          </div>
          <h1 className="font-serif text-4xl text-amber-500 mb-2">
            Diario de la Grieta
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Un espacio sagrado para tus reflexiones más íntimas. 
            Aquí puedes explorar tus pensamientos, emociones y transformaciones de forma privada.
          </p>
        </div>

        <Tabs defaultValue="write" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="write" className="data-[state=active]:bg-orange-600">
              ✍️ Escribir
            </TabsTrigger>
            <TabsTrigger value="entries" className="data-[state=active]:bg-amber-600">
              📚 Mis Entradas
            </TabsTrigger>
            <TabsTrigger value="prompts" className="data-[state=active]:bg-purple-600">
              🔮 Prompts
            </TabsTrigger>
          </TabsList>

          {/* Write Tab */}
          <TabsContent value="write" className="space-y-6">
            <Card className="bg-gray-900/80 border-orange-500/50">
              <CardHeader>
                <CardTitle className="font-serif text-2xl text-orange-400">
                  Nueva Entrada
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Escribe libremente o usa una pregunta guía para explorar tus pensamientos
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-orange-300">
                    Título (opcional)
                  </Label>
                  <Input
                    id="title"
                    value={currentEntry.title || ''}
                    onChange={(e) => setCurrentEntry(prev => ({ 
                      ...prev, 
                      title: e.target.value 
                    }))}
                    placeholder={`Entrada del ${new Date().toLocaleDateString()}`}
                    className="bg-gray-800 border-orange-500/50 text-white"
                  />
                </div>

                {/* Mood Selector */}
                <div>
                  <Label className="text-orange-300 mb-2 block">
                    ¿Cómo te sientes ahora? {getMoodEmoji(currentEntry.mood || 3)} {getMoodLabel(currentEntry.mood || 3)}
                  </Label>
                  <Slider
                    value={[currentEntry.mood || 3]}
                    onValueChange={(value) => 
                      setCurrentEntry(prev => ({ ...prev, mood: value[0] }))
                    }
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>😔 Muy bajo</span>
                    <span>😊 Bien</span>
                    <span>🌟 Excelente</span>
                  </div>
                </div>

                {/* Prompt Answers */}
                {currentEntry.prompts && currentEntry.prompts.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-purple-400">Preguntas de reflexión:</h4>
                    {currentEntry.prompts.map((prompt, index) => (
                      <div key={index} className="space-y-2">
                        <Label className="text-purple-300">
                          {prompt.question}
                        </Label>
                        <Textarea
                          value={prompt.answer}
                          onChange={(e) => updatePromptAnswer(prompt.question, e.target.value)}
                          placeholder="Tu reflexión..."
                          className="bg-gray-800 border-purple-500/50 text-white resize-none"
                          rows={3}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Main Content */}
                <div>
                  <Label htmlFor="content" className="text-orange-300">
                    Contenido
                  </Label>
                  <Textarea
                    id="content"
                    value={currentEntry.content || ''}
                    onChange={(e) => setCurrentEntry(prev => ({ 
                      ...prev, 
                      content: e.target.value 
                    }))}
                    placeholder="¿Qué necesitas explorar hoy? Escribe sin censura, este es tu espacio sagrado..."
                    className="bg-gray-800 border-orange-500/50 text-white resize-none"
                    rows={8}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {(currentEntry.content || '').length} caracteres
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <Label className="text-orange-300">
                    Etiquetas (opcional)
                  </Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {currentEntry.tags?.map((tag, index) => (
                      <Badge 
                        key={index}
                        variant="outline"
                        className="border-orange-500 text-orange-300"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Añadir etiqueta"
                      className="bg-gray-800 border-orange-500/50 text-white text-sm"
                      onKeyDown={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button
                      onClick={addTag}
                      variant="outline"
                      size="sm"
                      className="border-orange-500 text-orange-300"
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Privacy */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="private"
                    checked={currentEntry.private ?? true}
                    onChange={(e) => setCurrentEntry(prev => ({ 
                      ...prev, 
                      private: e.target.checked 
                    }))}
                    className="w-4 h-4 text-orange-600 bg-gray-800 border-gray-600 rounded"
                  />
                  <Label htmlFor="private" className="text-gray-300 text-sm">
                    Mantener esta entrada completamente privada 🔒
                  </Label>
                </div>

                <Button
                  onClick={saveCurrentEntry}
                  disabled={!(currentEntry.content?.trim())}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-black font-semibold py-4"
                >
                  📖 Guardar Entrada
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Entries Tab */}
          <TabsContent value="entries" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex space-x-4">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar en tus entradas..."
                className="flex-1 bg-gray-800 border-gray-600 text-white"
              />
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
            </div>

            {/* Entries List */}
            <div className="space-y-4">
              {filteredEntries.map((entry) => (
                <Card key={entry.id} className="bg-gray-900/80 border-amber-500/30">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="font-serif text-xl text-amber-500">
                          {entry.title}
                        </CardTitle>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-400">{entry.date}</span>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm">{getMoodEmoji(entry.mood)}</span>
                            <span className="text-xs text-gray-400">
                              {getMoodLabel(entry.mood)}
                            </span>
                          </div>
                          {entry.private && (
                            <Badge variant="outline" className="border-green-500 text-green-400">
                              🔒 Privada
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => deleteEntry(entry.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                      >
                        🗑️
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Prompts */}
                    {entry.prompts && entry.prompts.length > 0 && (
                      <div className="mb-4 space-y-2">
                        {entry.prompts.map((prompt, index) => (
                          <div key={index} className="bg-purple-900/20 p-3 rounded-lg">
                            <p className="text-purple-300 text-sm font-medium mb-1">
                              {prompt.question}
                            </p>
                            <p className="text-gray-300 text-sm">
                              {prompt.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Content */}
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {entry.content.length > 300 
                        ? `${entry.content.substring(0, 300)}...` 
                        : entry.content
                      }
                    </p>

                    {/* Tags */}
                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {entry.tags.map((tag, index) => (
                          <Badge 
                            key={index}
                            variant="outline"
                            className="border-amber-500/50 text-amber-400"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {filteredEntries.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-gray-400">
                    {entries.length === 0 
                      ? 'Aún no has escrito ninguna entrada. ¡Comienza tu viaje de autoconocimiento!'
                      : 'No se encontraron entradas con los filtros seleccionados'
                    }
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Prompts Tab */}
          <TabsContent value="prompts" className="space-y-6">
            <Card className="bg-purple-900/20 border-purple-500/50">
              <CardHeader>
                <CardTitle className="font-serif text-2xl text-purple-400">
                  🔮 Preguntas de Reflexión
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Preguntas profundas para guiar tu autoexploración. 
                  Selecciona una para incluir en tu próxima entrada.
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availablePrompts.map((prompt) => (
                <Card 
                  key={prompt.id}
                  className={`${CATEGORY_COLORS[prompt.category]} transition-all duration-300 hover:scale-105`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                      >
                        Nivel {prompt.level} • {CATEGORY_LABELS[prompt.category]}
                      </Badge>
                    </div>
                    <CardTitle className="font-serif text-lg text-amber-500">
                      {prompt.question}
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      {prompt.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => selectPrompt(prompt)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                    >
                      ✍️ Usar Esta Pregunta
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {availablePrompts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔒</div>
                <p className="text-gray-400">
                  Completa más rituales para desbloquear preguntas más profundas
                </p>
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
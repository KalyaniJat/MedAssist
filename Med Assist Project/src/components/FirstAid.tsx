import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Search, 
  AlertTriangle, 
  Heart, 
  Thermometer, 
  Zap, 
  ChevronDown, 
  ChevronUp, 
  Phone, 
  Clock, 
  Users,
  Shield,
  Activity,
  Flame,
  Droplets,
  Wind
} from 'lucide-react';

interface FirstAidProcedure {
  id: string;
  title: string;
  category: 'emergency' | 'basic' | 'severe';
  icon: React.ReactNode;
  steps: string[];
  warning?: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
}

const firstAidProcedures: FirstAidProcedure[] = [
  {
    id: '1',
    title: 'CPR (Cardiopulmonary Resuscitation)',
    category: 'emergency',
    icon: <Heart className="w-6 h-6" />,
    description: 'Life-saving technique used when someone\'s breathing or heartbeat has stopped.',
    duration: '5-10 min',
    difficulty: 'advanced',
    steps: [
      'Check for responsiveness - tap shoulders and shout "Are you okay?"',
      'Call 108 immediately or have someone else do it',
      'Place person on firm, flat surface on their back',
      'Tilt head back slightly and lift chin',
      'Place heel of one hand on center of chest between nipples',
      'Place other hand on top, interlacing fingers',
      'Push hard and fast at least 2 inches deep at 100-120 compressions per minute',
      'Give 30 compressions, then 2 rescue breaths',
      'Continue cycles until emergency services arrive'
    ],
    warning: 'Only perform if trained. Call emergency services first.'
  },
  {
    id: '2',
    title: 'Choking (Heimlich Maneuver)',
    category: 'emergency',
    icon: <Wind className="w-6 h-6" />,
    description: 'Emergency procedure to dislodge objects blocking the airway.',
    duration: '1-3 min',
    difficulty: 'intermediate',
    steps: [
      'Ask "Are you choking?" - if they can\'t speak, act immediately',
      'Stand behind the person',
      'Place arms around their waist',
      'Make a fist with one hand, place thumb side against stomach above navel',
      'Grasp fist with other hand',
      'Give quick upward thrusts',
      'Continue until object is expelled or person becomes unconscious',
      'If unconscious, begin CPR'
    ],
    warning: 'For infants under 1 year, use back blows and chest thrusts instead.'
  },
  {
    id: '3',
    title: 'Severe Bleeding Control',
    category: 'severe',
    icon: <Droplets className="w-6 h-6" />,
    description: 'Steps to control heavy bleeding and prevent shock.',
    duration: '3-5 min',
    difficulty: 'intermediate',
    steps: [
      'Call 108 for severe bleeding',
      'Wear gloves if available',
      'Apply direct pressure to wound with clean cloth',
      'If blood soaks through, add more cloth on top - don\'t remove original',
      'Elevate injured area above heart level if possible',
      'Apply pressure to pressure points if direct pressure isn\'t working',
      'Apply tourniquet only if trained and as last resort',
      'Keep person warm and calm'
    ],
    warning: 'Never remove objects embedded in wounds.'
  },
  {
    id: '4',
    title: 'Burns Treatment',
    category: 'basic',
    icon: <Flame className="w-6 h-6" />,
    description: 'First aid treatment for thermal, chemical, or electrical burns.',
    duration: '10-20 min',
    difficulty: 'beginner',
    steps: [
      'Remove person from heat source',
      'Cool burn with cool (not cold) running water for 10-20 minutes',
      'Remove jewelry and loose clothing before swelling begins',
      'Do not break blisters',
      'Apply loose, sterile bandage',
      'Take over-the-counter pain medication if needed',
      'Seek medical attention for burns larger than 3 inches or on face/hands/genitals'
    ],
    warning: 'Never use ice, butter, or oils on burns.'
  },
  {
    id: '5',
    title: 'Allergic Reaction',
    category: 'severe',
    icon: <Shield className="w-6 h-6" />,
    description: 'Emergency response for mild to severe allergic reactions.',
    duration: '2-5 min',
    difficulty: 'intermediate',
    steps: [
      'Identify and remove allergen if possible',
      'For mild reactions: give antihistamine like Benadryl',
      'For severe reactions (anaphylaxis): call 108 immediately',
      'Use epinephrine auto-injector (EpiPen) if available',
      'Help person into comfortable position',
      'Loosen tight clothing',
      'Be prepared to perform CPR if person becomes unconscious',
      'Stay with person until help arrives'
    ],
    warning: 'Anaphylaxis is life-threatening. Call 108 immediately for severe reactions.'
  },
  {
    id: '6',
    title: 'Shock Treatment',
    category: 'severe',
    icon: <Activity className="w-6 h-6" />,
    description: 'Treatment for medical shock when blood flow is inadequate.',
    duration: '3-5 min',
    difficulty: 'intermediate',
    steps: [
      'Call 108 immediately',
      'Keep person lying down',
      'Elevate legs 8-12 inches unless spine injury suspected',
      'Keep person warm with blanket or clothing',
      'Loosen tight clothing',
      'Do not give food or water',
      'Monitor breathing and pulse',
      'Be prepared to perform CPR if needed'
    ],
    warning: 'Do not elevate legs if head, neck, back, or leg injuries are suspected.'
  }
];

const emergencyNumbers = [
  { service: 'Emergency Services', number: '108', icon: <Phone className="w-4 h-4" /> },
  { service: 'Poison Control', number: '1066', icon: <AlertTriangle className="w-4 h-4" /> },
  { service: 'Ambulance', number: '108', icon: <Activity className="w-4 h-4" /> }
];

export function FirstAid() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCard = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  const filteredProcedures = firstAidProcedures.filter(procedure => {
    const matchesSearch = procedure.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         procedure.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || procedure.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'emergency': return <AlertTriangle className="w-4 h-4" />;
      case 'severe': return <Zap className="w-4 h-4" />;
      case 'basic': return <Shield className="w-4 h-4" />;
      default: return <Heart className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'emergency': return 'bg-red-500 text-white border-red-200';
      case 'severe': return 'bg-orange-500 text-white border-orange-200';
      case 'basic': return 'bg-green-500 text-white border-green-200';
      default: return 'bg-gray-500 text-white border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Emergency Numbers */}
      <Alert className="border-red-200 bg-red-50">
        <Phone className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="font-medium">Emergency Numbers:</span>
            {emergencyNumbers.map((emergency, index) => (
              <span key={index} className="flex items-center gap-1 bg-red-100 px-2 py-1 rounded text-xs">
                {emergency.icon}
                {emergency.service}: {emergency.number}
              </span>
            ))}
          </div>
        </AlertDescription>
      </Alert>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search procedures or symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { key: 'all', label: 'All Procedures', icon: <Heart className="w-4 h-4" /> },
                { key: 'emergency', label: 'Emergency', icon: <AlertTriangle className="w-4 h-4" /> },
                { key: 'severe', label: 'Severe', icon: <Zap className="w-4 h-4" /> },
                { key: 'basic', label: 'Basic Care', icon: <Shield className="w-4 h-4" /> }
              ].map((filter) => (
                <Button
                  key={filter.key}
                  variant={selectedCategory === filter.key ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(filter.key)}
                  size="sm"
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  {filter.icon}
                  <span className="hidden sm:inline">{filter.label}</span>
                  <span className="sm:hidden">{filter.label.split(' ')[0]}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Procedures Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProcedures.map((procedure) => (
          <Card key={procedure.id} className="group hover:shadow-md transition-shadow">
            <Collapsible
              open={expandedCards.has(procedure.id)}
              onOpenChange={() => toggleCard(procedure.id)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getCategoryColor(procedure.category)}`}>
                        {procedure.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base leading-tight">{procedure.title}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {procedure.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {expandedCards.has(procedure.id) ? 
                        <ChevronUp className="w-4 h-4 text-muted-foreground" /> : 
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      }
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className={getCategoryColor(procedure.category)}>
                      {getCategoryIcon(procedure.category)}
                      <span className="ml-1 capitalize">{procedure.category}</span>
                    </Badge>
                    <Badge variant="outline" className={getDifficultyColor(procedure.difficulty)}>
                      <Users className="w-3 h-3 mr-1" />
                      {procedure.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {procedure.duration}
                    </Badge>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-0">
                  {procedure.warning && (
                    <Alert className="mb-4 border-yellow-200 bg-yellow-50">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-800 text-sm">
                        <strong>Warning:</strong> {procedure.warning}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                      Step-by-Step Instructions
                    </h4>
                    <ol className="space-y-3">
                      {procedure.steps.map((step, index) => (
                        <li key={index} className="flex gap-3 text-sm">
                          <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {filteredProcedures.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-lg mb-2">No procedures found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or category filters.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Footer Note */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> These procedures are for educational purposes only. 
          Always seek professional medical help in emergencies. If you're not trained in first aid, 
          focus on calling emergency services and providing comfort until help arrives.
        </AlertDescription>
      </Alert>
    </div>
  );
}
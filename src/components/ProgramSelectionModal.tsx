import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Calendar, 
  Clock,
  X,
  ChevronDown,
  GraduationCap,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Program {
  id: string;
  name: string;
  university: string;
  location: string;
  duration: string;
  startDate: string;
  tuitionFee: string;
  ranking: number;
  description: string;
  requirements: string[];
  deadline: string;
  type: 'masters' | 'bachelors' | 'phd';
}

interface ProgramSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProgramSelect: (program: Program) => void;
  selectedPrograms: string[];
  maxPrograms: number;
}

const ProgramSelectionModal: React.FC<ProgramSelectionModalProps> = ({
  isOpen,
  onClose,
  onProgramSelect,
  selectedPrograms,
  maxPrograms
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');

  // Mock program data
  const programs: Program[] = [
    {
      id: '1',
      name: 'Computer Science and Engineering',
      university: 'KTH Royal Institute of Technology',
      location: 'Stockholm',
      duration: '2 years',
      startDate: 'September 2024',
      tuitionFee: 'SEK 310,000',
      ranking: 1,
      description: 'Advanced computer science program with focus on AI and machine learning',
      requirements: ['Bachelor in CS/Engineering', 'IELTS 6.5+', 'GRE recommended'],
      deadline: '2024-03-15',
      type: 'masters'
    },
    {
      id: '2',
      name: 'Data Science',
      university: 'Uppsala University',
      location: 'Uppsala',
      duration: '2 years',
      startDate: 'September 2024',
      tuitionFee: 'SEK 290,000',
      ranking: 2,
      description: 'Comprehensive data science program covering statistics, ML, and big data',
      requirements: ['Bachelor in Math/CS/Statistics', 'TOEFL 90+', 'Portfolio'],
      deadline: '2024-03-01',
      type: 'masters'
    },
    {
      id: '3',
      name: 'Software Engineering',
      university: 'Lund University',
      location: 'Lund',
      duration: '2 years',
      startDate: 'September 2024',
      tuitionFee: 'SEK 295,000',
      ranking: 3,
      description: 'Focus on large-scale software development and system architecture',
      requirements: ['Bachelor in CS/Engineering', 'IELTS 6.5+'],
      deadline: '2024-02-28',
      type: 'masters'
    },
    {
      id: '4',
      name: 'Artificial Intelligence',
      university: 'Chalmers University',
      location: 'Gothenburg',
      duration: '2 years',
      startDate: 'September 2024',
      tuitionFee: 'SEK 320,000',
      ranking: 1,
      description: 'Cutting-edge AI program with research opportunities',
      requirements: ['Bachelor in CS/Engineering/Math', 'TOEFL 90+', 'Strong math background'],
      deadline: '2024-03-10',
      type: 'masters'
    },
    {
      id: '5',
      name: 'Cybersecurity',
      university: 'Stockholm University',
      location: 'Stockholm',
      duration: '2 years',
      startDate: 'September 2024',
      tuitionFee: 'SEK 285,000',
      ranking: 4,
      description: 'Comprehensive cybersecurity program with industry partnerships',
      requirements: ['Bachelor in CS/IT', 'IELTS 6.5+', 'Security background preferred'],
      deadline: '2024-03-05',
      type: 'masters'
    }
  ];

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.university.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || program.type === filterType;
    const matchesLocation = filterLocation === 'all' || program.location === filterLocation;
    
    return matchesSearch && matchesType && matchesLocation;
  });

  const uniqueLocations = [...new Set(programs.map(p => p.location))];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-6xl mx-4 bg-white rounded-t-xl sm:rounded-xl shadow-2xl transform transition-all duration-300 ease-out animate-slide-in-right max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <ChevronDown className="h-6 w-6 text-gray-400" />
            <div>
              <h2 className="text-xl font-semibold">Select Programs</h2>
              <p className="text-sm text-gray-500">
                {selectedPrograms.length} of {maxPrograms} programs selected
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-100 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Program Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="masters">Masters</SelectItem>
                <SelectItem value="bachelors">Bachelors</SelectItem>
                <SelectItem value="phd">PhD</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterLocation} onValueChange={setFilterLocation}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPrograms.map((program) => {
              const isSelected = selectedPrograms.includes(program.name);
              const canSelect = selectedPrograms.length < maxPrograms || isSelected;
              
              return (
                <Card 
                  key={program.id}
                  className={`transition-all hover:shadow-md cursor-pointer ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 
                    !canSelect ? 'border-gray-200 bg-gray-50 opacity-60' : 'border-gray-200'
                  }`}
                  onClick={() => {
                    if (canSelect) {
                      onProgramSelect(program);
                    }
                  }}
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg line-clamp-2">{program.name}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <Building className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{program.university}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                          <Star className="h-3 w-3 text-yellow-600 fill-current" />
                          <span className="text-xs font-medium text-yellow-700">#{program.ranking}</span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{program.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{program.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{program.startDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-gray-400" />
                          <span className="capitalize">{program.type}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 line-clamp-2">{program.description}</p>

                      {/* Requirements */}
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-700">Key Requirements:</p>
                        <div className="flex flex-wrap gap-1">
                          {program.requirements.slice(0, 2).map((req, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                          {program.requirements.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{program.requirements.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div>
                          <p className="text-sm font-medium">{program.tuitionFee}</p>
                          <p className="text-xs text-gray-500">Total tuition</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-red-600 font-medium">Deadline: {program.deadline}</p>
                          {isSelected && (
                            <Badge className="bg-blue-500 text-white text-xs mt-1">Selected</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {selectedPrograms.length} of {maxPrograms} programs selected
          </span>
          <Button onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProgramSelectionModal;
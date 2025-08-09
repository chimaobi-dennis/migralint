import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, User, Briefcase, Crown } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  type: 'professional' | 'academic' | 'creative' | 'ats-optimized';
  isPremium: boolean;
}

interface TemplateSelectionProps {
  onTemplateSelect: (template: Template) => void;
  selectedTemplate?: Template;
}

const templates: Template[] = [
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    description: 'Clean, modern design perfect for corporate positions',
    preview: '/resume-previews/modern-professional.jpg',
    type: 'professional',
    isPremium: false
  },
  {
    id: 'ats-optimized',
    name: 'ATS Optimized',
    description: 'Simple format that passes Applicant Tracking Systems',
    preview: '/resume-previews/ats-optimized.jpg',
    type: 'ats-optimized',
    isPremium: false
  },
  {
    id: 'academic-researcher',
    name: 'Academic CV',
    description: 'Comprehensive format for academic and research positions',
    preview: '/resume-previews/academic.jpg',
    type: 'academic',
    isPremium: true
  },
  {
    id: 'creative-designer',
    name: 'Creative Portfolio',
    description: 'Eye-catching design for creative professionals',
    preview: '/resume-previews/creative.jpg',
    type: 'creative',
    isPremium: true
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'professional': return <Briefcase className="h-4 w-4" />;
    case 'academic': return <FileText className="h-4 w-4" />;
    case 'creative': return <User className="h-4 w-4" />;
    case 'ats-optimized': return <FileText className="h-4 w-4" />;
    default: return <FileText className="h-4 w-4" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'professional': return 'bg-blue-100 text-blue-800';
    case 'academic': return 'bg-green-100 text-green-800';
    case 'creative': return 'bg-purple-100 text-purple-800';
    case 'ats-optimized': return 'bg-orange-100 text-orange-800';
    default: return 'bg-muted text-muted-foreground';
  }
};

export const TemplateSelection: React.FC<TemplateSelectionProps> = ({
  onTemplateSelect,
  selectedTemplate
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Resume Template</h2>
        <p className="text-muted-foreground">
          Select a template that best fits your industry and career level
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate?.id === template.id
                ? 'ring-2 ring-primary border-primary'
                : 'hover:border-primary/50'
            }`}
            onClick={() => onTemplateSelect(template)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {getTypeIcon(template.type)}
                  {template.name}
                </CardTitle>
                {template.isPremium && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{template.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="aspect-[3/4] bg-muted rounded-md flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">Template Preview</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Badge className={getTypeColor(template.type)}>
                  {template.type.replace('-', ' ')}
                </Badge>
                <Button
                  size="sm"
                  variant={selectedTemplate?.id === template.id ? "default" : "outline"}
                >
                  {selectedTemplate?.id === template.id ? 'Selected' : 'Select'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
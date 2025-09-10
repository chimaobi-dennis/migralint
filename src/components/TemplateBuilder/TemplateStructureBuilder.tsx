import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GripVertical, Plus, Eye, EyeOff, Settings, Trash2 } from 'lucide-react';
import { SectionConfig, TemplateStructure } from '@/lib/templateManager';

interface TemplateStructureBuilderProps {
  structure: TemplateStructure;
  onChange: (structure: TemplateStructure) => void;
}

const sectionTypes = [
  { value: 'header', label: 'Header', required: true },
  { value: 'summary', label: 'Summary', required: false },
  { value: 'experience', label: 'Experience', required: true },
  { value: 'education', label: 'Education', required: false },
  { value: 'skills', label: 'Skills', required: false },
  { value: 'projects', label: 'Projects', required: false },
  { value: 'certifications', label: 'Certifications', required: false }
];

const sectionVariants: Record<string, string[]> = {
  header: ['centered', 'left-aligned', 'simple', 'detailed'],
  summary: ['paragraph', 'bullet-points', 'highlight-box'],
  experience: ['timeline', 'list', 'detailed', 'compact'],
  education: ['list', 'timeline', 'compact', 'detailed'],
  skills: ['grid', 'list', 'tags', 'categories'],
  projects: ['grid', 'list', 'detailed'],
  certifications: ['list', 'grid', 'timeline']
};

export default function TemplateStructureBuilder({ structure, onChange }: TemplateStructureBuilderProps) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const handleLayoutChange = (layout: string) => {
    onChange({
      ...structure,
      layout: layout as TemplateStructure['layout']
    });
  };

  const handleSectionDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(structure.sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update row positions
    const updatedSections = items.map((section, index) => ({
      ...section,
      position: { ...section.position, row: index + 1 }
    }));

    onChange({
      ...structure,
      sections: updatedSections
    });
  };

  const addSection = (type: string) => {
    const newSection: SectionConfig = {
      type: type as SectionConfig['type'],
      position: { row: structure.sections.length + 1 },
      variant: sectionVariants[type][0],
      isRequired: sectionTypes.find(s => s.value === type)?.required || false,
      isVisible: true
    };

    onChange({
      ...structure,
      sections: [...structure.sections, newSection]
    });
  };

  const updateSection = (index: number, updates: Partial<SectionConfig>) => {
    const updatedSections = structure.sections.map((section, i) =>
      i === index ? { ...section, ...updates } : section
    );

    onChange({
      ...structure,
      sections: updatedSections
    });
  };

  const removeSection = (index: number) => {
    const updatedSections = structure.sections
      .filter((_, i) => i !== index)
      .map((section, i) => ({
        ...section,
        position: { ...section.position, row: i + 1 }
      }));

    onChange({
      ...structure,
      sections: updatedSections
    });
  };

  return (
    <div className="space-y-6">
      {/* Layout Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Template Layout</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Layout Type</Label>
              <Select value={structure.layout} onValueChange={handleLayoutChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single-column">Single Column</SelectItem>
                  <SelectItem value="two-column">Two Column</SelectItem>
                  <SelectItem value="sidebar-left">Sidebar Left</SelectItem>
                  <SelectItem value="sidebar-right">Sidebar Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Max Width</Label>
                <Select 
                  value={structure.maxWidth} 
                  onValueChange={(value) => onChange({ ...structure, maxWidth: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="600px">600px (A4 Narrow)</SelectItem>
                    <SelectItem value="800px">800px (A4 Standard)</SelectItem>
                    <SelectItem value="900px">900px (A4 Wide)</SelectItem>
                    <SelectItem value="100%">Full Width</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Page Margins</Label>
                <Select 
                  value={structure.pageMargins} 
                  onValueChange={(value) => onChange({ ...structure, pageMargins: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20px">Narrow (20px)</SelectItem>
                    <SelectItem value="40px">Standard (40px)</SelectItem>
                    <SelectItem value="60px">Wide (60px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg">Resume Sections</CardTitle>
          <Select onValueChange={addSection}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Add Section" />
            </SelectTrigger>
            <SelectContent>
              {sectionTypes
                .filter(type => !structure.sections.some(s => s.type === type.value))
                .map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      {type.label}
                      {type.required && <Badge variant="secondary" className="text-xs">Required</Badge>}
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleSectionDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                  {structure.sections.map((section, index) => (
                    <Draggable key={`${section.type}-${index}`} draggableId={`${section.type}-${index}`} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`border rounded-lg p-4 bg-background ${
                            snapshot.isDragging ? 'shadow-lg' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div {...provided.dragHandleProps}>
                                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                  {sectionTypes.find(t => t.value === section.type)?.label}
                                </Badge>
                                {section.isRequired && (
                                  <Badge variant="secondary" className="text-xs">Required</Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => updateSection(index, { isVisible: !section.isVisible })}
                              >
                                {section.isVisible ? (
                                  <Eye className="h-4 w-4" />
                                ) : (
                                  <EyeOff className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setSelectedSection(selectedSection === `${section.type}-${index}` ? null : `${section.type}-${index}`)}
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                              {!section.isRequired && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeSection(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>

                          {selectedSection === `${section.type}-${index}` && (
                            <div className="mt-4 pt-4 border-t space-y-3">
                              <div>
                                <Label>Section Variant</Label>
                                <Select
                                  value={section.variant}
                                  onValueChange={(value) => updateSection(index, { variant: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {sectionVariants[section.type]?.map((variant) => (
                                      <SelectItem key={variant} value={variant}>
                                        {variant.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={section.isVisible}
                                  onCheckedChange={(checked) => updateSection(index, { isVisible: checked })}
                                />
                                <Label>Visible in template</Label>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
      </Card>
    </div>
  );
}
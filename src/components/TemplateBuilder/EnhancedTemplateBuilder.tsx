import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Plus, 
  Save, 
  Eye, 
  Palette, 
  Layout, 
  Type, 
  Settings,
  Download,
  Share,
  Undo,
  Redo,
  Copy
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { toast } from 'sonner';

import { Template, SectionConfig, templateManager } from '@/lib/templateManager';
import LiveTemplatePreview from './LiveTemplatePreview';
import SectionContentEditor from './SectionContentEditor';
import VisualStylingPanel from './VisualStylingPanel';

interface EnhancedTemplateBuilderProps {
  initialTemplate?: Template;
  onSave: (template: Template) => void;
  onCancel: () => void;
}

const availableSections = [
  { type: 'profile', label: 'Profile/Header', required: true, icon: '👤' },
  { type: 'summary', label: 'Professional Summary', required: false, icon: '📝' },
  { type: 'experience', label: 'Work Experience', required: true, icon: '💼' },
  { type: 'education', label: 'Education', required: false, icon: '🎓' },
  { type: 'skills', label: 'Skills & Competencies', required: false, icon: '⚡' },
  { type: 'languages', label: 'Languages', required: false, icon: '🌐' },
  { type: 'awards', label: 'Awards & Recognition', required: false, icon: '🏆' },
  { type: 'certifications', label: 'Certifications', required: false, icon: '📜' },
  { type: 'interests', label: 'Interests & Hobbies', required: false, icon: '🎯' },
  { type: 'projects', label: 'Projects & Portfolio', required: false, icon: '🚀' },
  { type: 'publications', label: 'Publications', required: false, icon: '📚' },
  { type: 'volunteering', label: 'Volunteer Experience', required: false, icon: '❤️' },
  { type: 'custom', label: 'Custom Section', required: false, icon: '⚙️' }
];

const defaultTemplate: Omit<Template, 'id' | 'createdAt' | 'updatedAt'> = {
  name: 'New Template',
  description: 'A custom resume template',
  preview: '',
  type: 'professional',
  isPremium: false,
  structure: {
    layout: 'single-column',
    sections: [
      { type: 'profile', position: { row: 1 }, variant: 'centered', isRequired: true, isVisible: true },
      { type: 'summary', position: { row: 2 }, variant: 'paragraph', isRequired: false, isVisible: true },
      { type: 'experience', position: { row: 3 }, variant: 'timeline', isRequired: true, isVisible: true },
      { type: 'education', position: { row: 4 }, variant: 'list', isRequired: false, isVisible: true }
    ],
    maxWidth: '800px',
    pageMargins: '40px'
  },
  styling: {
    colors: {
      primary: 'hsl(220, 14%, 20%)',
      secondary: 'hsl(220, 9%, 46%)',
      accent: 'hsl(221, 83%, 53%)',
      text: 'hsl(220, 14%, 8%)',
      background: 'hsl(0, 0%, 100%)',
      muted: 'hsl(220, 14%, 96%)'
    },
    typography: {
      heading: {
        fontFamily: 'Inter',
        fontSize: '1.5rem',
        fontWeight: '600',
        lineHeight: '1.2'
      },
      body: {
        fontFamily: 'Inter',
        fontSize: '0.875rem',
        fontWeight: '400',
        lineHeight: '1.5'
      },
      small: {
        fontSize: '0.75rem',
        fontWeight: '400'
      }
    },
    spacing: {
      sectionGap: '2rem',
      contentPadding: '1rem',
      itemSpacing: '0.75rem',
      marginTop: '0.5rem',
      marginBottom: '0.5rem'
    }
  },
  rules: {
    requiredSections: ['profile', 'experience'],
    maxSections: 12,
    allowCustomSections: true
  }
};

export default function EnhancedTemplateBuilder({ 
  initialTemplate, 
  onSave, 
  onCancel 
}: EnhancedTemplateBuilderProps) {
  const [template, setTemplate] = useState<Template>(
    initialTemplate || { 
      ...defaultTemplate, 
      id: `template-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Template
  );
  
  const [activeTab, setActiveTab] = useState('design');
  const [editingSection, setEditingSection] = useState<{ type: string; index: number } | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    if (isDirty) {
      const timeoutId = setTimeout(() => {
        // Auto-save to localStorage
        localStorage.setItem(`template-draft-${template.id}`, JSON.stringify(template));
        setIsDirty(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [template, isDirty]);

  const updateTemplate = (updates: Partial<Template>) => {
    setTemplate(prev => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }));
    setIsDirty(true);
  };

  const updateStructure = (structure: any) => {
    updateTemplate({ structure });
  };

  const updateStyling = (styling: any) => {
    updateTemplate({ styling });
  };

  const handleSectionDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sections = Array.from(template.structure.sections);
    const [reorderedSection] = sections.splice(result.source.index, 1);
    sections.splice(result.destination.index, 0, reorderedSection);

    // Update row positions
    const updatedSections = sections.map((section, index) => ({
      ...section,
      position: { ...section.position, row: index + 1 }
    }));

    updateStructure({
      ...template.structure,
      sections: updatedSections
    });
  };

  const addSection = (sectionType: string, afterIndex?: number) => {
    const sectionConfig = availableSections.find(s => s.type === sectionType);
    if (!sectionConfig) return;

    const newSection: SectionConfig = {
      type: sectionType as SectionConfig['type'],
      position: { row: (afterIndex ?? template.structure.sections.length) + 1 },
      variant: 'default',
      isRequired: sectionConfig.required,
      isVisible: true,
      content: []
    };

    const updatedSections = [...template.structure.sections];
    const insertIndex = afterIndex !== undefined ? afterIndex + 1 : updatedSections.length;
    updatedSections.splice(insertIndex, 0, newSection);

    // Update row positions
    const reindexedSections = updatedSections.map((section, index) => ({
      ...section,
      position: { ...section.position, row: index + 1 }
    }));

    updateStructure({
      ...template.structure,
      sections: reindexedSections
    });
  };

  const deleteSection = (index: number) => {
    const section = template.structure.sections[index];
    if (section.isRequired) {
      toast.error('Cannot delete required section');
      return;
    }

    const updatedSections = template.structure.sections
      .filter((_, i) => i !== index)
      .map((section, i) => ({
        ...section,
        position: { ...section.position, row: i + 1 }
      }));

    updateStructure({
      ...template.structure,
      sections: updatedSections
    });
  };

  const updateSection = (index: number, updates: Partial<SectionConfig>) => {
    const updatedSections = template.structure.sections.map((section, i) =>
      i === index ? { ...section, ...updates } : section
    );

    updateStructure({
      ...template.structure,
      sections: updatedSections
    });
  };

  const handleSave = () => {
    if (!template.name.trim()) {
      toast.error('Template name is required');
      return;
    }

    onSave(template);
    toast.success('Template saved successfully');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(template, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${template.name.replace(/\s+/g, '-').toLowerCase()}-template.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (previewMode) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Template Preview</h1>
                <p className="text-muted-foreground">{template.name}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setPreviewMode(false)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Back to Editor
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto p-6">
          <div className="max-w-4xl mx-auto">
            <LiveTemplatePreview
              template={template}
              onSectionClick={(type, index) => {
                setEditingSection({ type, index });
                setPreviewMode(false);
              }}
              onAddSection={addSection}
              onDeleteSection={deleteSection}
              dummyData={{}}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with actions */}
      <div className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">Template Builder</h1>
                <p className="text-muted-foreground">
                  Create professional resume templates with drag-and-drop ease
                </p>
              </div>
              {isDirty && (
                <Badge variant="secondary" className="ml-4">
                  Unsaved changes
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPreviewMode(true)}>
                <Eye className="h-4 w-4 mr-2" />
                Full Preview
              </Button>
              <Button variant="outline" size="sm" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Template
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main builder interface */}
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-10rem)]">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="sections">Sections</TabsTrigger>
                <TabsTrigger value="styling">Styling</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[70vh]">
                <TabsContent value="design" className="space-y-4 p-1">
                  {/* Basic Template Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Type className="h-5 w-5" />
                        Template Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Template Name</Label>
                        <Input
                          value={template.name}
                          onChange={(e) => updateTemplate({ name: e.target.value })}
                          placeholder="Enter template name"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={template.description}
                          onChange={(e) => updateTemplate({ description: e.target.value })}
                          placeholder="Describe this template"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Template Type</Label>
                          <Select
                            value={template.type}
                            onValueChange={(value: any) => updateTemplate({ type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="professional">Professional</SelectItem>
                              <SelectItem value="academic">Academic</SelectItem>
                              <SelectItem value="creative">Creative</SelectItem>
                              <SelectItem value="ats-optimized">ATS Optimized</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center space-x-2 pt-6">
                          <Switch
                            checked={template.isPremium}
                            onCheckedChange={(checked) => updateTemplate({ isPremium: checked })}
                          />
                          <Label>Premium Template</Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Layout Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Layout className="h-5 w-5" />
                        Layout Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Layout Type</Label>
                        <Select
                          value={template.structure.layout}
                          onValueChange={(value: any) => updateStructure({
                            ...template.structure,
                            layout: value
                          })}
                        >
                          <SelectTrigger>
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
                            value={template.structure.maxWidth}
                            onValueChange={(value) => updateStructure({
                              ...template.structure,
                              maxWidth: value
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="600px">600px (Narrow)</SelectItem>
                              <SelectItem value="800px">800px (Standard)</SelectItem>
                              <SelectItem value="900px">900px (Wide)</SelectItem>
                              <SelectItem value="100%">Full Width</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Page Margins</Label>
                          <Select
                            value={template.structure.pageMargins}
                            onValueChange={(value) => updateStructure({
                              ...template.structure,
                              pageMargins: value
                            })}
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
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="sections" className="space-y-4 p-1">
                  {/* Add Sections */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Available Sections
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-2">
                        {availableSections
                          .filter(section => !template.structure.sections.some(s => s.type === section.type))
                          .map((section) => (
                            <Button
                              key={section.type}
                              variant="outline"
                              onClick={() => addSection(section.type)}
                              className="justify-start h-auto p-3"
                            >
                              <span className="text-lg mr-3">{section.icon}</span>
                              <div className="text-left">
                                <div className="font-medium">{section.label}</div>
                                {section.required && (
                                  <div className="text-xs text-muted-foreground">Required</div>
                                )}
                              </div>
                            </Button>
                          ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Current Sections */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Template Sections</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <DragDropContext onDragEnd={handleSectionDragEnd}>
                        <Droppable droppableId="template-sections">
                          {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                              {template.structure.sections.map((section, index) => (
                                <Draggable
                                  key={`${section.type}-${index}`}
                                  draggableId={`${section.type}-${index}`}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`border rounded-lg p-3 bg-background cursor-move ${
                                        snapshot.isDragging ? 'shadow-lg' : ''
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                          <span className="text-lg">
                                            {availableSections.find(s => s.type === section.type)?.icon}
                                          </span>
                                          <div>
                                            <div className="font-medium">
                                              {availableSections.find(s => s.type === section.type)?.label}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                              {section.variant} variant
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Switch
                                            checked={section.isVisible}
                                            onCheckedChange={(checked) => updateSection(index, { isVisible: checked })}
                                          />
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setEditingSection({ type: section.type, index })}
                                          >
                                            <Settings className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
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
                </TabsContent>

                <TabsContent value="styling" className="p-1">
                  <VisualStylingPanel
                    colors={template.styling.colors}
                    typography={template.styling.typography}
                    spacing={template.styling.spacing}
                    onColorsChange={(colors) => updateStyling({ ...template.styling, colors })}
                    onTypographyChange={(typography) => updateStyling({ ...template.styling, typography })}
                    onSpacingChange={(spacing) => updateStyling({ ...template.styling, spacing })}
                  />
                </TabsContent>

                <TabsContent value="settings" className="space-y-4 p-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Template Rules</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Maximum Sections</Label>
                        <Input
                          type="number"
                          value={template.rules.maxSections}
                          onChange={(e) => updateTemplate({
                            rules: { ...template.rules, maxSections: parseInt(e.target.value) }
                          })}
                          min={1}
                          max={20}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={template.rules.allowCustomSections}
                          onCheckedChange={(checked) => updateTemplate({
                            rules: { ...template.rules, allowCustomSections: checked }
                          })}
                        />
                        <Label>Allow Custom Sections</Label>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Live Preview
                  <Badge variant="secondary" className="ml-auto">Interactive</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[70vh] p-4">
                  <LiveTemplatePreview
                    template={template}
                    onSectionClick={(type, index) => setEditingSection({ type, index })}
                    onAddSection={addSection}
                    onDeleteSection={deleteSection}
                    dummyData={{}}
                  />
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Section Content Editor Modal */}
      {editingSection && (
        <Dialog open={true} onOpenChange={() => setEditingSection(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Edit Section Content</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[80vh] pr-4">
              <SectionContentEditor
                section={template.structure.sections[editingSection.index]}
                sectionIndex={editingSection.index}
                onSectionUpdate={(updates) => updateSection(editingSection.index, updates)}
                onClose={() => setEditingSection(null)}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
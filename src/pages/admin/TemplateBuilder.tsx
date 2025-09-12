import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Edit, Trash2, Eye, FileText, User, Briefcase, Crown, Settings, Palette, Layout, Save } from 'lucide-react';
import { toast } from 'sonner';

import { useTemplates, Template } from '@/hooks/useTemplates';
import TemplateStructureBuilder from '@/components/TemplateBuilder/TemplateStructureBuilder';
import VisualStylingPanel from '@/components/TemplateBuilder/VisualStylingPanel';
import EnhancedTemplateBuilder from '@/components/TemplateBuilder/EnhancedTemplateBuilder';

const defaultTemplate: Omit<Template, 'id' | 'created_at' | 'updated_at'> = {
  name: '',
  description: '',
  type: 'resume',
  is_premium: false,
  is_public: true,
  structure: {
    layout: 'single-column',
    sections: [
      { type: 'header', position: { row: 1 }, variant: 'centered', isRequired: true, isVisible: true },
      { type: 'experience', position: { row: 2 }, variant: 'timeline', isRequired: true, isVisible: true },
      { type: 'education', position: { row: 3 }, variant: 'list', isRequired: true, isVisible: true },
      { type: 'skills', position: { row: 4 }, variant: 'grid', isRequired: false, isVisible: true }
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
  content: {},
  metadata: {
    requiredSections: ['header', 'experience'],
    maxSections: 8,
    allowCustomSections: false
  }
};

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
    case 'professional': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'academic': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'creative': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'ats-optimized': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    default: return 'bg-muted text-muted-foreground';
  }
};

export default function TemplateBuilder() {
  const { templates, loading, createTemplate, updateTemplate, deleteTemplate } = useTemplates();
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Convert old format to new format for compatibility with EnhancedTemplateBuilder
  const convertToOldFormat = (template: Template): any => ({
    id: template.id,
    name: template.name,
    description: template.description || '',
    preview: '',
    type: template.type,
    isPremium: template.is_premium,
    structure: template.structure,
    styling: template.styling,
    rules: template.metadata,
    createdAt: template.created_at,
    updatedAt: template.updated_at
  });

  const convertToNewFormat = (template: any): Omit<Template, 'id' | 'created_at' | 'updated_at'> => ({
    name: template.name,
    description: template.description || '',
    type: template.type,
    is_premium: template.isPremium || false,
    is_public: true,
    structure: template.structure,
    styling: template.styling,
    content: {},
    metadata: template.rules || {}
  });

  const handleCreateTemplate = async (templateData: any) => {
    const converted = convertToNewFormat(templateData);
    const result = await createTemplate(converted);
    if (result) {
      setIsCreateModalOpen(false);
    }
  };

  const handleUpdateTemplate = async (templateData: any) => {
    if (!templateData.id) return;
    const converted = convertToNewFormat(templateData);
    const result = await updateTemplate(templateData.id, converted);
    if (result) {
      setEditingTemplate(null);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    await deleteTemplate(templateId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Template Builder</h1>
              <p className="text-muted-foreground">Create and manage resume templates</p>
            </div>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-full max-h-[95vh] w-[95vw]">
                <DialogHeader>
                  <DialogTitle>Create New Template</DialogTitle>
                </DialogHeader>
                <EnhancedTemplateBuilder
                  onSave={handleCreateTemplate}
                  onCancel={() => setIsCreateModalOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{templates.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Premium Templates</CardTitle>
                  <Crown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{templates.filter(t => t.is_premium).length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Template Types</CardTitle>
                  <Layout className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{new Set(templates.map(t => t.type)).size}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="group hover:shadow-md transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getTypeIcon(template.type)}
                        {template.name}
                      </CardTitle>
                      {template.is_premium && (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
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
                        <p className="text-xs mt-1">{template.structure?.layout || 'single-column'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge className={getTypeColor(template.type)}>
                        {template.type.replace('-', ' ')}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setPreviewTemplate(template)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingTemplate(template)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => template.id && handleDeleteTemplate(template.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Template Builder Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-save templates</Label>
                    <p className="text-sm text-muted-foreground">Automatically save changes while editing</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Template validation</Label>
                    <p className="text-sm text-muted-foreground">Validate template structure before saving</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Template Dialog */}
      {editingTemplate && (
        <Dialog open={true} onOpenChange={() => setEditingTemplate(null)}>
          <DialogContent className="max-w-full max-h-[95vh] w-[95vw]">
            <DialogHeader>
              <DialogTitle>Edit Template: {editingTemplate.name}</DialogTitle>
            </DialogHeader>
            <EnhancedTemplateBuilder
              initialTemplate={editingTemplate ? convertToOldFormat(editingTemplate) : undefined}
              onSave={handleUpdateTemplate}
              onCancel={() => setEditingTemplate(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Preview Template Dialog */}
      {previewTemplate && (
        <Dialog open={true} onOpenChange={() => setPreviewTemplate(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Preview: {previewTemplate.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="aspect-[3/4] bg-muted rounded-md flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <FileText className="h-16 w-16 mx-auto mb-4" />
                  <p>Template Preview</p>
                  <p className="text-sm mt-2">{previewTemplate.description}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Template Editor Component
interface TemplateEditorProps {
  template: Template | Omit<Template, 'id' | 'created_at' | 'updated_at'>;
  onSave: (template: any) => void;
  onCancel: () => void;
}

function TemplateEditor({ template, onSave, onCancel }: TemplateEditorProps) {
  const [formData, setFormData] = useState(template);

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('Template name is required');
      return;
    }
    onSave(formData);
  };

  const handleStructureChange = (structure: any) => {
    setFormData({ ...formData, structure });
  };

  const handleColorsChange = (colors: any) => {
    setFormData({ ...formData, styling: { ...formData.styling, colors } });
  };

  const handleTypographyChange = (typography: any) => {
    setFormData({ ...formData, styling: { ...formData.styling, typography } });
  };

  const handleSpacingChange = (spacing: any) => {
    setFormData({ ...formData, styling: { ...formData.styling, spacing } });
  };

  const handlePremiumToggle = (isPremium: boolean) => {
    setFormData({ ...formData, is_premium: isPremium });
  };

  return (
    <ScrollArea className="h-[70vh]">
      <div className="space-y-6 p-1">
        <Tabs defaultValue="basic">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="styling">Styling</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter template name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Template Type</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this template"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.is_premium}
                onCheckedChange={(checked) => setFormData({ ...formData, is_premium: checked })}
              />
              <Label>Premium Template</Label>
            </div>
          </TabsContent>

          <TabsContent value="structure" className="space-y-4">
            <TemplateStructureBuilder
              structure={formData.structure}
              onChange={handleStructureChange}
            />
          </TabsContent>

          <TabsContent value="styling" className="space-y-4">
            <VisualStylingPanel
              colors={formData.styling.colors}
              typography={formData.styling.typography}
              spacing={formData.styling.spacing}
              onColorsChange={handleColorsChange}
              onTypographyChange={handleTypographyChange}
              onSpacingChange={handleSpacingChange}
            />
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Template Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[3/4] bg-muted rounded-md flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <FileText className="h-16 w-16 mx-auto mb-4" />
                    <p>Live Preview</p>
                    <p className="text-sm mt-2">{formData.name}</p>
                    <p className="text-xs mt-1">{formData.structure?.layout || 'single-column'} • {formData.structure?.sections?.length || 0} sections</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}
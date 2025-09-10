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

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  type: 'professional' | 'academic' | 'creative' | 'ats-optimized';
  isPremium: boolean;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  layout: {
    columns: number;
    spacing: 'compact' | 'normal' | 'spacious';
    sections: string[];
  };
  createdAt: string;
  updatedAt: string;
}

const defaultTemplate: Omit<Template, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  description: '',
  preview: '',
  type: 'professional',
  isPremium: false,
  colors: {
    primary: '#1f2937',
    secondary: '#6b7280',
    accent: '#3b82f6',
    text: '#111827'
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter'
  },
  layout: {
    columns: 1,
    spacing: 'normal',
    sections: ['personal', 'experience', 'education', 'skills']
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
  const [templates, setTemplates] = useState<Template[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Load templates from localStorage on mount
  useEffect(() => {
    const savedTemplates = localStorage.getItem('resume-templates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
  }, []);

  // Save templates to localStorage
  const saveTemplates = (updatedTemplates: Template[]) => {
    setTemplates(updatedTemplates);
    localStorage.setItem('resume-templates', JSON.stringify(updatedTemplates));
  };

  const handleCreateTemplate = (templateData: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate: Template = {
      ...templateData,
      id: `template-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedTemplates = [...templates, newTemplate];
    saveTemplates(updatedTemplates);
    toast.success('Template created successfully');
    setIsCreateModalOpen(false);
  };

  const handleUpdateTemplate = (templateData: Template) => {
    const updatedTemplates = templates.map(t => 
      t.id === templateData.id 
        ? { ...templateData, updatedAt: new Date().toISOString() }
        : t
    );
    saveTemplates(updatedTemplates);
    toast.success('Template updated successfully');
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (templateId: string) => {
    const updatedTemplates = templates.filter(t => t.id !== templateId);
    saveTemplates(updatedTemplates);
    toast.success('Template deleted successfully');
  };

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
              <DialogContent className="max-w-4xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>Create New Template</DialogTitle>
                </DialogHeader>
                <TemplateEditor
                  template={defaultTemplate}
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
                  <div className="text-2xl font-bold">{templates.filter(t => t.isPremium).length}</div>
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
                      {template.isPremium && (
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
                          onClick={() => handleDeleteTemplate(template.id)}
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
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Edit Template: {editingTemplate.name}</DialogTitle>
            </DialogHeader>
            <TemplateEditor
              template={editingTemplate}
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
  template: Template | Omit<Template, 'id' | 'createdAt' | 'updatedAt'>;
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

  return (
    <ScrollArea className="h-[70vh]">
      <div className="space-y-6 p-1">
        <Tabs defaultValue="basic">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
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
                checked={formData.isPremium}
                onCheckedChange={(checked) => setFormData({ ...formData, isPremium: checked })}
              />
              <Label>Premium Template</Label>
            </div>
          </TabsContent>

          <TabsContent value="design" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formData.colors.primary}
                    onChange={(e) => setFormData({
                      ...formData,
                      colors: { ...formData.colors, primary: e.target.value }
                    })}
                    className="w-16 h-10"
                  />
                  <Input
                    value={formData.colors.primary}
                    onChange={(e) => setFormData({
                      ...formData,
                      colors: { ...formData.colors, primary: e.target.value }
                    })}
                    placeholder="#1f2937"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formData.colors.accent}
                    onChange={(e) => setFormData({
                      ...formData,
                      colors: { ...formData.colors, accent: e.target.value }
                    })}
                    className="w-16 h-10"
                  />
                  <Input
                    value={formData.colors.accent}
                    onChange={(e) => setFormData({
                      ...formData,
                      colors: { ...formData.colors, accent: e.target.value }
                    })}
                    placeholder="#3b82f6"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Heading Font</Label>
                <Select
                  value={formData.fonts.heading}
                  onValueChange={(value) => setFormData({
                    ...formData,
                    fonts: { ...formData.fonts, heading: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                    <SelectItem value="Lato">Lato</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Body Font</Label>
                <Select
                  value={formData.fonts.body}
                  onValueChange={(value) => setFormData({
                    ...formData,
                    fonts: { ...formData.fonts, body: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                    <SelectItem value="Lato">Lato</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Columns</Label>
                <Select
                  value={formData.layout.columns.toString()}
                  onValueChange={(value) => setFormData({
                    ...formData,
                    layout: { ...formData.layout, columns: parseInt(value) }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Single Column</SelectItem>
                    <SelectItem value="2">Two Columns</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Spacing</Label>
                <Select
                  value={formData.layout.spacing}
                  onValueChange={(value: any) => setFormData({
                    ...formData,
                    layout: { ...formData.layout, spacing: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="spacious">Spacious</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
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
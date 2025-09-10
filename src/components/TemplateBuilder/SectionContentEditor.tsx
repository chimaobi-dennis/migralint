import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Trash2, 
  Type, 
  Table, 
  Columns, 
  List, 
  Image,
  Link,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';
import { SectionConfig } from '@/lib/templateManager';

interface SectionContentEditorProps {
  section: SectionConfig;
  sectionIndex: number;
  onSectionUpdate: (updates: Partial<SectionConfig>) => void;
  onClose: () => void;
}

interface ContentElement {
  id: string;
  type: 'text' | 'heading' | 'table' | 'list' | 'columns' | 'image' | 'link';
  content: any;
  styling?: {
    alignment?: 'left' | 'center' | 'right';
    fontWeight?: 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
    fontSize?: string;
    color?: string;
  };
}

const contentTypes = [
  { value: 'heading', label: 'Heading', icon: Type },
  { value: 'text', label: 'Text/Paragraph', icon: Type },
  { value: 'table', label: 'Table', icon: Table },
  { value: 'columns', label: 'Columns', icon: Columns },
  { value: 'list', label: 'List', icon: List },
  { value: 'image', label: 'Image', icon: Image },
  { value: 'link', label: 'Link', icon: Link }
];

export default function SectionContentEditor({ 
  section, 
  sectionIndex, 
  onSectionUpdate, 
  onClose 
}: SectionContentEditorProps) {
  const [contentElements, setContentElements] = useState<ContentElement[]>(
    section.content || []
  );

  const addContentElement = (type: ContentElement['type']) => {
    const newElement: ContentElement = {
      id: `${type}-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      styling: {
        alignment: 'left',
        fontWeight: 'normal',
        fontStyle: 'normal'
      }
    };

    const updatedElements = [...contentElements, newElement];
    setContentElements(updatedElements);
    onSectionUpdate({ content: updatedElements });
  };

  const updateContentElement = (id: string, updates: Partial<ContentElement>) => {
    const updatedElements = contentElements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    setContentElements(updatedElements);
    onSectionUpdate({ content: updatedElements });
  };

  const removeContentElement = (id: string) => {
    const updatedElements = contentElements.filter(el => el.id !== id);
    setContentElements(updatedElements);
    onSectionUpdate({ content: updatedElements });
  };

  const moveElement = (id: string, direction: 'up' | 'down') => {
    const currentIndex = contentElements.findIndex(el => el.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= contentElements.length) return;

    const updatedElements = [...contentElements];
    [updatedElements[currentIndex], updatedElements[newIndex]] = 
    [updatedElements[newIndex], updatedElements[currentIndex]];

    setContentElements(updatedElements);
    onSectionUpdate({ content: updatedElements });
  };

  function getDefaultContent(type: ContentElement['type']) {
    switch (type) {
      case 'heading':
        return { text: 'Section Heading', level: 'h2' };
      case 'text':
        return { text: 'Enter your text content here. This can be multiple paragraphs and will support formatting options.' };
      case 'table':
        return {
          headers: ['Column 1', 'Column 2', 'Column 3'],
          rows: [
            ['Data 1', 'Data 2', 'Data 3'],
            ['Data 4', 'Data 5', 'Data 6']
          ]
        };
      case 'columns':
        return {
          columnCount: 2,
          columns: [
            { content: 'Left column content' },
            { content: 'Right column content' }
          ]
        };
      case 'list':
        return {
          type: 'bullet',
          items: ['List item 1', 'List item 2', 'List item 3']
        };
      case 'image':
        return {
          src: '/placeholder-image.jpg',
          alt: 'Image description',
          caption: 'Image caption'
        };
      case 'link':
        return {
          text: 'Link text',
          url: 'https://example.com',
          target: '_blank'
        };
      default:
        return {};
    }
  }

  const renderContentEditor = (element: ContentElement) => {
    switch (element.type) {
      case 'heading':
        return (
          <div className="space-y-3">
            <div>
              <Label>Heading Text</Label>
              <Input
                value={element.content.text}
                onChange={(e) => updateContentElement(element.id, {
                  content: { ...element.content, text: e.target.value }
                })}
              />
            </div>
            <div>
              <Label>Heading Level</Label>
              <Select
                value={element.content.level}
                onValueChange={(value) => updateContentElement(element.id, {
                  content: { ...element.content, level: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">H1 - Main Title</SelectItem>
                  <SelectItem value="h2">H2 - Section Title</SelectItem>
                  <SelectItem value="h3">H3 - Subsection</SelectItem>
                  <SelectItem value="h4">H4 - Minor Heading</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-3">
            <div>
              <Label>Text Content</Label>
              <Textarea
                value={element.content.text}
                onChange={(e) => updateContentElement(element.id, {
                  content: { ...element.content, text: e.target.value }
                })}
                rows={6}
                placeholder="Enter your text content..."
              />
            </div>
          </div>
        );

      case 'table':
        return (
          <div className="space-y-4">
            <div>
              <Label>Table Headers</Label>
              {element.content.headers.map((header: string, index: number) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    value={header}
                    onChange={(e) => {
                      const newHeaders = [...element.content.headers];
                      newHeaders[index] = e.target.value;
                      updateContentElement(element.id, {
                        content: { ...element.content, headers: newHeaders }
                      });
                    }}
                    placeholder={`Column ${index + 1} header`}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newHeaders = element.content.headers.filter((_: any, i: number) => i !== index);
                      const newRows = element.content.rows.map((row: any[]) => 
                        row.filter((_, i) => i !== index)
                      );
                      updateContentElement(element.id, {
                        content: { ...element.content, headers: newHeaders, rows: newRows }
                      });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  const newHeaders = [...element.content.headers, `Column ${element.content.headers.length + 1}`];
                  const newRows = element.content.rows.map((row: any[]) => [...row, '']);
                  updateContentElement(element.id, {
                    content: { ...element.content, headers: newHeaders, rows: newRows }
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Column
              </Button>
            </div>

            <div>
              <Label>Table Rows</Label>
              {element.content.rows.map((row: string[], rowIndex: number) => (
                <div key={rowIndex} className="border rounded p-3 mt-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Row {rowIndex + 1}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newRows = element.content.rows.filter((_: any, i: number) => i !== rowIndex);
                        updateContentElement(element.id, {
                          content: { ...element.content, rows: newRows }
                        });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${element.content.headers.length}, 1fr)` }}>
                    {row.map((cell: string, cellIndex: number) => (
                      <Input
                        key={cellIndex}
                        value={cell}
                        onChange={(e) => {
                          const newRows = [...element.content.rows];
                          newRows[rowIndex][cellIndex] = e.target.value;
                          updateContentElement(element.id, {
                            content: { ...element.content, rows: newRows }
                          });
                        }}
                        placeholder={element.content.headers[cellIndex]}
                      />
                    ))}
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  const newRow = new Array(element.content.headers.length).fill('');
                  const newRows = [...element.content.rows, newRow];
                  updateContentElement(element.id, {
                    content: { ...element.content, rows: newRows }
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Row
              </Button>
            </div>
          </div>
        );

      case 'list':
        return (
          <div className="space-y-3">
            <div>
              <Label>List Type</Label>
              <Select
                value={element.content.type}
                onValueChange={(value) => updateContentElement(element.id, {
                  content: { ...element.content, type: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bullet">Bullet Points</SelectItem>
                  <SelectItem value="numbered">Numbered List</SelectItem>
                  <SelectItem value="dash">Dash List</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>List Items</Label>
              {element.content.items.map((item: string, index: number) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newItems = [...element.content.items];
                      newItems[index] = e.target.value;
                      updateContentElement(element.id, {
                        content: { ...element.content, items: newItems }
                      });
                    }}
                    placeholder={`List item ${index + 1}`}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newItems = element.content.items.filter((_: any, i: number) => i !== index);
                      updateContentElement(element.id, {
                        content: { ...element.content, items: newItems }
                      });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  const newItems = [...element.content.items, ''];
                  updateContentElement(element.id, {
                    content: { ...element.content, items: newItems }
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-4 text-muted-foreground">
            Content editor for {element.type} coming soon...
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            Edit {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
          </h3>
          <p className="text-sm text-muted-foreground">
            Configure the content and layout for this section
          </p>
        </div>
        <Button onClick={onClose}>Done</Button>
      </div>

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="styling">Styling</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          {/* Add Content Element */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Add Content Element</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {contentTypes.map((type) => (
                  <Button
                    key={type.value}
                    variant="outline"
                    onClick={() => addContentElement(type.value as ContentElement['type'])}
                    className="h-auto flex-col gap-2 p-4"
                  >
                    <type.icon className="h-6 w-6" />
                    <span className="text-xs">{type.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Elements List */}
          <div className="space-y-4">
            {contentElements.map((element, index) => (
              <Card key={element.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {element.type.charAt(0).toUpperCase() + element.type.slice(1)}
                      </Badge>
                      <span className="text-sm font-medium">Element {index + 1}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveElement(element.id, 'up')}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveElement(element.id, 'down')}
                        disabled={index === contentElements.length - 1}
                      >
                        ↓
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeContentElement(element.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {renderContentEditor(element)}
                  
                  {/* Basic Styling Options */}
                  <div className="mt-4 pt-4 border-t">
                    <Label className="text-sm font-medium">Styling</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant={element.styling?.alignment === 'left' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateContentElement(element.id, {
                          styling: { ...element.styling, alignment: 'left' }
                        })}
                      >
                        <AlignLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={element.styling?.alignment === 'center' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateContentElement(element.id, {
                          styling: { ...element.styling, alignment: 'center' }
                        })}
                      >
                        <AlignCenter className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={element.styling?.alignment === 'right' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateContentElement(element.id, {
                          styling: { ...element.styling, alignment: 'right' }
                        })}
                      >
                        <AlignRight className="h-4 w-4" />
                      </Button>
                      <div className="w-px h-6 bg-border mx-2" />
                      <Button
                        variant={element.styling?.fontWeight === 'bold' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateContentElement(element.id, {
                          styling: { 
                            ...element.styling, 
                            fontWeight: element.styling?.fontWeight === 'bold' ? 'normal' : 'bold' 
                          }
                        })}
                      >
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={element.styling?.fontStyle === 'italic' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateContentElement(element.id, {
                          styling: { 
                            ...element.styling, 
                            fontStyle: element.styling?.fontStyle === 'italic' ? 'normal' : 'italic' 
                          }
                        })}
                      >
                        <Italic className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {contentElements.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Type className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No content elements added yet.</p>
              <p className="text-sm">Use the buttons above to add headings, text, tables, and more.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Section Layout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Display Variant</Label>
                <Select
                  value={section.variant}
                  onValueChange={(value) => onSectionUpdate({ variant: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="expanded">Expanded</SelectItem>
                    <SelectItem value="timeline">Timeline</SelectItem>
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="list">List</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={section.isVisible}
                  onCheckedChange={(checked) => onSectionUpdate({ isVisible: checked })}
                />
                <Label>Visible in template</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="styling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Section Styling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Background Color</Label>
                <Input
                  type="color"
                  defaultValue="#ffffff"
                  className="w-full h-12"
                />
              </div>
              <div>
                <Label>Border Style</Label>
                <Select defaultValue="none">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Border</SelectItem>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="dashed">Dashed</SelectItem>
                    <SelectItem value="dotted">Dotted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Padding</Label>
                <Select defaultValue="normal">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { SectionConfig, SectionContent } from '@/lib/templateManager';

interface SectionContentEditorProps {
  section: SectionConfig;
  onUpdateSection: (updates: Partial<SectionConfig>) => void;
}

export default function SectionContentEditor({ 
  section, 
  onUpdateSection
}: SectionContentEditorProps) {
  const [sectionContent, setSectionContent] = useState<SectionContent>(
    section.content || { header: '', content: '', items: [] }
  );

  const updateContent = (updates: Partial<SectionContent>) => {
    const newContent = { ...sectionContent, ...updates };
    setSectionContent(newContent);
    onUpdateSection({ content: newContent });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Section Header</Label>
        <Input
          value={sectionContent.header || ''}
          onChange={(e) => updateContent({ header: e.target.value })}
          placeholder="Enter section header"
        />
      </div>
      
      <div>
        <Label>Section Content</Label>
        <Textarea
          value={sectionContent.content || ''}
          onChange={(e) => updateContent({ content: e.target.value })}
          placeholder="Enter section content or description"
          rows={4}
        />
      </div>

      <div>
        <Label>Items</Label>
        <div className="space-y-2">
          {(sectionContent.items || []).map((item, index) => (
            <div key={index} className="border rounded p-3 space-y-2">
              <Input
                value={item.title || ''}
                onChange={(e) => {
                  const newItems = [...(sectionContent.items || [])];
                  newItems[index] = { ...item, title: e.target.value };
                  updateContent({ items: newItems });
                }}
                placeholder="Title"
              />
              <Input
                value={item.subtitle || ''}
                onChange={(e) => {
                  const newItems = [...(sectionContent.items || [])];
                  newItems[index] = { ...item, subtitle: e.target.value };
                  updateContent({ items: newItems });
                }}
                placeholder="Subtitle"
              />
              <Textarea
                value={item.description || ''}
                onChange={(e) => {
                  const newItems = [...(sectionContent.items || [])];
                  newItems[index] = { ...item, description: e.target.value };
                  updateContent({ items: newItems });
                }}
                placeholder="Description"
                rows={2}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={item.date || ''}
                  onChange={(e) => {
                    const newItems = [...(sectionContent.items || [])];
                    newItems[index] = { ...item, date: e.target.value };
                    updateContent({ items: newItems });
                  }}
                  placeholder="Date"
                />
                <Input
                  value={item.location || ''}
                  onChange={(e) => {
                    const newItems = [...(sectionContent.items || [])];
                    newItems[index] = { ...item, location: e.target.value };
                    updateContent({ items: newItems });
                  }}
                  placeholder="Location"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newItems = (sectionContent.items || []).filter((_, i) => i !== index);
                  updateContent({ items: newItems });
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove Item
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => {
              const newItems = [...(sectionContent.items || []), { title: '', subtitle: '', description: '', date: '', location: '' }];
              updateContent({ items: newItems });
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>
    </div>
  );
}
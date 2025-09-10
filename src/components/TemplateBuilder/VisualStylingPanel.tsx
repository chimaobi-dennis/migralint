import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Type, Space } from 'lucide-react';
import { ColorScheme, TypographySettings, SpacingSettings } from '@/lib/templateManager';

interface VisualStylingPanelProps {
  colors: ColorScheme;
  typography: TypographySettings;
  spacing: SpacingSettings;
  onColorsChange: (colors: ColorScheme) => void;
  onTypographyChange: (typography: TypographySettings) => void;
  onSpacingChange: (spacing: SpacingSettings) => void;
}

const fontFamilies = [
  'Inter',
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Source Sans Pro',
  'Poppins'
];

const fontSizes = [
  '0.75rem', '0.875rem', '1rem', '1.125rem', '1.25rem', '1.5rem', '1.75rem', '2rem'
];

const fontWeights = [
  '300', '400', '500', '600', '700', '800'
];

const spacingValues = [
  '0.25rem', '0.5rem', '0.75rem', '1rem', '1.25rem', '1.5rem', '2rem', '2.5rem', '3rem'
];

export default function VisualStylingPanel({
  colors,
  typography,
  spacing,
  onColorsChange,
  onTypographyChange,
  onSpacingChange
}: VisualStylingPanelProps) {
  
  const handleColorChange = (key: keyof ColorScheme, value: string) => {
    onColorsChange({ ...colors, [key]: value });
  };

  const handleTypographyChange = (
    section: 'heading' | 'body' | 'small',
    property: string,
    value: string
  ) => {
    onTypographyChange({
      ...typography,
      [section]: {
        ...typography[section],
        [property]: value
      }
    });
  };

  const handleSpacingChange = (key: keyof SpacingSettings, value: string) => {
    onSpacingChange({ ...spacing, [key]: value });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Typography
          </TabsTrigger>
          <TabsTrigger value="spacing" className="flex items-center gap-2">
            <Space className="h-4 w-4" />
            Spacing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Color Scheme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(colors).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={value.startsWith('hsl') ? '#000000' : value}
                      onChange={(e) => handleColorChange(key as keyof ColorScheme, e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={value}
                      onChange={(e) => handleColorChange(key as keyof ColorScheme, e.target.value)}
                      placeholder="hsl(220, 14%, 20%)"
                      className="flex-1"
                    />
                  </div>
                  <div 
                    className="w-full h-8 rounded border"
                    style={{ backgroundColor: value.startsWith('hsl') ? value : value }}
                  />
                </div>
              ))}
              
              {/* Color Presets */}
              <div className="pt-4 border-t">
                <Label className="text-sm font-medium">Quick Presets</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <button
                    onClick={() => onColorsChange({
                      primary: 'hsl(220, 14%, 20%)',
                      secondary: 'hsl(220, 9%, 46%)',
                      accent: 'hsl(221, 83%, 53%)',
                      text: 'hsl(220, 14%, 8%)',
                      background: 'hsl(0, 0%, 100%)',
                      muted: 'hsl(220, 14%, 96%)'
                    })}
                    className="p-2 rounded border hover:border-primary"
                  >
                    <div className="flex gap-1">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(220, 14%, 20%)' }} />
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(221, 83%, 53%)' }} />
                    </div>
                    <span className="text-xs">Professional</span>
                  </button>
                  
                  <button
                    onClick={() => onColorsChange({
                      primary: 'hsl(0, 0%, 0%)',
                      secondary: 'hsl(0, 0%, 40%)',
                      accent: 'hsl(0, 0%, 20%)',
                      text: 'hsl(0, 0%, 0%)',
                      background: 'hsl(0, 0%, 100%)',
                      muted: 'hsl(0, 0%, 95%)'
                    })}
                    className="p-2 rounded border hover:border-primary"
                  >
                    <div className="flex gap-1">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(0, 0%, 0%)' }} />
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(0, 0%, 40%)' }} />
                    </div>
                    <span className="text-xs">Minimalist</span>
                  </button>
                  
                  <button
                    onClick={() => onColorsChange({
                      primary: 'hsl(210, 40%, 20%)',
                      secondary: 'hsl(215, 25%, 50%)',
                      accent: 'hsl(195, 100%, 40%)',
                      text: 'hsl(210, 40%, 15%)',
                      background: 'hsl(0, 0%, 100%)',
                      muted: 'hsl(210, 40%, 98%)'
                    })}
                    className="p-2 rounded border hover:border-primary"
                  >
                    <div className="flex gap-1">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(210, 40%, 20%)' }} />
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(195, 100%, 40%)' }} />
                    </div>
                    <span className="text-xs">Corporate</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Typography Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Heading Typography */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Headings</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Font Family</Label>
                    <Select
                      value={typography.heading.fontFamily}
                      onValueChange={(value) => handleTypographyChange('heading', 'fontFamily', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontFamilies.map((font) => (
                          <SelectItem key={font} value={font}>
                            <span style={{ fontFamily: font }}>{font}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Font Size</Label>
                    <Select
                      value={typography.heading.fontSize}
                      onValueChange={(value) => handleTypographyChange('heading', 'fontSize', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontSizes.map((size) => (
                          <SelectItem key={size} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Font Weight</Label>
                    <Select
                      value={typography.heading.fontWeight}
                      onValueChange={(value) => handleTypographyChange('heading', 'fontWeight', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontWeights.map((weight) => (
                          <SelectItem key={weight} value={weight}>
                            <span style={{ fontWeight: weight }}>{weight}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Line Height</Label>
                    <Input
                      value={typography.heading.lineHeight}
                      onChange={(e) => handleTypographyChange('heading', 'lineHeight', e.target.value)}
                      placeholder="1.2"
                    />
                  </div>
                </div>
              </div>

              {/* Body Typography */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Body Text</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Font Family</Label>
                    <Select
                      value={typography.body.fontFamily}
                      onValueChange={(value) => handleTypographyChange('body', 'fontFamily', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontFamilies.map((font) => (
                          <SelectItem key={font} value={font}>
                            <span style={{ fontFamily: font }}>{font}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Font Size</Label>
                    <Select
                      value={typography.body.fontSize}
                      onValueChange={(value) => handleTypographyChange('body', 'fontSize', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontSizes.map((size) => (
                          <SelectItem key={size} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Font Weight</Label>
                    <Select
                      value={typography.body.fontWeight}
                      onValueChange={(value) => handleTypographyChange('body', 'fontWeight', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontWeights.map((weight) => (
                          <SelectItem key={weight} value={weight}>
                            <span style={{ fontWeight: weight }}>{weight}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Line Height</Label>
                    <Input
                      value={typography.body.lineHeight}
                      onChange={(e) => handleTypographyChange('body', 'lineHeight', e.target.value)}
                      placeholder="1.5"
                    />
                  </div>
                </div>
              </div>

              {/* Small Text Typography */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Small Text</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Font Size</Label>
                    <Select
                      value={typography.small.fontSize}
                      onValueChange={(value) => handleTypographyChange('small', 'fontSize', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontSizes.map((size) => (
                          <SelectItem key={size} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Font Weight</Label>
                    <Select
                      value={typography.small.fontWeight}
                      onValueChange={(value) => handleTypographyChange('small', 'fontWeight', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontWeights.map((weight) => (
                          <SelectItem key={weight} value={weight}>
                            <span style={{ fontWeight: weight }}>{weight}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spacing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Spacing Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(spacing).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label className="capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                  <Select
                    value={value}
                    onValueChange={(newValue) => handleSpacingChange(key as keyof SpacingSettings, newValue)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {spacingValues.map((spacing) => (
                        <SelectItem key={spacing} value={spacing}>{spacing}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
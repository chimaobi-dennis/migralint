import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Template {
  id?: string;
  name: string;
  description?: string;
  type: string;
  is_premium: boolean;
  is_public: boolean;
  structure: any;
  styling: any;
  content: any;
  metadata: any;
  created_at?: string;
  updated_at?: string;
}

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load templates from Supabase
  const loadTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading templates:', error);
        toast({
          title: "Error loading templates",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setTemplates(data || []);
    } catch (err) {
      console.error('Error loading templates:', err);
      toast({
        title: "Error loading templates",
        description: "Failed to load templates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create new template
  const createTemplate = async (template: Omit<Template, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .insert([template])
        .select()
        .single();

      if (error) {
        console.error('Error creating template:', error);
        toast({
          title: "Error creating template",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      setTemplates(prev => [data, ...prev]);
      toast({
        title: "Template created",
        description: "Template has been created successfully",
      });
      
      return data;
    } catch (err) {
      console.error('Error creating template:', err);
      toast({
        title: "Error creating template",
        description: "Failed to create template",
        variant: "destructive",
      });
      return null;
    }
  };

  // Update template
  const updateTemplate = async (id: string, updates: Partial<Template>) => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating template:', error);
        toast({
          title: "Error updating template",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      setTemplates(prev => prev.map(t => t.id === id ? data : t));
      toast({
        title: "Template updated",
        description: "Template has been updated successfully",
      });
      
      return data;
    } catch (err) {
      console.error('Error updating template:', err);
      toast({
        title: "Error updating template",
        description: "Failed to update template",
        variant: "destructive",
      });
      return null;
    }
  };

  // Delete template
  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting template:', error);
        toast({
          title: "Error deleting template",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      setTemplates(prev => prev.filter(t => t.id !== id));
      toast({
        title: "Template deleted",
        description: "Template has been deleted successfully",
      });
      
      return true;
    } catch (err) {
      console.error('Error deleting template:', err);
      toast({
        title: "Error deleting template",
        description: "Failed to delete template",
        variant: "destructive",
      });
      return false;
    }
  };

  // Get template categories
  const getCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('template_categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error loading categories:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error loading categories:', err);
      return [];
    }
  };

  useEffect(() => {
    loadTemplates();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('templates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'templates'
        },
        () => {
          loadTemplates();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    templates,
    loading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getCategories,
    refreshTemplates: loadTemplates
  };
}
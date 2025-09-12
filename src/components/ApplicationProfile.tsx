import { useEffect, useState, useRef } from 'react';
import { ChevronDown, ChevronUp, Edit, Trash2, Plus, Check, X, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
const userId = 1; // Development user ID


interface Profile {
  id: number;
  user_id: number;
  degree: string;
  origin_country: string;
  university_country: string;
  fields: string;
  area_of_study: string;
  language: string;
  language_test_type: string;
  language_test_score: number;
  has_language_test: number;
  work_experience: string;
  fee_preference: string;
  created_at: string;
  updated_at: string;
}

interface ApplicationProfileProps {
  onAddNew: () => void;
  onStartApplication: (id: number) => void;
}

export const ApplicationProfile = ({ onAddNew, onStartApplication }: ApplicationProfileProps) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Profile>>({});

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        
        // Fetch real student profiles from Supabase
        const { data, error } = await (supabase as any)
          .from('student_profile')
          .select('*')
          .eq('user_id', userId);

        if (error) {
          console.error('Error fetching profiles:', error);
          setError(error.message);
          return;
        }

        const profilesData: Profile[] = (data || []).map((row: any) => ({
          id: row.id,
          user_id: row.user_id,
          degree: row.degree || '',
          origin_country: row.origin_country || '',
          university_country: row.university_country || '',
          fields: row.fields || '',
          area_of_study: row.area_of_study || '',
          language: row.language || '',
          language_test_type: row.language_test_type || '',
          language_test_score: row.language_test_score || 0,
          has_language_test: row.has_language_test || 0,
          work_experience: row.work_experience || '',
          fee_preference: row.fee_preference || '',
          created_at: row.created_at,
          updated_at: row.updated_at,
        }));

        setProfiles(profilesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching profiles:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load profiles from database';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
    setEditingId(null);
  };

  const startEditing = (app: Profile) => {
    setEditForm({ ...app });
    setEditingId(app.id);
  };

  const handleEditChange = (field: keyof Profile, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const saveEdit = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/student-profiles/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Update the local state with the edited profile
      setProfiles(profiles.map(profile =>
        profile.id === id ? { ...profile, ...editForm } : profile
      ));

      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const deleteApplication = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this profile?')) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/student-profiles/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete profile');
      }

      // Remove the deleted profile from the local state
      setProfiles(profiles.filter(profile => profile.id !== id));
      toast.success('Profile deleted successfully');
    } catch (err) {
      console.error('Error deleting profile:', err);
      toast.error('Failed to delete profile');
    }
  };


  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString();
  };

  // if (loading) {
  //   return (
  //     <div className="h-full flex items-center justify-center">
  //       <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Application Profiles</h3>
        <Button variant="outline" size="sm" onClick={onAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          New Profile
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="h-6 bg-gray-200 animate-pulse rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4 mt-4"></div>
              </div>
            ))}
          </div>
        ) : profiles.length > 0 ? profiles.map((app) => (
          <div key={app.id} className="border rounded-lg overflow-hidden">
            <div
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
              onClick={() => toggleExpand(app.id)}
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">
                  {app.degree || 'Degree'} in {app.fields || 'Fields'}
                </h4>
                <p className="text-sm text-gray-500 truncate">{app.origin_country || 'Origin Country'} - {app.area_of_study || 'Area of Study'}</p>
                <div className="mt-1 flex items-center text-sm text-gray-600">
                  <span>Profile created</span>
                  {app.university_country && (
                    <>
                      <span className="mx-1">•</span>
                      <span>{app.university_country}</span>
                    </>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 text-sm w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    const params = new URLSearchParams({
                      profileID: app.id.toString(),
                      Degree: app.degree || '',
                      Field: app.fields || '',
                      Country: app.origin_country || '',
                      AreaOfStudy: app.area_of_study || ''
                    });
                    window.location.href = `start-application?${params.toString()}`;
                  }}
                >
                  Start Application <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="ml-2">
                {expandedId === app.id ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>

            {expandedId === app.id && (
              <div className="p-4 border-t bg-gray-50">

                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">
                      Language Test: {app.language_test_type || 'Not specified'}
                    </p>
                    <p className="text-gray-600 mt-1">
                      Score: {app.language_test_score || 'Not provided'} | Experience: {app.work_experience || 'Not specified'}
                    </p>
                  </div>
                  {/* //update here letter */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(app);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>

              </div>
            )}
          </div>
        )) : (
          <div className="flex-1 flex items-center justify-center h-full">
            <p className="text-gray-500">No profiles found</p>
          </div>
        )}
      </div>
    </div>
  );
};
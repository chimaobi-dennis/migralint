import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, GraduationCap, MapPin, DollarSign, Clock, BookOpen, X } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface MatchingResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StudentProfile {
  degree: string;
  field_of_study: string;
  area_of_study: string;
  desired_degree_type: string;
  origin_country: string;
  language_test_type: string;
  language_test_score: number;
  work_experience: string;
  fee_preference: string;
  study_envs: any;
  interest_keywords: any;
  recommended_programs: any;
  recommended_percentage: any;
}

interface Program {
  id: number;
  course_name: string;
  university_name: string;
  city: string;
  country: string;
  level: string;
  total_tuition: number;
  currency: string;
  field_of_study: string;
  duration: string;
}

export const MatchingResultsModal = ({ isOpen, onClose }: MatchingResultsModalProps) => {
  const { user } = useAuth();
  const [isMatching, setIsMatching] = useState(true);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [matchPercentages, setMatchPercentages] = useState<Record<number, number>>({});

  useEffect(() => {
    if (isOpen && user) {
      fetchProfileAndPrograms();
    }
  }, [isOpen, user]);

  const fetchProfileAndPrograms = async () => {
    if (!user) return;

    try {
      // Get bigint user ID
      const { data: bigintId, error: idError } = await supabase.rpc('get_user_bigint_id', { auth_uuid: user.id });
      
      if (idError) {
        console.error('Error getting bigint ID:', idError);
        setIsMatching(false);
        return;
      }

      // Initial fetch
      const fetchData = async () => {
        const { data: profileData, error: profileError } = await supabase
          .from('student_profile')
          .select('*')
          .eq('user_id', bigintId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          return null;
        }

        return profileData;
      };

      // Do initial fetch
      const initialProfile = await fetchData();
      
      if (initialProfile) {
        setProfile(initialProfile as any);
        
        const recPrograms = Array.isArray(initialProfile.recommended_programs) ? initialProfile.recommended_programs : [];
        const recPercentages = Array.isArray(initialProfile.recommended_percentage) ? initialProfile.recommended_percentage : [];
        
        // If we already have recommendations, show them immediately
        if (recPrograms.length > 0) {
          setIsMatching(false);
          
          // Fetch program details - convert to numbers
          const programIds = recPrograms.map((id: any) => Number(id)).filter(id => !isNaN(id));
          const { data: programsData } = await supabase
            .from('programs')
            .select('*')
            .in('id', programIds);

          if (programsData) {
            setPrograms(programsData);
            
            // Create match percentage map
            const percentageMap: Record<number, number> = {};
            programIds.forEach((id: number, index: number) => {
              percentageMap[id] = Number(recPercentages[index] || 0);
            });
            setMatchPercentages(percentageMap);
          }
          
          return; // Don't start polling if we already have data
        }
      }
      
      // Poll for profile updates if we don't have recommendations yet
      const pollInterval = setInterval(async () => {
        const updatedProfile = await fetchData();

        if (updatedProfile) {
          setProfile(updatedProfile as any);
          
          // Check if matching is complete
          const recPrograms = Array.isArray(updatedProfile.recommended_programs) ? updatedProfile.recommended_programs : [];
          const recPercentages = Array.isArray(updatedProfile.recommended_percentage) ? updatedProfile.recommended_percentage : [];
          
          if (recPrograms.length > 0) {
            setIsMatching(false);
            clearInterval(pollInterval);
            
            // Fetch program details - convert to numbers
            const programIds = recPrograms.map((id: any) => Number(id)).filter(id => !isNaN(id));
            const { data: programsData } = await supabase
              .from('programs')
              .select('*')
              .in('id', programIds);

            if (programsData) {
              setPrograms(programsData);
              
              // Create match percentage map
              const percentageMap: Record<number, number> = {};
              programIds.forEach((id: number, index: number) => {
                percentageMap[id] = Number(recPercentages[index] || 0);
              });
              setMatchPercentages(percentageMap);
            }
          }
        }
      }, 2000);

      // Stop polling after 60 seconds
      setTimeout(() => {
        clearInterval(pollInterval);
        if (isMatching) {
          setIsMatching(false);
        }
      }, 60000);

      return () => clearInterval(pollInterval);
    } catch (error) {
      console.error('Error fetching profile and programs:', error);
      setIsMatching(false);
    }
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 85) return 'bg-emerald-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 65) return 'bg-amber-500';
    return 'bg-gray-500';
  };

  const getMatchLabel = (percentage: number) => {
    if (percentage >= 85) return 'Excellent Match';
    if (percentage >= 75) return 'Great Match';
    if (percentage >= 65) return 'Good Match';
    return 'Fair Match';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[95vh] overflow-hidden p-0 border-0">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white p-8">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Sparkles className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Your Perfect Program Matches</h1>
              <p className="text-blue-100 text-sm mt-1">
                AI-powered recommendations based on your profile
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(100%-8rem)] overflow-hidden">
          {/* Left Side - Profile Summary */}
          <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              Your Profile
            </h2>
            
            {profile && (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Current Education</p>
                  <p className="text-sm font-medium text-gray-900">{profile.degree}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 mb-1">Field of Study</p>
                  <p className="text-sm font-medium text-gray-900">{profile.field_of_study}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Desired Degree</p>
                  <p className="text-sm font-medium text-gray-900">{profile.desired_degree_type}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Language Test</p>
                  <p className="text-sm font-medium text-gray-900">
                    {profile.language_test_type}
                    {profile.language_test_score > 0 && `: ${profile.language_test_score}`}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Work Experience</p>
                  <p className="text-sm font-medium text-gray-900">{profile.work_experience}</p>
                </div>

                {profile.interest_keywords && Array.isArray(profile.interest_keywords) && profile.interest_keywords.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Interests</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.interest_keywords.map((keyword: any, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {String(keyword)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-500 mb-1">Budget Preference</p>
                  <p className="text-sm font-medium text-gray-900">{profile.fee_preference}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Programs */}
          <div className="flex-1 overflow-y-auto p-6">
            {isMatching ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <Loader2 className="h-12 w-12 text-white animate-spin" />
                  </div>
                  <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-yellow-400 animate-bounce" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Finding Your Perfect Matches
                </h3>
                <p className="text-gray-600 mb-2">
                  Our AI is analyzing 1000+ programs to find the best matches for you...
                </p>
                <p className="text-sm text-gray-500">
                  This may take up to 60 seconds
                </p>
              </div>
            ) : programs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-8">
                <BookOpen className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No Matches Yet
                </h3>
                <p className="text-gray-600">
                  We're still processing your profile. Please check back in a moment.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {programs.length} Programs Matched
                  </h2>
                  <p className="text-gray-600">
                    Sorted by match percentage - Best matches first
                  </p>
                </div>

                <div className="grid gap-4">
                  {programs
                    .sort((a, b) => (matchPercentages[b.id] || 0) - (matchPercentages[a.id] || 0))
                    .map((program) => {
                      const matchPercentage = matchPercentages[program.id] || 0;
                      return (
                        <Card key={program.id} className="p-6 hover:shadow-lg transition-shadow">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-900 mb-1">
                                {program.course_name}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                {program.university_name}
                              </p>
                            </div>
                            <div className="text-right ml-4">
                              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${getMatchColor(matchPercentage)} text-white text-sm font-semibold`}>
                                <Sparkles className="h-4 w-4" />
                                {matchPercentage}%
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {getMatchLabel(matchPercentage)}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="h-4 w-4" />
                              {program.city}, {program.country}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <GraduationCap className="h-4 w-4" />
                              {program.level}
                            </div>
                            {program.duration && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="h-4 w-4" />
                                {program.duration}
                              </div>
                            )}
                            {program.total_tuition > 0 && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <DollarSign className="h-4 w-4" />
                                {program.total_tuition.toLocaleString()} {program.currency}
                              </div>
                            )}
                          </div>

                          <div className="mt-4">
                            <Badge variant="outline" className="text-xs">
                              {program.field_of_study}
                            </Badge>
                          </div>
                        </Card>
                      );
                    })}
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
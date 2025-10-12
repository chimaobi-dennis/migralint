import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, GraduationCap, MapPin, DollarSign, Clock, BookOpen, X, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  const [profileOpen, setProfileOpen] = useState(false);

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
      <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full overflow-hidden p-0 border-0 gap-0 [&>button]:hidden">
        <div className="flex flex-col h-full w-full overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-4 sm:px-6 lg:px-8 py-4 sm:py-6 shadow-lg">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/90 hover:text-white hover:bg-white/20 rounded-full transition-all"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 max-w-7xl mx-auto pr-12">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-300" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Your Perfect Matches</h1>
                <p className="text-blue-100 text-xs sm:text-sm mt-1">
                  AI-powered program recommendations tailored for you
                </p>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Profile Sidebar - Collapsible on Mobile */}
            <div className="lg:w-80 xl:w-96 bg-white/80 backdrop-blur-sm border-b lg:border-b-0 lg:border-r border-gray-200 flex-shrink-0">
              <div className="lg:h-full lg:overflow-y-auto">
                {/* Mobile Collapsible Header */}
                <Collapsible open={profileOpen} onOpenChange={setProfileOpen} className="lg:hidden">
                  <CollapsibleTrigger asChild>
                    <button className="w-full px-4 py-3 flex items-center justify-between bg-white border-b hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-gray-900">Your Profile</span>
                      </div>
                      {profileOpen ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 py-4 space-y-4 bg-white max-h-[50vh] overflow-y-auto">
                    {profile && <ProfileContent profile={profile} />}
                  </CollapsibleContent>
                </Collapsible>

                {/* Desktop Always-Visible Profile */}
                <div className="hidden lg:block p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                    Your Profile
                  </h2>
                  {profile && <ProfileContent profile={profile} />}
                </div>
              </div>
            </div>

            {/* Programs Area */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
                {isMatching ? (
                  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                    <div className="relative mb-8">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse shadow-xl">
                        <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-white animate-spin" />
                      </div>
                      <Sparkles className="absolute -top-1 -right-1 h-6 w-6 sm:h-8 sm:w-8 text-yellow-400 animate-bounce" />
                      <TrendingUp className="absolute -bottom-1 -left-1 h-6 w-6 sm:h-8 sm:w-8 text-green-400 animate-pulse" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                      Finding Your Perfect Matches
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base mb-2 max-w-md">
                      Our AI is analyzing 1000+ programs worldwide to find the best fits for your profile...
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/50 rounded-full px-4 py-2 mt-4">
                      <Clock className="h-4 w-4" />
                      <span>This may take up to 60 seconds</span>
                    </div>
                  </div>
                ) : programs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <BookOpen className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      No Matches Yet
                    </h3>
                    <p className="text-gray-600 max-w-md">
                      We're still processing your profile. Please check back in a moment.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-6 sm:mb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                          <span className="text-xl font-bold text-white">{programs.length}</span>
                        </div>
                        <div>
                          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                            Programs Matched
                          </h2>
                          <p className="text-sm text-gray-600">
                            Sorted by match score - Best fits first
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:gap-5">
                      {programs
                        .sort((a, b) => (matchPercentages[b.id] || 0) - (matchPercentages[a.id] || 0))
                        .map((program) => {
                          const matchPercentage = matchPercentages[program.id] || 0;
                          return (
                            <Card key={program.id} className="group p-4 sm:p-6 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 bg-white/90 backdrop-blur-sm border-2 hover:border-blue-200">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                <div className="flex-1">
                                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                    {program.course_name}
                                  </h3>
                                  <p className="text-sm text-gray-600 font-medium">
                                    {program.university_name}
                                  </p>
                                </div>
                                <div className="flex-shrink-0">
                                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl ${getMatchColor(matchPercentage)} text-white font-bold shadow-lg`}>
                                    <Sparkles className="h-4 w-4" />
                                    <span className="text-lg">{matchPercentage}%</span>
                                  </div>
                                  <p className="text-xs text-center text-gray-500 mt-1.5 font-medium">
                                    {getMatchLabel(matchPercentage)}
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                                <div className="flex items-center gap-2 text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                                  <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                  <span className="truncate">{program.city}, {program.country}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                                  <GraduationCap className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                                  <span>{program.level}</span>
                                </div>
                                {program.duration && (
                                  <div className="flex items-center gap-2 text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                                    <Clock className="h-4 w-4 text-purple-600 flex-shrink-0" />
                                    <span>{program.duration}</span>
                                  </div>
                                )}
                                {program.total_tuition > 0 && (
                                  <div className="flex items-center gap-2 text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                                    <DollarSign className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                                    <span className="truncate">{program.total_tuition.toLocaleString()} {program.currency}</span>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center justify-between">
                                <Badge variant="secondary" className="text-xs font-medium">
                                  {program.field_of_study}
                                </Badge>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-xs hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors"
                                >
                                  View Details
                                </Button>
                              </div>
                            </Card>
                          );
                        })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Profile Content Component
const ProfileContent = ({ profile }: { profile: StudentProfile }) => (
  <div className="space-y-4">
    <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
      <p className="text-xs text-blue-600 font-medium mb-1">Current Education</p>
      <p className="text-sm font-semibold text-gray-900">{profile.degree}</p>
    </div>
    
    <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
      <p className="text-xs text-purple-600 font-medium mb-1">Field of Study</p>
      <p className="text-sm font-semibold text-gray-900">{profile.field_of_study}</p>
    </div>

    <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
      <p className="text-xs text-emerald-600 font-medium mb-1">Desired Degree</p>
      <p className="text-sm font-semibold text-gray-900">{profile.desired_degree_type}</p>
    </div>

    <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-100">
      <p className="text-xs text-amber-600 font-medium mb-1">Language Test</p>
      <p className="text-sm font-semibold text-gray-900">
        {profile.language_test_type}
        {profile.language_test_score > 0 && ` • ${profile.language_test_score}`}
      </p>
    </div>

    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
      <p className="text-xs text-gray-600 font-medium mb-1">Work Experience</p>
      <p className="text-sm font-semibold text-gray-900">{profile.work_experience}</p>
    </div>

    {profile.interest_keywords && Array.isArray(profile.interest_keywords) && profile.interest_keywords.length > 0 && (
      <div>
        <p className="text-xs text-gray-600 font-medium mb-2">Interests</p>
        <div className="flex flex-wrap gap-1.5">
          {profile.interest_keywords.map((keyword: any, idx: number) => (
            <Badge key={idx} variant="secondary" className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200">
              {String(keyword)}
            </Badge>
          ))}
        </div>
      </div>
    )}

    <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
      <p className="text-xs text-green-600 font-medium mb-1">Budget Preference</p>
      <p className="text-sm font-semibold text-gray-900">{profile.fee_preference}</p>
    </div>
  </div>
);
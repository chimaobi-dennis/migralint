import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles, Plane, Users, GraduationCap, MessageSquare, Zap, Shield, Heart, Globe, BookOpen, Target, HandHeart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthModal } from '@/components/AuthModal';
import { ModernStudentProfileModal } from '@/components/ModernStudentProfileModal';
import { MatchingResultsModal } from '@/components/MatchingResultsModal';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import studentHero from '@/assets/student-hero.jpg';

export const LandingPage = () => {
  const { user, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [matchingModalOpen, setMatchingModalOpen] = useState(false);

  const handleGetStarted = async () => {
    if (user) {
      // Rely on RLS to return only the current user's profiles
      const { data: profile } = await supabase
        .from('student_profile')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (profile) {
        setMatchingModalOpen(true);
      } else {
        setProfileModalOpen(true);
      }
    } else {
      setAuthModalOpen(true);
    }
  };

  const handleAuthAction = async () => {
    if (user) {
      await signOut();
    } else {
      setAuthModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-white">Uniplanr</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Home</a>
              <a href="#programs" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Programs</a>
              <a href="#community" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Community</a>
              <a href="#universities" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">For Universities</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Contact</a>
              <Button 
                variant="ghost" 
                className="text-gray-300 hover:text-white hover:bg-white/10 text-sm font-medium"
                onClick={handleAuthAction}
              >
                {user ? 'Logout' : 'Login'}
              </Button>
              <Button 
                className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black hover:from-yellow-300 hover:to-orange-300 font-semibold px-6"
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Navigation */}
            <div className="flex md:hidden items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-gray-300 hover:text-white hover:bg-white/10 text-sm font-medium"
                onClick={handleAuthAction}
              >
                {user ? 'Logout' : 'Login'}
              </Button>
              <Button 
                size="sm"
                className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black hover:from-yellow-300 hover:to-orange-300 font-semibold px-4"
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  <span className="block">Uniplanr – Your</span>
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Global Study</span>
                  <span className="block">Lifetool</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  From first thought to final graduation, Uniplanr guides you every step of your study abroad journey.
                </p>
              </div>

              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                onClick={() => setAuthModalOpen(true)}
              >
                Try It Now
              </Button>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">Built by international students like you</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">Your journey, supported from day one</span>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image with Chat Bubbles */}
            <div className="relative">
              <div className="relative">
                <img 
                  src={studentHero} 
                  alt="Happy international student using Uniplanr" 
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
                
                {/* Chat Bubbles Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* First Chat Bubble */}
                  <div className="absolute top-8 left-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 max-w-xs shadow-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-600">Alex</span>
                    </div>
                    <p className="text-sm text-gray-800">Hey! Just arrived my dream study destination and already settling in.</p>
                  </div>

                  {/* Second Chat Bubble */}
                  <div className="absolute top-32 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-4 max-w-xs shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-white rounded-full"></div>
                      <span className="text-xs font-medium text-gray-800">Sarah</span>
                    </div>
                    <p className="text-sm text-gray-800 font-medium">Oh wow, that seemed quick and easy! How'd you manage that?</p>
                  </div>

                  {/* Third Chat Bubble */}
                  <div className="absolute bottom-8 left-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 max-w-xs shadow-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-600">Alex</span>
                    </div>
                    <p className="text-sm text-gray-800">Yeah, it was effortless! With Uniplanr, I barely had to stress, it handled everything smoothly</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">
              Powered by AI. Built by Students. For Students.
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your Journey Abroad Starts with Clarity, Confidence & Care
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="h-8 w-8" />,
                title: "AI-Powered Matching",
                description: "Our intelligent system matches you with the perfect programs based on your profile and aspirations."
              },
              {
                icon: <Plane className="h-8 w-8" />,
                title: "Visa & Travel Support", 
                description: "Complete guidance through visa applications, travel planning, and pre-departure preparation."
              },
              {
                icon: <Heart className="h-8 w-8" />,
                title: "Lifelong Guidance",
                description: "From first inquiry to graduation and beyond - we're with you every step of the way."
              }
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Study Abroad Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <div className="flex items-center justify-center gap-2 text-4xl">
              <span>✈️ Dreaming of</span>
            </div>
            <h2 className="text-5xl font-bold text-gray-900">studying abroad?</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Whether you're just starting to explore your options or already overwhelmed by applications 
              and paperwork — we've got you. Uniplanr will guide you every step of the way, from 
              admission, student life, beyond.
            </p>
          </div>
        </div>
      </section>

      {/* Lifetool Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">
              Uniplanr is Not Just a Consultancy — It is Your Lifetool
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unlike traditional agents that leave you at the airport, Uniplanr stays by your 
              side from day one — and every day after.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Target className="h-8 w-8" />,
                title: "Personalized Journeys",
                description: "Tailored program and country recommendations based on your personality, interests, and goals."
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Stress-Free Applications",
                description: "Never miss a step — from SOPs and visas to documentation and deadlines, Uniplanr got it sorted."
              },
              {
                icon: <HandHeart className="h-8 w-8" />,
                title: "Real Integration Support",
                description: "We help you adapt to your new life — language, accommodation, local culture, and more."
              },
              {
                icon: <Globe className="h-8 w-8" />,
                title: "Built for Global Students",
                description: "Whether you're in Lagos, Lahore, or London — our platform speaks your language and understands your fears."
              }
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-4xl mx-auto">
              <blockquote className="text-xl italic text-gray-700 mb-4">
                "Uniplanr was born from our experience — solving study abroad stress with clarity and full support."
              </blockquote>
              <div className="font-semibold text-gray-900">Chimaobi & Li, Founders</div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Support Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold">One Tool. Global Support.</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Helping students from 100+ countries connect, apply & thrive abroad.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="text-5xl font-bold">100+</div>
              <div className="text-xl font-semibold">Countries</div>
              <div className="text-blue-200">Worldwide Student Support</div>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-bold">50K+</div>
              <div className="text-xl font-semibold">Students</div>
              <div className="text-blue-200">Successfully Guided</div>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-bold">500+</div>
              <div className="text-xl font-semibold">Universities</div>
              <div className="text-blue-200">Partner Institutions</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to start your journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have found their path to global education with Uniplanr.
          </p>
          <Button 
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-50 font-semibold px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            onClick={() => setAuthModalOpen(true)}
          >
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold">Uniplanr</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Your comprehensive platform for international education planning and support.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Solutions</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Program Search</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Application Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Visa Guidance</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Student Life</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Uniplanr. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      
      {/* Modern Student Profile Modal */}
      <ModernStudentProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
      
      {/* Matching Results Modal */}
      <MatchingResultsModal isOpen={matchingModalOpen} onClose={() => setMatchingModalOpen(false)} />
    </div>
  );
};

export default LandingPage;

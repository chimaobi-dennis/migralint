import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles, Plane, Users, GraduationCap, MessageSquare, Zap, Shield, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-yellow-400" />
              <span className="ml-2 text-xl font-bold">Uniplanr</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a>
              <a href="#programs" className="text-gray-300 hover:text-white transition-colors">Programs</a>
              <a href="#community" className="text-gray-300 hover:text-white transition-colors">Community</a>
              <a href="#universities" className="text-gray-300 hover:text-white transition-colors">For Universities</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-slate-800">Login</Button>
              <Link to="/app">
                <Button className="bg-yellow-400 text-slate-900 hover:bg-yellow-300 font-medium">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Uniplanr – Your</span>{' '}
                  <span className="block text-blue-600 xl:inline">Global Study</span>{' '}
                  <span className="block xl:inline">Lifetool</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  From first thought to final graduation, Uniplanr guides you every step of your study abroad journey.
                </p>
                
                {/* CTA Button */}
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link to="/app">
                      <Button className="w-full flex items-center justify-center px-8 py-3 text-base font-medium bg-blue-600 text-white hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                        Try It Now
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Feature Points */}
                <div className="mt-6 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Built by international students like you
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Your journey, supported from day one
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        
        {/* Hero Image */}
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-r from-blue-400 to-purple-500 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <div className="text-white text-center">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-80" />
              <div className="space-y-2">
                <div className="bg-white/20 backdrop-blur rounded-lg p-3 max-w-xs">
                  <p className="text-sm">Hey! Just arrived my dream study destination and already settling in.</p>
                </div>
                <div className="bg-yellow-400 text-slate-900 rounded-lg p-3 max-w-xs ml-8">
                  <p className="text-sm">Oh wow, that seemed quick and easy! How'd you manage that?</p>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg p-3 max-w-xs">
                  <p className="text-sm">Yeah, it was effortless! With Uniplanr, I barely had to stress, it handled everything smoothly</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Powered by AI. Built by Students. For Students.
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Your Journey Abroad Starts with Clarity, Confidence & Care
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {[
                {
                  icon: <Sparkles className="h-6 w-6" />,
                  title: "AI-Powered Matching",
                  description: "Our intelligent system matches you with the perfect programs based on your profile and aspirations."
                },
                {
                  icon: <Plane className="h-6 w-6" />,
                  title: "Visa & Travel Support",
                  description: "Complete guidance through visa applications, travel planning, and pre-departure preparation."
                },
                {
                  icon: <Heart className="h-6 w-6" />,
                  title: "Lifelong Guidance",
                  description: "From first inquiry to graduation and beyond - we're with you every step of the way."
                }
              ].map((feature, index) => (
                <div key={index} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    {feature.icon}
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.title}</p>
                  <p className="mt-2 ml-16 text-base text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Journey Section */}
      <div className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Plane className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              ✈️ Dreaming of studying abroad?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
              Whether you're just starting to explore your options or already overwhelmed by applications 
              and paperwork — we've got you. Uniplanr will guide you every step of the way, from 
              admission, student life, beyond.
            </p>
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Uniplanr is Not Just a Consultancy — It is Your Lifetool
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Users className="h-8 w-8" />,
                  title: "Community Support",
                  description: "Connect with thousands of students who share your dreams and challenges."
                },
                {
                  icon: <Shield className="h-8 w-8" />,
                  title: "Trusted Guidance",
                  description: "Expert advice from those who've successfully navigated the journey before you."
                },
                {
                  icon: <Zap className="h-8 w-8" />,
                  title: "Smart Tools",
                  description: "Cutting-edge technology to streamline every aspect of your application process."
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to start your journey?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            Join thousands of students who have found their path to global education with Uniplanr.
          </p>
          <Link to="/app">
            <Button className="mt-8 bg-white text-blue-600 hover:bg-gray-50 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <div className="flex items-center">
                <GraduationCap className="h-8 w-8 text-yellow-400" />
                <span className="ml-2 text-xl font-bold text-white">Uniplanr</span>
              </div>
              <p className="text-gray-400 text-base">
                Your comprehensive platform for international education planning and support.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Solutions</h3>
                  <ul className="mt-4 space-y-4">
                    <li><a href="#" className="text-base text-gray-300 hover:text-white">Program Search</a></li>
                    <li><a href="#" className="text-base text-gray-300 hover:text-white">Application Support</a></li>
                    <li><a href="#" className="text-base text-gray-300 hover:text-white">Visa Guidance</a></li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
                  <ul className="mt-4 space-y-4">
                    <li><a href="#" className="text-base text-gray-300 hover:text-white">Help Center</a></li>
                    <li><a href="#" className="text-base text-gray-300 hover:text-white">Community</a></li>
                    <li><a href="#" className="text-base text-gray-300 hover:text-white">Contact Us</a></li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
                  <ul className="mt-4 space-y-4">
                    <li><a href="#" className="text-base text-gray-300 hover:text-white">About</a></li>
                    <li><a href="#" className="text-base text-gray-300 hover:text-white">Blog</a></li>
                    <li><a href="#" className="text-base text-gray-300 hover:text-white">Careers</a></li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
                  <ul className="mt-4 space-y-4">
                    <li><a href="#" className="text-base text-gray-300 hover:text-white">Privacy</a></li>
                    <li><a href="#" className="text-base text-gray-300 hover:text-white">Terms</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 xl:text-center">
              &copy; {new Date().getFullYear()} Uniplanr. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

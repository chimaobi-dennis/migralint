
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, 
  Users, 
  BookOpen, 
  Video, 
  MessageCircle, 
  Zap, 
  Coffee,
  MapPin,
  Star,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Heart,
  Clock,
  CheckCircle2
} from "lucide-react";

const PathwaySelection = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-cyan-50 to-emerald-50">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <GraduationCap className="absolute top-20 left-20 h-8 w-8 text-purple-300/40 animate-bounce delay-100" />
        <BookOpen className="absolute top-40 right-32 h-6 w-6 text-blue-300/40 animate-bounce delay-300" />
        <Star className="absolute bottom-40 left-32 h-5 w-5 text-yellow-300/40 animate-bounce delay-700" />
        <Heart className="absolute bottom-60 right-20 h-7 w-7 text-pink-300/40 animate-bounce delay-500" />
        <Sparkles className="absolute top-60 left-1/4 h-6 w-6 text-emerald-300/40 animate-bounce delay-900" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
            <Sparkles className="h-5 w-5 mr-2" />
            <span className="font-bold">Choose Your Adventure! 🎯</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent mb-6 leading-tight">
            How would you like to
            <br />
            <span className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
              conquer
              <div className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full transform -rotate-1"></div>
            </span>
            {" "}your dreams?
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Pick your perfect path to studying in Sweden! Whether you're a 
            <span className="text-purple-600 font-semibold"> self-starter </span> or prefer 
            <span className="text-blue-600 font-semibold"> expert guidance</span>, 
            we've got you covered! ✨
          </p>
        </div>

        {/* Pathway Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Self Directed Card */}
          <Card className="group relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-blue-500 to-purple-600">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-purple-700/90"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
            
            <CardContent className="relative p-8 text-white">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    <Rocket className="h-4 w-4 mr-1" />
                    DIY Style
                  </Badge>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 flex items-center">
                    <Zap className="h-8 w-8 mr-3 text-yellow-400" />
                    Self Directed
                  </h2>
                  <p className="text-blue-100 text-lg leading-relaxed mb-6">
                    Take control of your journey! Navigate through our super-friendly interface 
                    with video tutorials, step-by-step guides, and 24/7 support. Perfect for 
                    independent learners! 🚀
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <CheckCircle2 className="h-5 w-5 mr-3 text-green-400" />
                    <span>Interactive video tutorials</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle2 className="h-5 w-5 mr-3 text-green-400" />
                    <span>Real-time progress tracking</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle2 className="h-5 w-5 mr-3 text-green-400" />
                    <span>Instant chat support</span>
                  </div>
                </div>

                {/* Visual Element */}
                <div className="flex justify-center my-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <BookOpen className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Sparkles className="h-3 w-3 text-yellow-800" />
                    </div>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full bg-white text-purple-600 hover:bg-gray-100 font-bold py-4 text-lg group-hover:scale-105 transition-all duration-300"
                  onClick={() => navigate("/self-directed")}
                >
                  Start My Adventure
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>

                <div className="flex items-center justify-center text-sm text-blue-200">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Get started in 2 minutes</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Find an Adviser Card */}
          <Card className="group relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-emerald-500 to-teal-600">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/90 to-teal-700/90"></div>
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
            
            <CardContent className="relative p-8 text-white">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    <Users className="h-4 w-4 mr-1" />
                    VIP Treatment
                  </Badge>
                  <div className="flex items-center">
                    <Coffee className="h-4 w-4 mr-1 text-orange-300" />
                    <span className="text-sm text-emerald-200">Premium</span>
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 flex items-center">
                    <MessageCircle className="h-8 w-8 mr-3 text-yellow-400" />
                    Find an Adviser
                  </h2>
                  <p className="text-emerald-100 text-lg leading-relaxed mb-6">
                    Get paired with a personal education consultant who'll handle everything! 
                    From applications to visa guidance - sit back, relax, and let the pros 
                    work their magic! ✨
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <CheckCircle2 className="h-5 w-5 mr-3 text-green-400" />
                    <span>Dedicated personal consultant</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle2 className="h-5 w-5 mr-3 text-green-400" />
                    <span>End-to-end application support</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle2 className="h-5 w-5 mr-3 text-green-400" />
                    <span>Priority visa assistance</span>
                  </div>
                </div>

                {/* Visual Element */}
                <div className="flex justify-center my-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Users className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
                      <Heart className="h-3 w-3 text-orange-800" />
                    </div>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full bg-white text-emerald-600 hover:bg-gray-100 font-bold py-4 text-lg group-hover:scale-105 transition-all duration-300"
                  onClick={() => navigate("/premium-service")}
                >
                  Connect Me Now
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>

                <div className="flex items-center justify-center text-sm text-emerald-200">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Expert matched in 24h</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl animate-fade-in">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <Video className="h-6 w-6 mr-2 text-purple-600" />
              Not sure which path to choose?
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              Watch our 3-minute explainer video or chat with our friendly team to find your perfect match! 
              We're here to make your Swedish study dreams come true! 🇸🇪
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg" className="bg-white/80 hover:bg-white">
                <Video className="h-5 w-5 mr-2" />
                Watch Video Guide
              </Button>
              <Button variant="outline" size="lg" className="bg-white/80 hover:bg-white">
                <MessageCircle className="h-5 w-5 mr-2" />
                Chat with Us
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="flex space-x-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse`} style={{animationDelay: `${i * 200}ms`}}></div>
              ))}
            </div>
          </div>
          <p className="text-lg">
            <span className="font-semibold text-purple-600">Uniplanr</span> - Where Swedish study dreams become reality! 
            <br />
            <span className="text-sm">Your trusted education consultancy partner since day one ✨</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default PathwaySelection;

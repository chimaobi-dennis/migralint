
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AdminLayout } from "@/components/AdminLayout";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Index";
import Application from "./pages/user/Application";
import ApplicationJourney from "./pages/ApplicationJourney";
import PathwaySelection from "./pages/PathwaySelection";
import SelfDirectedPath from "./pages/SelfDirectedPath";
import PremiumService from "./pages/PremiumService";
import MyPage from "./pages/MyPage";
import MyProfile from "./pages/MyProfile";
import AdminScholarshipSteps from "./pages/admin/AdminScholarshipSteps";
import AdminVisaSteps from "./pages/admin/AdminVisaSteps";
import AdminSteps from "./pages/admin/AdminSteps";
import Documents from "./pages/Documents";
import ResumeEditor from "./pages/ResumeEditor";
import TemplateBuilder from "./pages/TemplateBuilder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Authenticated App Routes */}
          <Route path="/app" element={<Layout><Dashboard /></Layout>}>
            <Route index element={<Dashboard />} />
            <Route path="applications" element={<Application />} />
            <Route path="application" element={<Application />} />
            <Route path="application-journey" element={<ApplicationJourney />} />
            <Route path="pathway-selection" element={<PathwaySelection />} />
            <Route path="self-directed" element={<SelfDirectedPath />} />
            <Route path="premium-service" element={<PremiumService />} />
            <Route path="documents" element={<Documents />} />
            <Route path="my-page" element={<MyPage />} />
            <Route path="my-profile" element={<MyProfile />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout><AdminSteps /></AdminLayout>}>
            <Route index element={<AdminSteps />} />
            <Route path="scholarship-steps" element={<AdminScholarshipSteps />} />
            <Route path="visa-steps" element={<AdminVisaSteps />} />
            <Route path="template-builder" element={<TemplateBuilder />} />
          </Route>
          
          {/* Utility Routes */}
          <Route path="/resume-editor" element={<ResumeEditor />} />
          
          {/* 404 - Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

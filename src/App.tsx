
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import StudyInSweden from "./pages/StudyInSweden";
import ApplicationJourney from "./pages/ApplicationJourney";
import PathwaySelection from "./pages/PathwaySelection";
import SelfDirectedPath from "./pages/SelfDirectedPath";
import PremiumService from "./pages/PremiumService";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/applications" element={<Layout><StudyInSweden /></Layout>} />
          <Route path="/application-journey" element={<Layout><ApplicationJourney /></Layout>} />
          <Route path="/pathway-selection" element={<Layout><PathwaySelection /></Layout>} />
          <Route path="/self-directed" element={<Layout><SelfDirectedPath /></Layout>} />
          <Route path="/premium-service" element={<Layout><PremiumService /></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

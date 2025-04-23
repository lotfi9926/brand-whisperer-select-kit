import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import QualityControlPage from "./pages/QualityControlPage";
import TechnicalInfoPage from "./pages/TechnicalInfoPage";
import SampleEntryPage from "./pages/SampleEntryPage";
import AccessLogPage from "./pages/AccessLogPage";
import HistoryPage from "./pages/HistoryPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/" element={<Index />} />
            
            {/* Protected routes */}
            <Route path="/quality-control" element={
              <ProtectedRoute>
                <QualityControlPage />
              </ProtectedRoute>
            } />
            
            <Route path="/technical-info" element={
              <ProtectedRoute allowedRoles={['coordinator']}>
                <TechnicalInfoPage />
              </ProtectedRoute>
            } />
            
            <Route path="/sample-entry" element={
              <ProtectedRoute>
                <SampleEntryPage />
              </ProtectedRoute>
            } />
            
            <Route path="/access-log" element={
              <ProtectedRoute>
                <AccessLogPage />
              </ProtectedRoute>
            } />
            
            <Route path="/history" element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { Dashboard } from "@/pages/Dashboard";
import { Employees } from "@/pages/Employees";
import { Clients } from "@/pages/Clients";
import { Inventory } from "@/pages/Inventory";
import { Invoices } from "@/pages/Invoices";
import { StoreDashboard } from "@/pages/StoreDashboard";
import { StoreClients } from "@/pages/StoreClients";
import { StoreInventory } from "@/pages/StoreInventory";
import { StoreSales } from "@/pages/StoreSales";
import { StoreInvoices } from "@/pages/StoreInvoices";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AuthLayout />;
  }

  return (
    <Routes>
      {/* Main Dashboard Routes */}
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dashboard/stores" element={<Dashboard />} />
        <Route path="dashboard/employees" element={<Employees />} />
        
        {/* Legacy routes for compatibility */}
        <Route path="dashboard/clients" element={<Clients />} />
        <Route path="dashboard/inventory" element={<Inventory />} />
        <Route path="dashboard/invoices" element={<Invoices />} />
      </Route>
      
      {/* Store-specific Routes */}
      <Route path="/store/:storeId" element={<StoreLayout />}>
        <Route index element={<StoreDashboard />} />
        <Route path="clients" element={<StoreClients />} />
        <Route path="inventory" element={<StoreInventory />} />
        <Route path="sales" element={<StoreSales />} />
        <Route path="invoices" element={<StoreInvoices />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

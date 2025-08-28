import React from 'react';
import { Outlet, useNavigate, useLocation, useParams } from 'react-router-dom';
import { 
  ArrowLeft,
  Users, 
  Package, 
  FileText, 
  LogOut, 
  Settings,
  Bell,
  Search,
  ShoppingCart,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarTrigger,
  useSidebar 
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const storeNavigation = [
  { name: 'Store Dashboard', href: '/store/:storeId', icon: BarChart3 },
  { name: 'Clients', href: '/store/:storeId/clients', icon: Users },
  { name: 'Inventory', href: '/store/:storeId/inventory', icon: Package },
  { name: 'Sales', href: '/store/:storeId/sales', icon: ShoppingCart },
  { name: 'Invoices', href: '/store/:storeId/invoices', icon: FileText },
];

export const StoreLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { storeId } = useParams();

  const [store, setStore] = React.useState<any>(null);

  React.useEffect(() => {
    if (storeId) {
      const allStores = JSON.parse(localStorage.getItem('opti_stores') || '[]');
      const foundStore = allStores.find((s: any) => s.id === storeId);
      setStore(foundStore);
    }
  }, [storeId]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const isActive = (path: string) => {
    const actualPath = path.replace(':storeId', storeId || '');
    if (actualPath === `/store/${storeId}`) {
      return location.pathname === actualPath;
    }
    return location.pathname.startsWith(actualPath);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <StoreSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between h-full px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <Button 
                  variant="ghost" 
                  onClick={handleBackToDashboard}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input 
                    placeholder="Search..." 
                    className="pl-10 w-64 bg-background/50"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                  <Bell className="w-4 h-4" />
                </Button>
                <ThemeToggle />
                <Button variant="ghost" size="icon">
                  <Settings className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                      {user?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-muted-foreground capitalize">{user?.role}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const StoreSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { storeId } = useParams();
  const { state } = useSidebar();

  const [store, setStore] = React.useState<any>(null);

  React.useEffect(() => {
    if (storeId) {
      const allStores = JSON.parse(localStorage.getItem('opti_stores') || '[]');
      const foundStore = allStores.find((s: any) => s.id === storeId);
      setStore(foundStore);
    }
  }, [storeId]);

  const isActive = (path: string) => {
    const actualPath = path.replace(':storeId', storeId || '');
    if (actualPath === `/store/${storeId}`) {
      return location.pathname === actualPath;
    }
    return location.pathname.startsWith(actualPath);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-sidebar">
        {/* Store Info */}
        <div className="p-4 border-b border-sidebar-border">
          {state === "expanded" && store ? (
            <div>
              <h2 className="font-bold text-sidebar-foreground">{store.name}</h2>
              <p className="text-xs text-sidebar-foreground/60">{store.address}</p>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-primary-foreground" />
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Store Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {storeNavigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild
                    className={isActive(item.href) ? "bg-sidebar-accent text-sidebar-primary" : ""}
                  >
                    <button
                      onClick={() => navigate(item.href.replace(':storeId', storeId || ''))}
                      className="flex items-center gap-3 w-full"
                    >
                      <item.icon className="w-4 h-4" />
                      {state === "expanded" && <span>{item.name}</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
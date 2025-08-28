import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Store, 
  Users, 
  Package, 
  FileText, 
  LogOut, 
  Menu,
  Settings,
  Bell,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

const navigation = [
  { name: 'Stores', href: '/dashboard', icon: Store },
  { name: 'Employees', href: '/dashboard/employees', icon: Users, ownerOnly: true },
  { name: 'Clients', href: '/dashboard/clients', icon: Users },
  { name: 'Inventory', href: '/dashboard/inventory', icon: Package },
  { name: 'Invoices', href: '/dashboard/invoices', icon: FileText },
];

export const DashboardLayout: React.FC = () => {
  const { user, logout, isOwner } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between h-full px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
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

const AppSidebar: React.FC = () => {
  const { user, isOwner } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const filteredNavigation = navigation.filter(item => 
    !item.ownerOnly || isOwner
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-sidebar">
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Store className="w-4 h-4 text-primary-foreground" />
            </div>
            {state === "expanded" && (
              <div>
                <h2 className="font-bold text-sidebar-foreground">OptiSaaS</h2>
                <p className="text-xs text-sidebar-foreground/60">Optical Management</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild
                    className={isActive(item.href) ? "bg-sidebar-accent text-sidebar-primary" : ""}
                  >
                    <button
                      onClick={() => navigate(item.href)}
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

        {/* User Info at Bottom */}
        {state === "expanded" && (
          <div className="mt-auto p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-sidebar-accent text-sidebar-foreground text-xs">
                  {user?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-sidebar-foreground/60 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
};
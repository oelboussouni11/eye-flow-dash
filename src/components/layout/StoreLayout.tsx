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
  BarChart3,
  Contact
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
  const [globalSearch, setGlobalSearch] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = React.useState(false);

  React.useEffect(() => {
    if (storeId) {
      const allStores = JSON.parse(localStorage.getItem('opti_stores') || '[]');
      const foundStore = allStores.find((s: any) => s.id === storeId);
      setStore(foundStore);
    }
  }, [storeId]);

  // Global search functionality
  React.useEffect(() => {
    if (globalSearch.length > 2 && storeId) {
      const searchTerm = globalSearch.toLowerCase();
      const results: any[] = [];

      // Search products
      const products = JSON.parse(localStorage.getItem(`store-${storeId}-products`) || '[]');
      const matchingProducts = products.filter((p: any) => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.sku.toLowerCase().includes(searchTerm) ||
        p.brand?.toLowerCase().includes(searchTerm)
      ).map((p: any) => ({ ...p, type: 'product', page: 'inventory' }));

      // Search contact lenses
      const contactLenses = JSON.parse(localStorage.getItem(`store-${storeId}-contactLenses`) || '[]');
      const matchingLenses = contactLenses.filter((l: any) => 
        l.name.toLowerCase().includes(searchTerm) ||
        l.brand.toLowerCase().includes(searchTerm)
      ).map((l: any) => ({ ...l, type: 'contact-lens', page: 'inventory' }));

      // Search clients (assuming clients are stored)
      const clients = JSON.parse(localStorage.getItem(`store-${storeId}-clients`) || '[]');
      const matchingClients = clients.filter((c: any) => 
        c.name?.toLowerCase().includes(searchTerm) ||
        c.email?.toLowerCase().includes(searchTerm)
      ).map((c: any) => ({ ...c, type: 'client', page: 'clients' }));

      results.push(...matchingProducts, ...matchingLenses, ...matchingClients);
      setSearchResults(results.slice(0, 10)); // Limit to 10 results
      setShowSearchResults(results.length > 0);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [globalSearch, storeId]);

  const handleSearchResultClick = (result: any) => {
    setShowSearchResults(false);
    setGlobalSearch('');
    
    if (result.page === 'inventory') {
      navigate(`/store/${storeId}/inventory`);
    } else if (result.page === 'clients') {
      navigate(`/store/${storeId}/clients`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const isActive = (path: string) => {
    const actualPath = path.replace(':storeId', storeId || '');
    return location.pathname === actualPath;
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
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                  <Input 
                    placeholder="Search products, clients, lenses..." 
                    className="pl-10 w-72 bg-background border-border focus:ring-2 focus:ring-primary/20 transition-all"
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                    onFocus={() => globalSearch.length > 2 && setShowSearchResults(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setShowSearchResults(false);
                        setGlobalSearch('');
                      }
                    }}
                  />
                  
                  {/* Search Results Dropdown */}
                  {showSearchResults && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
                      <div className="p-2 border-b border-border bg-muted/50">
                        <p className="text-xs font-medium text-muted-foreground">
                          {searchResults.length > 0 ? `${searchResults.length} results found` : 'No results found'}
                        </p>
                      </div>
                      
                      <div className="max-h-80 overflow-y-auto">
                        {searchResults.length > 0 ? (
                          searchResults.map((result, index) => (
                            <div
                              key={index}
                              className="p-3 hover:bg-accent cursor-pointer transition-colors border-b border-border/50 last:border-b-0 group"
                              onClick={() => handleSearchResultClick(result)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center group-hover:bg-accent-foreground/10 transition-colors">
                                  {result.type === 'product' && <Package className="w-4 h-4 text-primary" />}
                                  {result.type === 'contact-lens' && <Contact className="w-4 h-4 text-accent" />}
                                  {result.type === 'client' && <Users className="w-4 h-4 text-secondary" />}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className="font-medium text-sm text-foreground truncate">
                                      {result.name}
                                    </p>
                                    <div className="flex items-center gap-1">
                                      <span className="text-xs text-muted-foreground capitalize bg-muted px-2 py-1 rounded">
                                        {result.type.replace('-', ' ')}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 mt-1">
                                    <p className="text-xs text-muted-foreground">
                                      {result.type === 'product' && (
                                        <>
                                          <span className="font-medium">SKU:</span> {result.sku} • 
                                          <span className="font-medium">Stock:</span> 
                                          <span className={result.stock <= result.minStock ? 'text-warning' : 'text-green-600'}>
                                            {result.stock}
                                          </span>
                                        </>
                                      )}
                                      {result.type === 'contact-lens' && (
                                        <>
                                          <span className="font-medium">Brand:</span> {result.brand} • 
                                          <span className="font-medium">Stock:</span> 
                                          <span className={result.stock <= result.minStock ? 'text-warning' : 'text-green-600'}>
                                            {result.stock}
                                          </span>
                                        </>
                                      )}
                                      {result.type === 'client' && (
                                        <>
                                          <span className="font-medium">Email:</span> {result.email}
                                        </>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : globalSearch.length > 2 ? (
                          <div className="p-6 text-center">
                            <Package className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">No results found for "{globalSearch}"</p>
                            <p className="text-xs text-muted-foreground mt-1">Try different keywords</p>
                          </div>
                        ) : null}
                      </div>
                      
                      <div className="p-2 border-t border-border bg-muted/30 text-center">
                        <p className="text-xs text-muted-foreground">
                          Press <kbd className="px-1 py-0.5 bg-background border rounded text-xs">Esc</kbd> to close
                        </p>
                      </div>
                    </div>
                  )}
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
            
            {/* Search overlay */}
            {showSearchResults && (
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowSearchResults(false)}
              />
            )}
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
    return location.pathname === actualPath;
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
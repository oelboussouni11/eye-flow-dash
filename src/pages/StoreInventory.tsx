import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Search, Filter, Package, Eye, Clock, AlertTriangle, Contact } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoryCard } from '@/components/inventory/CategoryCard';
import { CategoryFormModal } from '@/components/inventory/CategoryFormModal';
import { ProductCard } from '@/components/inventory/ProductCard';
import { ProductFormModal } from '@/components/inventory/ProductFormModal';
import { LensOrderCard } from '@/components/inventory/LensOrderCard';
import { ContactLensCard } from '@/components/inventory/ContactLensCard';
import { ContactLensFormModal } from '@/components/inventory/ContactLensFormModal';
import { Category, Product, LensOrder, ContactLens, DEFAULT_CATEGORIES } from '@/types/inventory';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const StoreInventory: React.FC = () => {
  const { storeId } = useParams();
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [lensOrders, setLensOrders] = useState<LensOrder[]>([]);
  const [contactLenses, setContactLenses] = useState<ContactLens[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedContactLens, setSelectedContactLens] = useState<ContactLens | null>(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isAddContactLensOpen, setIsAddContactLensOpen] = useState(false);
  const [isEditContactLensOpen, setIsEditContactLensOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [showLowStock, setShowLowStock] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [lensFilter, setLensFilter] = useState<'all' | 'lentilles' | 'produits'>('all');

  // Initialize data from localStorage or defaults
  useEffect(() => {
    const storeKey = `store-${storeId}`;
    
    // Load categories
    const savedCategories = localStorage.getItem(`${storeKey}-categories`);
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      const defaultCats: Category[] = DEFAULT_CATEGORIES.map((cat, index) => ({
        ...cat,
        id: `default-${index}`,
        storeId: storeId || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      setCategories(defaultCats);
      localStorage.setItem(`${storeKey}-categories`, JSON.stringify(defaultCats));
    }

    // Load products
    const savedProducts = localStorage.getItem(`${storeKey}-products`);
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }

    // Load lens orders
    const savedLensOrders = localStorage.getItem(`${storeKey}-lensOrders`);
    if (savedLensOrders) {
      setLensOrders(JSON.parse(savedLensOrders));
    }

    // Load contact lenses
    const savedContactLenses = localStorage.getItem(`${storeKey}-contactLenses`);
    if (savedContactLenses) {
      setContactLenses(JSON.parse(savedContactLenses));
    }
  }, [storeId]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (storeId && categories.length > 0) {
      localStorage.setItem(`store-${storeId}-categories`, JSON.stringify(categories));
    }
  }, [categories, storeId]);

  useEffect(() => {
    if (storeId) {
      localStorage.setItem(`store-${storeId}-products`, JSON.stringify(products));
    }
  }, [products, storeId]);

  useEffect(() => {
    if (storeId) {
      localStorage.setItem(`store-${storeId}-lensOrders`, JSON.stringify(lensOrders));
    }
  }, [lensOrders, storeId]);

  useEffect(() => {
    if (storeId) {
      localStorage.setItem(`store-${storeId}-contactLenses`, JSON.stringify(contactLenses));
    }
  }, [contactLenses, storeId]);

  const handleAddCategory = (data: any) => {
    const newCategory: Category = {
      id: `custom-${Date.now()}`,
      ...data,
      isDefault: false,
      storeId: storeId || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCategories([...categories, newCategory]);
    toast.success('Category created successfully');
  };

  const handleEditCategory = (data: any) => {
    if (!selectedCategory) return;
    
    const updatedCategories = categories.map(cat =>
      cat.id === selectedCategory.id
        ? { ...cat, ...data, updatedAt: new Date().toISOString() }
        : cat
    );
    setCategories(updatedCategories);
    setSelectedCategory(null);
    toast.success('Category updated successfully');
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
    toast.success('Category deleted successfully');
  };

  const handleAddProduct = (data: any) => {
    // Check for duplicate SKU
    const existingSKU = products.find(p => p.sku.toLowerCase() === data.sku.toLowerCase());
    if (existingSKU) {
      toast.error('A product with this SKU already exists');
      return;
    }

    // Check for duplicate name
    const existingName = products.find(p => p.name.toLowerCase() === data.name.toLowerCase());
    if (existingName) {
      toast.error('A product with this name already exists');
      return;
    }

    const newProduct: Product = {
      id: `product-${Date.now()}`,
      ...data,
      images: [],
      attributes: {},
      storeId: storeId || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts([...products, newProduct]);
    toast.success('Product created successfully');
  };

  const handleEditProduct = (data: any) => {
    if (!selectedProduct) return;
    
    // Check for duplicate SKU (excluding current product)
    const existingSKU = products.find(p => 
      p.id !== selectedProduct.id && p.sku.toLowerCase() === data.sku.toLowerCase()
    );
    if (existingSKU) {
      toast.error('A product with this SKU already exists');
      return;
    }

    // Check for duplicate name (excluding current product)
    const existingName = products.find(p => 
      p.id !== selectedProduct.id && p.name.toLowerCase() === data.name.toLowerCase()
    );
    if (existingName) {
      toast.error('A product with this name already exists');
      return;
    }
    
    const updatedProducts = products.map(product =>
      product.id === selectedProduct.id
        ? { ...product, ...data, updatedAt: new Date().toISOString() }
        : product
    );
    setProducts(updatedProducts);
    setSelectedProduct(null);
    toast.success('Product updated successfully');
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(product => product.id !== productId));
    toast.success('Product deleted successfully');
  };

  const handleAddContactLens = (data: any) => {
    // Check for duplicate name
    const existingName = contactLenses.find(l => l.name.toLowerCase() === data.name.toLowerCase());
    if (existingName) {
      toast.error('A contact lens with this name already exists');
      return;
    }

    const newContactLens: ContactLens = {
      id: `lens-${Date.now()}`,
      ...data,
      storeId: storeId || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setContactLenses([...contactLenses, newContactLens]);
    toast.success('Contact lens created successfully');
  };

  const handleEditContactLens = (data: any) => {
    if (!selectedContactLens) return;
    
    // Check for duplicate name (excluding current lens)
    const existingName = contactLenses.find(l => 
      l.id !== selectedContactLens.id && l.name.toLowerCase() === data.name.toLowerCase()
    );
    if (existingName) {
      toast.error('A contact lens with this name already exists');
      return;
    }
    
    const updatedContactLenses = contactLenses.map(lens =>
      lens.id === selectedContactLens.id
        ? { ...lens, ...data, updatedAt: new Date().toISOString() }
        : lens
    );
    setContactLenses(updatedContactLenses);
    setSelectedContactLens(null);
    toast.success('Contact lens updated successfully');
  };

  const handleDeleteContactLens = (lensId: string) => {
    setContactLenses(contactLenses.filter(lens => lens.id !== lensId));
    toast.success('Contact lens deleted successfully');
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLowStock = !showLowStock || product.stock <= product.minStock;
    
    let matchesActive = true;
    if (activeFilter === 'active') {
      matchesActive = product.isActive;
    } else if (activeFilter === 'inactive') {
      matchesActive = !product.isActive;
    }
    // If activeFilter === 'all', matchesActive stays true
    
    return matchesSearch && matchesLowStock && matchesActive;
  });

  const filteredContactLenses = contactLenses.filter(lens => {
    const matchesSearch = lens.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lens.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lens.power && lens.power.includes(searchQuery));
    
    const matchesLowStock = !showLowStock || lens.stock <= lens.minStock;
    
    let matchesActive = true;
    if (activeFilter === 'active') {
      matchesActive = lens.isActive;
    } else if (activeFilter === 'inactive') {
      matchesActive = !lens.isActive;
    }

    let matchesCategory = true;
    if (lensFilter === 'lentilles') {
      matchesCategory = lens.category === 'lentilles';
    } else if (lensFilter === 'produits') {
      matchesCategory = lens.category === 'produits';
    }
    
    return matchesSearch && matchesLowStock && matchesActive && matchesCategory;
  });

  // Count products with low stock for alert
  const lowStockCount = products.filter(p => p.stock <= p.minStock && p.stock > 0).length;
  const outOfStockCount = products.filter(p => p.stock <= 0).length;
  
  // Count contact lenses with low stock
  const lowStockLensesCount = contactLenses.filter(l => l.stock <= l.minStock && l.stock > 0).length;
  const outOfStockLensesCount = contactLenses.filter(l => l.stock <= 0).length;

  const filteredLensOrders = lensOrders.filter(order =>
    order.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const canManageInventory = user?.role === 'owner' || 
    user?.permissions?.inventory?.includes('manage') ||
    user?.permissions?.inventory?.includes('edit');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Store Inventory</h1>
          <p className="text-muted-foreground mt-1">
            Manage products and stock levels for this store
          </p>
          {(lowStockCount > 0 || outOfStockCount > 0 || lowStockLensesCount > 0 || outOfStockLensesCount > 0) && (
            <div className="flex gap-2 mt-2">
              {lowStockCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {lowStockCount} Products Low Stock
                </Badge>
              )}
              {outOfStockCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {outOfStockCount} Products Out of Stock
                </Badge>
              )}
              {lowStockLensesCount > 0 && (
                <Badge variant="warning" className="text-xs">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {lowStockLensesCount} Lentilles Low Stock
                </Badge>
              )}
              {outOfStockLensesCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {outOfStockLensesCount} Lentilles Out of Stock
                </Badge>
              )}
            </div>
          )}
        </div>
        
        {canManageInventory && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsAddCategoryOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setIsAddContactLensOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Add Contact Lens
            </Button>
            <Button 
              variant="primary" 
              className="flex items-center gap-2"
              onClick={() => setIsAddProductOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder={activeTab === 'products' ? 'Search products...' : 
                        activeTab === 'categories' ? 'Search categories...' : 
                        activeTab === 'contact-lenses' ? 'Search contact lenses...' :
                        'Search lens orders...'} 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
          <div className="flex items-center gap-2">
            <Button 
              variant={showLowStock ? "default" : "outline"}
              size="sm"
              onClick={() => setShowLowStock(!showLowStock)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              {showLowStock ? "Show All" : `Low Stock ${lowStockCount > 0 ? `(${lowStockCount})` : ''}`}
            </Button>
            <Button 
              variant={activeFilter !== 'all' ? "default" : "outline"}
              size="sm"
              onClick={() => {
                if (activeFilter === 'all') {
                  setActiveFilter('active');
                } else if (activeFilter === 'active') {
                  setActiveFilter('inactive');
                } else {
                  setActiveFilter('all');
                }
              }}
              className="flex items-center gap-2"
            >
              {activeFilter === 'all' && 'Show All Products'}
              {activeFilter === 'active' && 'Active Only'}
              {activeFilter === 'inactive' && 'Inactive Only'}
            </Button>
            {activeTab === 'contact-lenses' && (
              <Button 
                variant={lensFilter !== 'all' ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (lensFilter === 'all') {
                    setLensFilter('lentilles');
                  } else if (lensFilter === 'lentilles') {
                    setLensFilter('produits');
                  } else {
                    setLensFilter('all');
                  }
                }}
                className="flex items-center gap-2"
              >
                {lensFilter === 'all' && 'All Types'}
                {lensFilter === 'lentilles' && 'Lentilles Only'}
                {lensFilter === 'produits' && 'Produits Only'}
              </Button>
            )}
          </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="lens-orders">
            <Eye className="w-4 h-4 mr-2" />
            Lens Orders
          </TabsTrigger>
          <TabsTrigger value="contact-lenses">
            <Contact className="w-4 h-4 mr-2" />
            Lentilles
          </TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={() => {
                  setSelectedProduct(product);
                  setIsEditProductOpen(true);
                }}
                onDelete={() => handleDeleteProduct(product.id)}
                onClick={() => {
                  toast.info(`Viewing ${product.name} details`);
                }}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'Try adjusting your search terms' : 'Add your first product to start managing inventory'}
              </p>
              {!searchQuery && canManageInventory && (
                <Button variant="primary" onClick={() => setIsAddProductOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Product
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="lens-orders" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLensOrders.map((order) => (
              <LensOrderCard
                key={order.id}
                order={order}
                onEdit={() => {
                  toast.info(`Updating status for order ${order.orderNumber}`);
                }}
                onDelete={() => {
                  toast.info(`Cancelling order ${order.orderNumber}`);
                }}
                onView={() => {
                  toast.info(`Viewing details for order ${order.orderNumber}`);
                }}
              />
            ))}
          </div>

          {filteredLensOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No lens orders found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'Try adjusting your search terms' : 'Lens orders will appear here when clients place orders'}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="contact-lenses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredContactLenses.map((lens) => (
              <ContactLensCard
                key={lens.id}
                lens={lens}
                onEdit={() => {
                  setSelectedContactLens(lens);
                  setIsEditContactLensOpen(true);
                }}
                onDelete={() => handleDeleteContactLens(lens.id)}
                onClick={() => {
                  toast.info(`Viewing ${lens.name} details`);
                }}
              />
            ))}
          </div>

          {filteredContactLenses.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Contact className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No contact lenses found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'Try adjusting your search terms' : 'Add your first contact lenses to start managing inventory'}
              </p>
              {!searchQuery && canManageInventory && (
                <Button variant="primary" onClick={() => {
                  // For now, add a sample contact lens
                  const sampleLens: ContactLens = {
                    id: `lens-${Date.now()}`,
                    name: 'Acuvue Oasys',
                    category: 'lentilles',
                    brand: 'Johnson & Johnson',
                    type: 'daily',
                    material: 'Silicone Hydrogel',
                    diameter: 14.0,
                    baseCurve: 8.5,
                    power: '-2.00',
                    stock: 50,
                    minStock: 10,
                    price: 45.99,
                    cost: 25.00,
                    images: [],
                    isActive: true,
                    storeId: storeId || '',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  };
                  setContactLenses([...contactLenses, sampleLens]);
                  toast.success('Sample contact lens added');
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Sample Contact Lens
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                productCount={products.filter(p => p.categoryId === category.id).length}
                onEdit={() => {
                  setSelectedCategory(category);
                  setIsEditCategoryOpen(true);
                }}
                onDelete={() => handleDeleteCategory(category.id)}
                onClick={() => {
                  setActiveTab('products');
                  toast.info(`Showing products in ${category.name} category`);
                }}
              />
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No categories found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'Try adjusting your search terms' : 'Add your first category to start organizing inventory'}
              </p>
              {!searchQuery && canManageInventory && (
                <Button variant="primary" onClick={() => setIsAddCategoryOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Category
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CategoryFormModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onSubmit={handleAddCategory}
      />

      <CategoryFormModal
        isOpen={isEditCategoryOpen}
        onClose={() => {
          setIsEditCategoryOpen(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleEditCategory}
        category={selectedCategory || undefined}
      />

      <ProductFormModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onSubmit={handleAddProduct}
        categories={categories}
      />

      <ProductFormModal
        isOpen={isEditProductOpen}
        onClose={() => {
          setIsEditProductOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleEditProduct}
        product={selectedProduct || undefined}
        categories={categories}
      />

      <ContactLensFormModal
        isOpen={isAddContactLensOpen}
        onClose={() => setIsAddContactLensOpen(false)}
        onSubmit={handleAddContactLens}
      />

      <ContactLensFormModal
        isOpen={isEditContactLensOpen}
        onClose={() => {
          setIsEditContactLensOpen(false);
          setSelectedContactLens(null);
        }}
        onSubmit={handleEditContactLens}
        lens={selectedContactLens || undefined}
      />
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Search, Filter, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CategoryCard } from '@/components/inventory/CategoryCard';
import { CategoryFormModal } from '@/components/inventory/CategoryFormModal';
import { Category, DEFAULT_CATEGORIES } from '@/types/inventory';
import { toast } from 'sonner';

export const StoreInventory: React.FC = () => {
  const { storeId } = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize default categories on first load
  useEffect(() => {
    const initializeCategories = () => {
      const defaultCats: Category[] = DEFAULT_CATEGORIES.map((cat, index) => ({
        ...cat,
        id: `default-${index}`,
        storeId: storeId || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      setCategories(defaultCats);
    };

    initializeCategories();
  }, [storeId]);

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

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Store Inventory</h1>
          <p className="text-muted-foreground mt-1">
            Manage products and stock levels for this store
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsAddCategoryOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
          <Button variant="primary" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search categories..." 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Categories Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCategories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            productCount={0} // TODO: Calculate actual product count
            onEdit={() => {
              setSelectedCategory(category);
              setIsEditCategoryOpen(true);
            }}
            onDelete={() => handleDeleteCategory(category.id)}
            onClick={() => {
              // TODO: Navigate to category products view
              toast.info(`Viewing products in ${category.name} category`);
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
          {!searchQuery && (
            <Button variant="primary" onClick={() => setIsAddCategoryOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Category
            </Button>
          )}
        </div>
      )}

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
    </div>
  );
};
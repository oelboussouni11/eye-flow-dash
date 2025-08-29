import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Glasses, Eye, Sun, SprayCan, ShoppingBag, Wrench, Heart } from 'lucide-react';
import { Category } from '@/types/inventory';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  description: z.string().max(200, 'Description must be less than 200 characters').optional(),
  color: z.string().min(1, 'Color is required'),
  icon: z.string().min(1, 'Icon is required'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => void;
  category?: Category;
}

const ICON_OPTIONS = [
  { value: 'glasses', label: 'Glasses', icon: Glasses },
  { value: 'eye', label: 'Eye', icon: Eye },
  { value: 'sun', label: 'Sun', icon: Sun },
  { value: 'package', label: 'Package', icon: Package },
  { value: 'spray-can', label: 'Spray Can', icon: SprayCan },
  { value: 'shopping-bag', label: 'Shopping Bag', icon: ShoppingBag },
  { value: 'wrench', label: 'Wrench', icon: Wrench },
  { value: 'heart', label: 'Heart', icon: Heart },
];

const COLOR_OPTIONS = [
  { value: 'hsl(var(--primary))', label: 'Primary', color: 'bg-primary' },
  { value: 'hsl(var(--secondary))', label: 'Secondary', color: 'bg-secondary' },
  { value: 'hsl(var(--accent))', label: 'Accent', color: 'bg-accent' },
  { value: 'hsl(var(--warning))', label: 'Warning', color: 'bg-warning' },
  { value: 'hsl(var(--destructive))', label: 'Destructive', color: 'bg-destructive' },
  { value: 'hsl(var(--muted-foreground))', label: 'Muted', color: 'bg-muted-foreground' },
];

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  category
}) => {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      color: category?.color || 'hsl(var(--primary))',
      icon: category?.icon || 'package',
    },
  });

  const handleSubmit = (data: CategoryFormData) => {
    onSubmit(data);
    form.reset();
    onClose();
  };

  const selectedIcon = ICON_OPTIONS.find(option => option.value === form.watch('icon'));
  const selectedColor = COLOR_OPTIONS.find(option => option.value === form.watch('color'));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'Add New Category'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Category description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue>
                            {selectedIcon && (
                              <div className="flex items-center gap-2">
                                <selectedIcon.icon className="w-4 h-4" />
                                <span>{selectedIcon.label}</span>
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ICON_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <option.icon className="w-4 h-4" />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue>
                            {selectedColor && (
                              <div className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded ${selectedColor.color}`} />
                                <span>{selectedColor.label}</span>
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COLOR_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded ${option.color}`} />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {category ? 'Update' : 'Create'} Category
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
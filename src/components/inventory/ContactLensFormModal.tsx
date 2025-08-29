import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, Image } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ContactLens } from '@/types/inventory';

const contactLensSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.enum(['lentilles', 'produits'], { required_error: 'Category is required' }),
  brand: z.string().min(1, 'Brand is required'),
  type: z.string().optional(),
  material: z.string().optional(),
  diameter: z.number().optional(),
  baseCurve: z.number().optional(),
  power: z.string().optional(),
  cylinder: z.string().optional(),
  axis: z.number().optional(),
  addition: z.string().optional(),
  color: z.string().optional(),
  stock: z.number().min(0, 'Stock must be positive'),
  minStock: z.number().min(0, 'Minimum stock must be positive'),
  price: z.number().min(0, 'Price must be positive'),
  cost: z.number().min(0, 'Cost must be positive'),
  supplier: z.string().optional(),
  barcode: z.string().optional(),
  images: z.array(z.string()).default([]),
  isActive: z.boolean(),
});

type ContactLensFormData = z.infer<typeof contactLensSchema>;

interface ContactLensFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContactLensFormData) => void;
  lens?: ContactLens;
}

const LENS_TYPES = [
  { value: 'daily', label: 'Journalières' },
  { value: 'weekly', label: 'Hebdomadaires' },
  { value: 'monthly', label: 'Mensuelles' },
  { value: 'yearly', label: 'Annuelles' },
];

const PRODUCT_TYPES = [
  { value: 'solution', label: 'Solution multifonction' },
  { value: 'saline', label: 'Sérum physiologique' },
  { value: 'cleaner', label: 'Nettoyant' },
  { value: 'drops', label: 'Gouttes hydratantes' },
  { value: 'case', label: 'Étui de rangement' },
];

export const ContactLensFormModal: React.FC<ContactLensFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  lens
}) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  
  const form = useForm<ContactLensFormData>({
    resolver: zodResolver(contactLensSchema),
    defaultValues: {
      name: '',
      category: 'lentilles',
      brand: '',
      type: '',
      material: '',
      diameter: 0,
      baseCurve: 0,
      power: '',
      cylinder: '',
      axis: 0,
      addition: '',
      color: '',
      stock: 0,
      minStock: 0,
      price: 0,
      cost: 0,
      supplier: '',
      barcode: '',
      images: [],
      isActive: true,
    },
  });

  // Update form when lens changes
  React.useEffect(() => {
    if (lens) {
      form.reset({
        name: lens.name,
        category: lens.category,
        brand: lens.brand,
        type: lens.type || '',
        material: lens.material || '',
        diameter: lens.diameter || 0,
        baseCurve: lens.baseCurve || 0,
        power: lens.power || '',
        cylinder: lens.cylinder || '',
        axis: lens.axis || 0,
        addition: lens.addition || '',
        color: lens.color || '',
        stock: lens.stock,
        minStock: lens.minStock,
        price: lens.price,
        cost: lens.cost,
        supplier: lens.supplier || '',
        barcode: lens.barcode || '',
        images: lens.images,
        isActive: lens.isActive,
      });
      setUploadedImages(lens.images);
    } else {
      form.reset({
        name: '',
        category: 'lentilles',
        brand: '',
        type: '',
        material: '',
        diameter: 0,
        baseCurve: 0,
        power: '',
        cylinder: '',
        axis: 0,
        addition: '',
        color: '',
        stock: 0,
        minStock: 0,
        price: 0,
        cost: 0,
        supplier: '',
        barcode: '',
        images: [],
        isActive: true,
      });
      setUploadedImages([]);
    }
  }, [lens, form]);

  const handleSubmit = (data: ContactLensFormData) => {
    onSubmit({ ...data, images: uploadedImages });
    onClose();
    form.reset();
    setUploadedImages([]);
  };

  const handleClose = () => {
    onClose();
    form.reset();
    setUploadedImages(lens?.images || []);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setUploadedImages(prev => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const selectedCategory = form.watch('category');

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {lens ? 'Edit Contact Lens' : 'Add New Contact Lens'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="lentilles">Lentilles</SelectItem>
                        <SelectItem value="produits">Produits de Lentille</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter brand" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(selectedCategory === 'lentilles' ? LENS_TYPES : PRODUCT_TYPES).map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {selectedCategory === 'lentilles' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="power"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Power</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., -2.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="diameter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Diameter (mm)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="14.0" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="baseCurve"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base Curve</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="8.5" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="cylinder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cylinder (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., -0.75" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="axis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Axis (optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="180" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Blue" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            <FormField
              control={form.control}
              name="material"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Silicone Hydrogel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Stock</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Stock</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <div className="text-xs text-muted-foreground">
                      Alert threshold when stock runs low
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter supplier" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Barcode</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter barcode" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <FormLabel>Images</FormLabel>
              
              <div className="flex items-center gap-4">
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 border border-input rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">Upload Images</span>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                <span className="text-sm text-muted-foreground">
                  {uploadedImages.length}/5 images
                </span>
              </div>

              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square border border-border rounded-lg overflow-hidden bg-muted">
                        <img
                          src={image}
                          alt={`Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {uploadedImages.length === 0 && (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Image className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">No images uploaded</p>
                  <p className="text-xs text-muted-foreground">Upload up to 5 images</p>
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Enable this item for sale
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {lens ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
import { useState, useEffect } from "react";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

const productSchema = z.object({
  "Brand Desc": z.string().min(1, "Brand is required"),
  SubBrand: z.string().optional(),
  "Super Category Description": z.string().min(1, "Category is required"),
  "Material Desc": z.string().min(1, "Product name is required"),
  "Funskool Code": z.string().min(1, "SKU Code is required"),
  "Barcode (UPC/EAN)": z.string().optional(),
  "MRP (INR)": z.number().min(0, "Price must be positive"),
  QTY: z.number().int().min(0, "Quantity must be non-negative"),
  "Elec/ Non Elec": z.string().optional(),
  age_range: z.string().optional(),
  "Sku length": z.number().optional(),
  "Sku Width": z.number().optional(),
  "Sku Height": z.number().optional(),
  "Unit of measure of SKU length Width and Height": z.string().optional(),
  classification_id: z.string().optional(),
});

interface Brand {
  id: string;
  name: string;
}

interface SubBrand {
  id: string;
  name: string;
  brand_id: string;
}

interface Classification {
  id: string;
  name: string;
}

export const EditProductDialog = ({ product, onProductUpdated }: { product: Product; onProductUpdated?: () => void }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Dropdown data
  const [brands, setBrands] = useState<Brand[]>([]);
  const [subBrands, setSubBrands] = useState<SubBrand[]>([]);
  const [classifications, setClassifications] = useState<Classification[]>([]);
  
  // Selected values
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [selectedSubBrandId, setSelectedSubBrandId] = useState<string>("");
  const [selectedClassificationIds, setSelectedClassificationIds] = useState<string[]>([]);
  
  // Form data
  const [formData, setFormData] = useState({
    "Super Category Description": product["Super Category Description"] || "",
    "Material Desc": product["Material Desc"] || "",
    "Funskool Code": product["Funskool Code"] || "",
    "Barcode (UPC/EAN)": product["Barcode (UPC/EAN)"] || "",
    "MRP (INR)": product["MRP (INR)"]?.toString() || "",
    QTY: product.QTY?.toString() || "",
    "Elec/ Non Elec": product["Elec/ Non Elec"] || "Non Elec",
    age_range: product.age_range || "",
    "Sku length": product["Sku length"]?.toString() || "",
    "Sku Width": product["Sku Width"]?.toString() || "",
    "Sku Height": product["Sku Height"]?.toString() || "",
    "Unit of measure of SKU length Width and Height": product["Unit of measure of SKU length Width and Height"] || "cm",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product.image_url || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (open) {
      fetchDropdownData();
    }
  }, [open]);

  const fetchDropdownData = async () => {
    try {
      // Fetch brands
      const { data: brandsData, error: brandsError } = await supabase
        .from('brands')
        .select('*')
        .order('name');
      
      if (brandsError) throw brandsError;
      setBrands(brandsData || []);

      // Find and set current brand
      const currentBrand = brandsData?.find(b => b.name === product["Brand Desc"]);
      if (currentBrand) {
        setSelectedBrandId(currentBrand.id);
      }

      // Fetch all subbrands
      const { data: subBrandsData, error: subBrandsError } = await supabase
        .from('subbrands')
        .select('*')
        .order('name');
      
      if (subBrandsError) throw subBrandsError;
      setSubBrands(subBrandsData || []);

      // Find and set current subbrand
      const currentSubBrand = subBrandsData?.find(sb => sb.name === product.SubBrand);
      if (currentSubBrand) {
        setSelectedSubBrandId(currentSubBrand.id);
      }

      // Fetch classifications
      const { data: classificationsData, error: classificationsError } = await supabase
        .from('classifications')
        .select('*')
        .order('name');
      
      if (classificationsError) throw classificationsError;
      setClassifications(classificationsData || []);

      // Fetch current product classifications
      const { data: productClassifications, error: productClassError } = await supabase
        .from('product_classifications')
        .select('classification_id')
        .eq('product_id', product.id);

      if (productClassError) throw productClassError;
      setSelectedClassificationIds(productClassifications?.map(pc => pc.classification_id) || []);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
      toast({
        title: "Error",
        description: "Failed to load form data",
        variant: "destructive",
      });
    }
  };

  const handleBrandChange = (brandId: string) => {
    setSelectedBrandId(brandId);
    setSelectedSubBrandId(""); // Reset sub-brand when brand changes
  };

  const filteredSubBrands = selectedBrandId
    ? subBrands.filter(sb => sb.brand_id === selectedBrandId)
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get brand and subbrand names
      const selectedBrand = brands.find(b => b.id === selectedBrandId);
      const selectedSubBrand = subBrands.find(sb => sb.id === selectedSubBrandId);

      if (!selectedBrand) {
        toast({
          title: "Validation Error",
          description: "Please select a brand",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const productData = {
        "Brand Desc": selectedBrand.name,
        SubBrand: selectedSubBrand?.name || "",
        "Super Category Description": formData["Super Category Description"],
        "Material Desc": formData["Material Desc"],
        "Funskool Code": formData["Funskool Code"],
        "Barcode (UPC/EAN)": formData["Barcode (UPC/EAN)"],
        "MRP (INR)": parseFloat(formData["MRP (INR)"]) || 0,
        QTY: parseInt(formData.QTY) || 0,
        "Elec/ Non Elec": formData["Elec/ Non Elec"],
        age_range: formData.age_range,
        "Sku length": formData["Sku length"] ? parseFloat(formData["Sku length"]) : null,
        "Sku Width": formData["Sku Width"] ? parseFloat(formData["Sku Width"]) : null,
        "Sku Height": formData["Sku Height"] ? parseFloat(formData["Sku Height"]) : null,
        "Unit of measure of SKU length Width and Height": formData["Unit of measure of SKU length Width and Height"],
      };

      // Validate with zod
      const validated = productSchema.parse(productData);

      // Upload image if a new one is provided
      let imageUrl = product.image_url;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const { error } = await supabase
        .from('products')
        .update({ ...validated, image_url: imageUrl })
        .eq('id', product.id);

      if (error) throw error;

      // Update classifications - delete existing and insert new ones
      const { error: deleteError } = await supabase
        .from('product_classifications')
        .delete()
        .eq('product_id', product.id);

      if (deleteError) throw deleteError;

      if (selectedClassificationIds.length > 0) {
        const classificationInserts = selectedClassificationIds.map(classId => ({
          product_id: product.id,
          classification_id: classId,
        }));

        const { error: classError } = await supabase
          .from('product_classifications')
          .insert(classificationInserts);

        if (classError) throw classError;
      }

      toast({
        title: "Success",
        description: "Product updated successfully",
      });

      setOpen(false);
      
      if (onProductUpdated) {
        onProductUpdated();
      }
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update product details below
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Brand Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Select value={selectedBrandId} onValueChange={handleBrandChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subbrand">Sub-Brand</Label>
              <Select 
                value={selectedSubBrandId} 
                onValueChange={setSelectedSubBrandId}
                disabled={!selectedBrandId || filteredSubBrands.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedBrandId ? "Select sub-brand" : "Select brand first"} />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {filteredSubBrands.map((subBrand) => (
                    <SelectItem key={subBrand.id} value={subBrand.id}>
                      {subBrand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Classifications */}
          <div className="space-y-2">
            <Label>Classifications</Label>
            <div className="border rounded-md p-4 space-y-3 max-h-48 overflow-y-auto">
              {classifications
                .filter(c => c.name !== "New Arrivals")
                .map((classification) => (
                <div key={classification.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={classification.id}
                    checked={selectedClassificationIds.includes(classification.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedClassificationIds([...selectedClassificationIds, classification.id]);
                      } else {
                        setSelectedClassificationIds(
                          selectedClassificationIds.filter((id) => id !== classification.id)
                        );
                      }
                    }}
                  />
                  <Label
                    htmlFor={classification.id}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {classification.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Product Image */}
          <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded" />
              </div>
            )}
          </div>

          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name *</Label>
            <Input
              id="productName"
              value={formData["Material Desc"]}
              onChange={(e) => setFormData({ ...formData, "Material Desc": e.target.value })}
              placeholder="e.g., KNIGHT STAR BATMAN"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              value={formData["Super Category Description"]}
              onChange={(e) => setFormData({ ...formData, "Super Category Description": e.target.value })}
              placeholder="e.g., Building Blocks"
              required
            />
          </div>

          {/* SKU and Barcode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU Code *</Label>
              <Input
                id="sku"
                value={formData["Funskool Code"]}
                onChange={(e) => setFormData({ ...formData, "Funskool Code": e.target.value })}
                placeholder="e.g., FS001"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode (UPC/EAN)</Label>
              <Input
                id="barcode"
                value={formData["Barcode (UPC/EAN)"]}
                onChange={(e) => setFormData({ ...formData, "Barcode (UPC/EAN)": e.target.value })}
                placeholder="e.g., 1234567890123"
              />
            </div>
          </div>

          {/* Price and Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">MRP (INR) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData["MRP (INR)"]}
                onChange={(e) => setFormData({ ...formData, "MRP (INR)": e.target.value })}
                placeholder="e.g., 499.99"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qty">Quantity *</Label>
              <Input
                id="qty"
                type="number"
                value={formData.QTY}
                onChange={(e) => setFormData({ ...formData, QTY: e.target.value })}
                placeholder="e.g., 100"
                required
              />
            </div>
          </div>

          {/* Type and Age Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select 
                value={formData["Elec/ Non Elec"]} 
                onValueChange={(value) => setFormData({ ...formData, "Elec/ Non Elec": value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="Non Elec">Non Electronic</SelectItem>
                  <SelectItem value="Elec">Electronic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age Range</Label>
              <Select 
                value={formData.age_range} 
                onValueChange={(value) => setFormData({ ...formData, age_range: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select age range" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="0-2 Years">0-2 Years</SelectItem>
                  <SelectItem value="3-5 Years">3-5 Years</SelectItem>
                  <SelectItem value="6-8 Years">6-8 Years</SelectItem>
                  <SelectItem value="9-12 Years">9-12 Years</SelectItem>
                  <SelectItem value="13+ Years">13+ Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dimensions */}
          <div className="space-y-4">
            <h3 className="font-medium">Dimensions (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="length">Length</Label>
                <Input
                  id="length"
                  type="number"
                  step="0.01"
                  value={formData["Sku length"]}
                  onChange={(e) => setFormData({ ...formData, "Sku length": e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  type="number"
                  step="0.01"
                  value={formData["Sku Width"]}
                  onChange={(e) => setFormData({ ...formData, "Sku Width": e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.01"
                  value={formData["Sku Height"]}
                  onChange={(e) => setFormData({ ...formData, "Sku Height": e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select 
                  value={formData["Unit of measure of SKU length Width and Height"]} 
                  onValueChange={(value) => setFormData({ ...formData, "Unit of measure of SKU length Width and Height": value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="cm">cm</SelectItem>
                    <SelectItem value="inch">inch</SelectItem>
                    <SelectItem value="mm">mm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
import { useState, useEffect } from "react";
import { AddProductDialog } from "./AddProductDialog";
import { EditProductDialog } from "./EditProductDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Search, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

export const InventoryManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newProduct, setNewProduct] = useState({
    "Brand Desc": "",
    "SubBrand": "",
    "QTY": 0,
    "MRP (INR)": 0,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('Brand Desc');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      const { error } = await supabase
        .from('products')
        .insert([newProduct]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product added successfully",
      });

      setIsAddDialogOpen(false);
      setNewProduct({
        "Brand Desc": "",
        "SubBrand": "",
        "QTY": 0,
        "MRP (INR)": 0,
      });
      fetchProducts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStock = async (productId: string, newQuantity: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ QTY: newQuantity })
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Stock updated successfully",
      });

      fetchProducts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive",
      });
    }
  };

  const filteredProducts = products.filter(product =>
    product["Brand Desc"]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.SubBrand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product["Funskool Code"]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product["Material Desc"]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (quantity: number | null) => {
    if (!quantity || quantity === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-800 border-red-200" };
    if (quantity < 10) return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800 border-yellow-200" };
    return { label: "In Stock", color: "bg-green-100 text-green-800 border-green-200" };
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Inventory Management</CardTitle>
            <CardDescription>Manage products and stock levels</CardDescription>
          </div>
          <AddProductDialog onProductAdded={fetchProducts} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Sub-Brand</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>MRP</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.QTY);
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product["Material Desc"] || 'N/A'}</TableCell>
                    <TableCell>{product["Brand Desc"] || 'N/A'}</TableCell>
                    <TableCell>{product.SubBrand || 'N/A'}</TableCell>
                    <TableCell>{product["Super Category Description"] || 'N/A'}</TableCell>
                    <TableCell>{product["Funskool Code"] || 'N/A'}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={product.QTY || 0}
                        onChange={(e) => handleUpdateStock(product.id, parseInt(e.target.value) || 0)}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Badge className={stockStatus.color}>
                        {stockStatus.label}
                      </Badge>
                    </TableCell>
                    <TableCell>₹{product["MRP (INR)"]?.toLocaleString()}</TableCell>
                    <TableCell>
                      <EditProductDialog product={product} onProductUpdated={fetchProducts} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            No products found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

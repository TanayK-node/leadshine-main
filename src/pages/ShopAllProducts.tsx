import { useState, useEffect } from "react";
import { Search, Filter, ShoppingCart, Heart, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products"> & {
  product_images?: Array<{ image_url: string }>;
};

const ShopAllProducts = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState("name");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterAge, setFilterAge] = useState(searchParams.get("age") || "all");
  const [priceFilter, setPriceFilter] = useState(searchParams.get("price") || "all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleAddToCart = async (productId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Login required",
        description: "Please login to add items to cart",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    try {
      await addToCart(productId);
    } catch (error) {
      // Error already handled in context
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_images(image_url)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProducts(data || []);
        setFilteredProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product["Material Desc"]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product["Brand Desc"]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product["Funskool Code"]?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter(product =>
        product["Super Category Description"]?.toLowerCase() === filterCategory.toLowerCase()
      );
    }

    // Age filter
    if (filterAge !== "all") {
      filtered = filtered.filter(product =>
        product.age_range === filterAge
      );
    }

    // Price filter
    if (priceFilter !== "all") {
      filtered = filtered.filter(product => {
        const price = product["MRP (INR)"] || 0;
        switch (priceFilter) {
          case "0-500":
            return price < 500;
          case "500-1000":
            return price >= 500 && price < 1000;
          case "1000-2000":
            return price >= 1000 && price < 2000;
          case "2000-5000":
            return price >= 2000 && price < 5000;
          case "5000+":
            return price >= 5000;
          default:
            return true;
        }
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a["MRP (INR)"] || 0) - (b["MRP (INR)"] || 0);
        case "price-high":
          return (b["MRP (INR)"] || 0) - (a["MRP (INR)"] || 0);
        case "name":
          return (a["Material Desc"] || "").localeCompare(b["Material Desc"] || "");
        case "newest":
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, sortBy, filterCategory, filterAge, priceFilter]);

  const categories = Array.from(new Set(products.map(p => p["Super Category Description"]).filter(Boolean)));
  const ageRanges = ["0-2 Years", "3-5 Years", "6-8 Years", "9-12 Years", "13+ Years"];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-80 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">All Products</h1>
            <p className="text-muted-foreground">
              Showing {filteredProducts.length} of {products.length} products
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 hidden">
          <p className="text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid */}
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
        }>
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {viewMode === "grid" ? (
                  <>
                    <div className="relative overflow-hidden rounded-t-lg">
                  <Link to={`/product/${product.id}`}>
                    {product.product_images && product.product_images.length > 0 ? (
                      <img 
                        src={product.product_images[0].image_url} 
                        alt={product["Material Desc"] || "Product"}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                      />
                    ) : (
                      <div className="w-full h-48 bg-muted flex items-center justify-center group-hover:scale-105 transition-transform duration-300 cursor-pointer">
                        <span className="text-muted-foreground">No Image</span>
                      </div>
                    )}
                  </Link>
                  <Badge className="absolute top-2 right-2 bg-accent">
                    {product["Elec/ Non Elec"]}
                  </Badge>
                  <div className="absolute top-2 left-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="h-8 w-8 p-0"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors cursor-pointer">
                      {product["Material Desc"]}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-2">
                    {product["Brand Desc"]} {product.SubBrand && `• ${product.SubBrand}`}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    SKU: {product["Funskool Code"]}
                  </p>
                  {product.age_range && (
                    <p className="text-xs text-muted-foreground mb-2">
                      Age: {product.age_range}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      ₹{product["MRP (INR)"]}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Stock: {product.QTY}
                    </span>
                  </div>
                  <Button 
                    className="w-full mt-3" 
                    size="sm"
                    onClick={() => handleAddToCart(product.id)}
                    disabled={!product.QTY || product.QTY === 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {!product.QTY || product.QTY === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-4 p-4">
                    <Link to={`/product/${product.id}`}>
                      {product.product_images && product.product_images.length > 0 ? (
                        <img 
                          src={product.product_images[0].image_url} 
                          alt={product["Material Desc"] || "Product"}
                          className="w-24 h-24 object-cover rounded cursor-pointer"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-muted flex items-center justify-center rounded cursor-pointer">
                          <span className="text-xs text-muted-foreground">No Image</span>
                        </div>
                      )}
                    </Link>
                    
                    <div className="flex-1">
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer">
                          {product["Material Desc"]}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {product["Brand Desc"]} {product.SubBrand && `• ${product.SubBrand}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {product["Super Category Description"]} • SKU: {product["Funskool Code"]}
                      </p>
                      {product.age_range && (
                        <p className="text-xs text-muted-foreground">
                          Age: {product.age_range}
                        </p>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">₹{product["MRP (INR)"]}</p>
                      <p className="text-sm text-muted-foreground">Stock: {product.QTY}</p>
                      <div className="flex gap-2 mt-2">
                        <Button 
                          size="sm"
                          onClick={() => handleAddToCart(product.id)}
                          disabled={!product.QTY || product.QTY === 0}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          {!product.QTY || product.QTY === 0 ? "Out of Stock" : "Add to Cart"}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found matching your criteria.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ShopAllProducts;
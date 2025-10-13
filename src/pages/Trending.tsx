import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Filter, Heart, ShoppingCart, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

const Trending = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { addToCart } = useCart();

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
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // For trending, we'll show products from all classifications but limit to 20
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(20);

      if (error) throw error;
      setProducts(data || []);
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

  const filteredProducts = products.filter(product =>
    product["Brand Desc"]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product["Material Desc"]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            Trending Products
          </h1>
          <p className="text-muted-foreground">Most popular toys and games right now!</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">No products found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="relative mb-4 overflow-hidden rounded-lg bg-muted aspect-square">
                    <Link to={`/product/${product.id}`}>
                      <img
                        src="/placeholder.svg"
                        alt={product["Brand Desc"] || "Product"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </Link>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Badge className="absolute top-2 left-2 bg-orange-500">TRENDING</Badge>
                  </div>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold mb-1 hover:text-primary transition-colors">
                      {product["Material Desc"]}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-2">{product["Brand Desc"]} {product.SubBrand && `• ${product.SubBrand}`}</p>
                  {product.age_range && (
                    <p className="text-xs text-muted-foreground mb-2">Age: {product.age_range}</p>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-primary">₹{product["MRP (INR)"]}</span>
                    <span className="text-sm text-muted-foreground">Stock: {product.QTY}</span>
                  </div>
                  <Button className="w-full" size="sm" onClick={() => handleAddToCart(product.id)}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Trending;

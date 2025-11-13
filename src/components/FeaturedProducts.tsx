import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const FeaturedProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images(image_url)
        `)
        .limit(4);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load featured products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading featured products...</div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular wholesale toys, carefully selected for their 
            quality, safety, and educational value.
          </p>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group hover-lift border-0 shadow-card overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <Link to={`/product/${product.id}`}>
                    {product.product_images && product.product_images.length > 0 ? (
                      <img
                        src={product.product_images[0].image_url}
                        alt={product["Material Desc"] || product["Brand Desc"] || "Product"}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-48 bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">No Image</span>
                      </div>
                    )}
                  </Link>
                  
                  {/* Badge */}
                  <Badge className="absolute top-3 left-3 bg-primary text-white">
                    Featured
                  </Badge>
                  {product.QTY && product.QTY <= 3 && product.QTY > 0 && (
                    <Badge className="absolute top-3 right-3 bg-orange-500 text-white">
                      Low in Stock
                    </Badge>
                  )}
                  
                  {/* Quick actions */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="secondary" className="h-8 w-8">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Quick add to cart on hover */}
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="sm" className="w-full">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Quick Add
                    </Button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">
                    {product["Brand Desc"]} {product.SubBrand && `• ${product.SubBrand}`}
                  </div>
                  
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {product["Material Desc"]}
                    </h3>
                  </Link>
                  
                  {product.age_range && (
                    <div className="text-xs text-muted-foreground mb-3">
                      Age: {product.age_range}
                    </div>
                  )}
                  
                  {/* Price */}
                  <div className="flex items-center gap-2">
                    {product.discount_price ? (
                      <>
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{product["MRP (INR)"]}
                        </span>
                        <span className="text-lg font-bold text-primary">
                          ₹{product.discount_price}
                        </span>
                        <Badge variant="destructive" className="text-xs">
                          {Math.round((1 - product.discount_price / product["MRP (INR)"]) * 100)}% OFF
                        </Badge>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-primary">
                        ₹{product["MRP (INR)"]}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link to="/shop-all">
            <Button size="lg" className="rounded-full h-14 px-10 font-display font-bold text-lg shadow-glow hover-pop border-4 border-foreground">
              View All Products 🚀
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

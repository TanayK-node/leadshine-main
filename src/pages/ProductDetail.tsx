import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Heart, Share2, Package, Truck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart: addToCartContext } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProduct(data);

        // Fetch product images
        const { data: images } = await supabase
          .from('product_images')
          .select('image_url')
          .eq('product_id', id)
          .order('display_order');
        
        if (images && images.length > 0) {
          setProductImages(images.map(img => img.image_url));
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, toast]);

  const addToCart = async () => {
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

    if (!id) return;

    try {
      // Add to cart multiple times based on quantity
      for (let i = 0; i < quantity; i++) {
        await addToCartContext(id);
      }
      toast({
        title: "Added to Cart",
        description: `${quantity} item(s) added to your cart`,
      });
    } catch (error) {
      // Error already handled in context
    }
  };

  const addToWishlist = () => {
    toast({
      title: "Added to Wishlist",
      description: "Product added to your wishlist",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-96 bg-muted rounded"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-6 bg-muted rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link to="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span className="text-foreground">{product["Material Desc"]}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
          {/* Product Image */}
          <div className="space-y-3 md:space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
              {productImages.length > 0 ? (
                <img 
                  src={productImages[currentImageIndex]} 
                  alt={product["Material Desc"] || "Product"} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="h-16 md:h-24 w-16 md:w-24 text-muted-foreground" />
              )}
            </div>
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded border-2 overflow-hidden ${
                      index === currentImageIndex ? 'border-primary' : 'border-muted'
                    }`}
                  >
                    <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4 md:space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {product["Material Desc"]}
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                {product["Brand Desc"]} {product.SubBrand && `• ${product.SubBrand}`}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                Category: {product["Super Category Description"]}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                SKU: {product["Funskool Code"]}
              </p>
              {product.age_range && (
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  Age Range: {product.age_range}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <span className="text-2xl md:text-3xl font-bold text-primary">
                ₹{product["MRP (INR)"]}
              </span>
              <Badge variant={product.QTY && product.QTY > 0 ? "default" : "destructive"}>
                {product.QTY && product.QTY > 0 ? `${product.QTY} in stock` : "Out of stock"}
              </Badge>
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-sm">
              <div>
                <span className="text-muted-foreground text-xs md:text-sm">Product Name:</span>
                <p className="font-medium text-sm md:text-base">{product["Material Desc"]}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs md:text-sm">Brand:</span>
                <p className="font-medium text-sm md:text-base">{product["Brand Desc"]}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs md:text-sm">Sub-Brand:</span>
                <p className="font-medium text-sm md:text-base">{product.SubBrand || "N/A"}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs md:text-sm">Type:</span>
                <p className="font-medium text-sm md:text-base">{product["Elec/ Non Elec"]}</p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Quantity:</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.QTY || 0, quantity + 1))}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Button 
                className="flex-1" 
                size="lg"
                onClick={addToCart}
                disabled={!product.QTY || product.QTY === 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" size="lg" onClick={addToWishlist} className="flex-1 sm:flex-none">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="flex-1 sm:flex-none">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-col gap-3 pt-4">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-primary" />
                <span>Free shipping on orders over ₹500</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span>1 year warranty included</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="specifications" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="specifications" className="text-xs sm:text-sm">Specifications</TabsTrigger>
            <TabsTrigger value="description" className="text-xs sm:text-sm">Description</TabsTrigger>
            <TabsTrigger value="shipping" className="text-xs sm:text-sm">Shipping Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Dimensions</h4>
                    <p className="text-sm text-muted-foreground">
                      Length: {product["Sku length"]} {product["Unit of measure of SKU length Width and Height"]}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Width: {product["Sku Width"]} {product["Unit of measure of SKU length Width and Height"]}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Height: {product["Sku Height"]} {product["Unit of measure of SKU length Width and Height"]}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Product Details</h4>
                    <p className="text-sm text-muted-foreground">
                      Name: {product["Material Desc"]}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Brand: {product["Brand Desc"]}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Sub-Brand: {product.SubBrand || "N/A"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Type: {product["Elec/ Non Elec"]}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  High-quality {product["Material Desc"]}. 
                  From {product["Brand Desc"]} {product.SubBrand && `(${product.SubBrand})`}. 
                  This {product["Elec/ Non Elec"]} product is perfect for its intended use and meets all safety standards.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="shipping" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Delivery Options</h4>
                  <p className="text-sm text-muted-foreground">
                    • Standard Delivery: 3-5 business days
                  </p>
                  <p className="text-sm text-muted-foreground">
                    • Express Delivery: 1-2 business days
                  </p>
                  <p className="text-sm text-muted-foreground">
                    • Free shipping on orders over ₹500
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Return Policy</h4>
                  <p className="text-sm text-muted-foreground">
                    Easy returns within 30 days of purchase. Product must be in original condition.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
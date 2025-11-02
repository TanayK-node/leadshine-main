import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleMoveToCart = async (productId: string) => {
    await addToCart(productId);
    await removeFromWishlist(productId);
    toast({
      title: "Moved to Cart",
      description: "Product moved from wishlist to cart",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-8 w-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold">My Wishlist</h1>
        </div>

        {wishlistItems.length === 0 ? (
          <Card className="p-8 md:p-12 text-center">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Start adding products you love to your wishlist
            </p>
            <Link to="/">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlistItems.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <Link to={`/product/${product.id}`}>
                    <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product["Material Desc"] || "Product"} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      ) : (
                        <Heart className="h-16 w-16 text-muted-foreground" />
                      )}
                    </div>
                  </Link>
                  
                  <CardContent className="p-4">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-semibold mb-1 hover:text-primary line-clamp-2">
                        {product["Material Desc"]}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-2">
                      {product["Brand Desc"]}
                    </p>
                    <p className="text-lg font-bold text-primary mb-4">
                      ₹{product["MRP (INR)"]}
                    </p>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleMoveToCart(product.id)}
                        disabled={!product.QTY || product.QTY === 0}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add to Cart
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFromWishlist(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;

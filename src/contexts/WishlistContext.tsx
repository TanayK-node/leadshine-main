import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

interface WishlistContextType {
  wishlistItems: Product[];
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchWishlist();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        fetchWishlist();
      } else if (event === 'SIGNED_OUT') {
        setWishlistItems([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchWishlist = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      setWishlistItems([]);
      setLoading(false);
      return;
    }

    try {
      const { data: wishlistData, error } = await supabase
        .from('wishlist')
        .select('product_id')
        .eq('user_id', session.user.id);

      if (error) throw error;

      if (wishlistData && wishlistData.length > 0) {
        const productIds = wishlistData.map(item => item.product_id);
        
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds);

        if (productsError) throw productsError;
        
        // Fetch product images for each product
        const productsWithImages = await Promise.all(
          (products || []).map(async (product) => {
            const { data: images } = await supabase
              .from('product_images')
              .select('image_url')
              .eq('product_id', product.id)
              .order('display_order')
              .limit(1);
            
            return {
              ...product,
              image_url: images && images.length > 0 ? images[0].image_url : product.image_url
            };
          })
        );
        
        setWishlistItems(productsWithImages);
      } else {
        setWishlistItems([]);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Login required",
        description: "Please login to add items to wishlist",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('wishlist')
        .insert({
          user_id: session.user.id,
          product_id: productId,
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already in wishlist",
            description: "This item is already in your wishlist",
          });
          return;
        }
        throw error;
      }

      await fetchWishlist();
      toast({
        title: "Added to Wishlist",
        description: "Product added to your wishlist",
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to add item to wishlist",
        variant: "destructive",
      });
    }
  };

  const removeFromWishlist = async (productId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return;

    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', session.user.id)
        .eq('product_id', productId);

      if (error) throw error;

      await fetchWishlist();
      toast({
        title: "Removed from Wishlist",
        description: "Product removed from your wishlist",
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      });
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider 
      value={{ 
        wishlistItems, 
        addToWishlist, 
        removeFromWishlist, 
        isInWishlist,
        loading 
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

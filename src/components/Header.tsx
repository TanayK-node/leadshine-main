import { useState, useEffect } from "react";
import { ShoppingCart, Search, Menu, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import leadShineLogo from "@/assets/leadshine-logo.png";

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cartCount } = useCart();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      // Clear local user state first
      setUser(null);
      
      // Then attempt to sign out from Supabase
      await supabase.auth.signOut();
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/");
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/");
    }
  };

  return (
    <header className="bg-card shadow-card border-b border-border">
      {/* Top banner */}
      <div className="bg-gradient-primary text-primary-foreground text-center py-2 px-4">
        <p className="text-sm font-medium">
          🎉 BIGGEST Wholesale Sale - Up to 50% Off + Free Shipping on Orders $500+
        </p>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <a href="/" className="flex items-center space-x-3">
              <img 
                src={leadShineLogo} 
                alt="Leadshine Logo" 
                className="h-10 w-auto"
              />
              <span className="font-display font-bold text-xl text-foreground">
                Leadshine
              </span>
            </a>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search toys, games, and more..."
                className="pl-10 pr-4 bg-muted/50 border-muted focus:bg-background"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/orders')}
                  className="hidden md:flex"
                >
                  Orders
                </Button>
                <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
                  <User className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/cart')}>
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="hidden md:flex"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => navigate('/auth')}
              >
                Login
              </Button>
            )}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 hidden md:block">
          <ul className="flex space-x-8">
            <li>
              <a href="/shop-all" className="text-foreground hover:text-primary font-medium transition-colors">
                Shop All Products
              </a>
            </li>
            <li>
              <a href="/new-arrivals" className="text-foreground hover:text-primary font-medium transition-colors">
                New Arrivals
              </a>
            </li>
            <li>
              <a href="/trending" className="text-foreground hover:text-primary font-medium transition-colors">
                Trending
              </a>
            </li>
            <li>
              <a href="/school-essentials" className="text-foreground hover:text-primary font-medium transition-colors">
                School Essentials
              </a>
            </li>
            <li>
              <a href="/toys-and-games" className="text-foreground hover:text-primary font-medium transition-colors">
                Toys & Games
              </a>
            </li>
            <li>
              <a href="/kids-accessories" className="text-foreground hover:text-primary font-medium transition-colors">
                Kids Accessories
              </a>
            </li>
            <li>
              <a href="/art-and-crafts" className="text-foreground hover:text-primary font-medium transition-colors">
                Art & Crafts
              </a>
            </li>
            <li>
              <a href="#shop-by-age" className="text-foreground hover:text-primary font-medium transition-colors">
                Shop by Age
              </a>
            </li>
            <li>
              <a href="#shop-by-price" className="text-foreground hover:text-primary font-medium transition-colors">
                Shop by Price
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
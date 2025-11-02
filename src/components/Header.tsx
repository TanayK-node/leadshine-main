import { useState, useEffect } from "react";
import { ShoppingCart, Search, Menu, User, LogOut, X, Heart, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import leadShineLogo from "@/assets/leadshine-logo.png";

interface AnnouncementBanner {
  text: string;
  button_text: string | null;
  button_link: string | null;
  is_active: boolean;
  bg_color: string;
  text_color: string;
}

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState("all");
  const [banner, setBanner] = useState<AnnouncementBanner | null>(null);

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      const { data, error } = await supabase
        .from("announcement_banner")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) setBanner(data);
    } catch (error) {
      console.error("Error fetching banner:", error);
    }
  };

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

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (priceFilter !== "all") params.set("price", priceFilter);
    if (ageFilter !== "all") params.set("age", ageFilter);
    
    navigate(`/shop-all?${params.toString()}`);
    setSearchOpen(false);
    setSearchTerm("");
    setPriceFilter("all");
    setAgeFilter("all");
  };

  return (
    <header className="bg-card shadow-card border-b border-border">
      {/* Top banner */}
      {banner && (
        <div className={`${banner.bg_color} ${banner.text_color} text-center py-2 px-4`}>
          <div className="flex items-center justify-center gap-4">
            <p className="text-sm font-medium">{banner.text}</p>
            {banner.button_text && banner.button_link && (
              <Link to={banner.button_link}>
                <Button size="sm" variant="secondary" className="h-7 text-xs">
                  {banner.button_text}
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0">
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
          <div className="hidden md:flex flex-1 max-w-2xl mx-4">
            <Popover open={searchOpen} onOpenChange={setSearchOpen}>
              <PopoverTrigger asChild>
                <div className="relative w-full cursor-pointer">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
                  <Input
                    placeholder="Search toys, games, and more..."
                    className="pl-10 pr-10 bg-muted/50 border-muted focus:bg-background cursor-pointer"
                    readOnly
                  />
                  <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-4" align="start">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Search Products</label>
                    <Input
                      placeholder="Enter product name, brand..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Price Range</label>
                    <Select value={priceFilter} onValueChange={setPriceFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select price range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Prices</SelectItem>
                        <SelectItem value="0-500">Under ₹500</SelectItem>
                        <SelectItem value="500-1000">₹500 - ₹1000</SelectItem>
                        <SelectItem value="1000-2000">₹1000 - ₹2000</SelectItem>
                        <SelectItem value="2000-5000">₹2000 - ₹5000</SelectItem>
                        <SelectItem value="5000+">Above ₹5000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Age Range</label>
                    <Select value={ageFilter} onValueChange={setAgeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select age range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ages</SelectItem>
                        <SelectItem value="0-2 Years">0-2 Years</SelectItem>
                        <SelectItem value="3-5 Years">3-5 Years</SelectItem>
                        <SelectItem value="6-8 Years">6-8 Years</SelectItem>
                        <SelectItem value="9-12 Years">9-12 Years</SelectItem>
                        <SelectItem value="13+ Years">13+ Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button onClick={handleSearch} className="w-full">
                    <Search className="h-4 w-4 mr-2" />
                    Search Products
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
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
                <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/wishlist')}>
                  <Heart className="h-5 w-5" />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center">
                      {wishlistItems.length}
                    </span>
                  )}
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
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  <a 
                    href="/shop-all" 
                    className="text-foreground hover:text-primary font-medium transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Shop All Products
                  </a>
                  <a 
                    href="/new-arrivals" 
                    className="text-foreground hover:text-primary font-medium transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    New Arrivals
                  </a>
                  <a 
                    href="/trending" 
                    className="text-foreground hover:text-primary font-medium transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Trending
                  </a>
                  <a 
                    href="/school-essentials" 
                    className="text-foreground hover:text-primary font-medium transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    School Essentials
                  </a>
                  <a 
                    href="/toys-and-games" 
                    className="text-foreground hover:text-primary font-medium transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Toys & Games
                  </a>
                  <a 
                    href="/kids-accessories" 
                    className="text-foreground hover:text-primary font-medium transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Kids Accessories
                  </a>
                  <a 
                    href="/art-and-crafts" 
                    className="text-foreground hover:text-primary font-medium transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Art & Crafts
                  </a>
                  {user && (
                    <>
                      <a 
                        href="/wishlist" 
                        className="text-foreground hover:text-primary font-medium transition-colors py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Wishlist
                      </a>
                      <a 
                        href="/orders" 
                        className="text-foreground hover:text-primary font-medium transition-colors py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Orders
                      </a>
                      <Button 
                        variant="ghost" 
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="justify-start px-0"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 hidden md:block">
          <ul className="flex space-x-6 justify-center">
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
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
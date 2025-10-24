import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import NewArrivals from "./pages/NewArrivals";
import Trending from "./pages/Trending";
import SchoolEssentials from "./pages/SchoolEssentials";
import ToysAndGames from "./pages/ToysAndGames";
import KidsAccessories from "./pages/KidsAccessories";
import ArtAndCrafts from "./pages/ArtAndCrafts";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import ProductDetail from "./pages/ProductDetail";
import ShopAllProducts from "./pages/ShopAllProducts";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/shop-all" element={<ShopAllProducts />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/new-arrivals" element={<NewArrivals />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/school-essentials" element={<SchoolEssentials />} />
          <Route path="/toys-and-games" element={<ToysAndGames />} />
          <Route path="/kids-accessories" element={<KidsAccessories />} />
          <Route path="/art-and-crafts" element={<ArtAndCrafts />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

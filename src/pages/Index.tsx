import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import SpecialOffers from "@/components/SpecialOffers";
import ShopByAge from "@/components/ShopByAge";
import ShopByPrice from "@/components/ShopByPrice";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CategorySection />
        <ShopByAge />
        <FeaturedProducts />
        <ShopByPrice />
        <SpecialOffers />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

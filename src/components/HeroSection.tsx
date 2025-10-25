import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import heroToysImage from "@/assets/hero-toys.jpg";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-hero min-h-[600px] flex items-center overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-toy-pink rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-toy-blue rounded-full animate-pulse delay-75"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-toy-yellow rounded-full animate-pulse delay-150"></div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-6 md:space-y-8">
            <div className="space-y-3 md:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
                Premium{" "}
                <span className="text-primary font-display">Wholesale Toys</span>{" "}
                for Every Child
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
                Discover our curated collection of educational, safe, and fun toys. 
                Perfect for retailers, educators, and toy distributors worldwide.
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-card rounded-full px-4 py-2 shadow-card">
                <Star className="h-4 w-4 text-primary fill-primary" />
                <span className="text-sm font-medium">Premium Quality</span>
              </div>
              <div className="flex items-center space-x-2 bg-card rounded-full px-4 py-2 shadow-card">
                <Star className="h-4 w-4 text-primary fill-primary" />
                <span className="text-sm font-medium">Safety Certified</span>
              </div>
              <div className="flex items-center space-x-2 bg-card rounded-full px-4 py-2 shadow-card">
                <Star className="h-4 w-4 text-primary fill-primary" />
                <span className="text-sm font-medium">Bulk Discounts</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" className="group">
                Shop Wholesale Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl">
                View Catalog
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 pt-6 md:pt-8">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-display font-bold text-primary">500+</div>
                <div className="text-xs md:text-sm text-muted-foreground">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-display font-bold text-primary">50K+</div>
                <div className="text-xs md:text-sm text-muted-foreground">Happy Retailers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-display font-bold text-primary">98%</div>
                <div className="text-xs md:text-sm text-muted-foreground">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right image */}
          <div className="relative mt-8 lg:mt-0">
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-glow">
              <img
                src={heroToysImage}
                alt="Premium wholesale toys collection including educational blocks, plush toys, and colorful vehicles"
                className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating promotion card */}
            <div className="absolute -bottom-4 md:-bottom-6 left-4 md:-left-6 bg-card rounded-xl md:rounded-2xl p-4 md:p-6 shadow-glow border border-border">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-display font-bold text-primary mb-1">50%</div>
                <div className="text-xs md:text-sm text-muted-foreground">Bulk Discount</div>
                <div className="text-xs text-muted-foreground">on first order</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
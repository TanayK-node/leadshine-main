import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Shield, Package, TrendingUp } from "lucide-react";
import heroBackground from "@/assets/hero-background.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={heroBackground}
          alt="Colorful toys background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-background/40 to-transparent"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-3xl">
          {/* Main content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">India's #1 Toy Wholesaler</span>
            </div>

            {/* Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-foreground leading-[1.1] drop-shadow-lg">
                Bringing Joy to{" "}
                <span className="text-primary">Every Child</span>
              </h1>
              <p className="text-xl sm:text-2xl text-foreground leading-relaxed max-w-2xl drop-shadow-md">
                Premium wholesale toys from trusted brands. Quality, safety, and fun guaranteed for retailers nationwide.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="hero" size="xl" className="group">
                Explore Collection
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl" className="backdrop-blur-sm">
                Get Wholesale Pricing
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-border/50">
              <div>
                <div className="text-4xl font-display font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Happy Retailers</div>
              </div>
              <div>
                <div className="text-4xl font-display font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Products</div>
              </div>
              <div>
                <div className="text-4xl font-display font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
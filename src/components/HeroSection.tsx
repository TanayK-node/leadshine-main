import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Shield, Package, TrendingUp } from "lucide-react";
import heroBackground from "@/assets/hero-background.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-background via-muted/30 to-accent-light/20">
      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Background image */}
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none">
        <img
          src={heroBackground}
          alt="Colorful toys background"
          className="w-full h-full object-cover animate-float"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-3xl">
          {/* Main content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-5 py-2 border-3 border-foreground shadow-sticker hover-tilt">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-sm font-display font-bold text-foreground">India's #1 Toy Wholesaler 🏆</span>
            </div>

            {/* Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-foreground leading-[1.1]">
                Bringing Joy to{" "}
                <span className="text-primary relative inline-block">
                  Every Child
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 6C80 2 220 2 298 6" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-accent"/>
                  </svg>
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-foreground/80 leading-relaxed max-w-2xl font-display">
                Premium wholesale toys from trusted brands. Quality, safety, and fun guaranteed for retailers nationwide. ✨
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="hero" size="xl" className="group">
                Explore Collection
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl">
                Get Wholesale Pricing 💰
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8">
              <div className="bg-white rounded-2xl px-6 py-4 border-3 border-foreground shadow-sticker hover-tilt">
                <div className="text-4xl font-display font-bold text-primary">50K+</div>
                <div className="text-sm font-display text-muted-foreground">Happy Retailers</div>
              </div>
              <div className="bg-white rounded-2xl px-6 py-4 border-3 border-foreground shadow-sticker hover-tilt">
                <div className="text-4xl font-display font-bold text-primary">500+</div>
                <div className="text-sm font-display text-muted-foreground">Products</div>
              </div>
              <div className="bg-white rounded-2xl px-6 py-4 border-3 border-foreground shadow-sticker hover-tilt">
                <div className="text-4xl font-display font-bold text-primary">98%</div>
                <div className="text-sm font-display text-muted-foreground">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;